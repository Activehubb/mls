const axios = require("axios");
const express = require("express");
const https = require("https");
const fs = require("fs");
const download = require("download");
const { keys } = require("./config/config");
const { get } = require("request");
const { uploadFile } = require("./s3");
const path = require("path");
const PORT = 3000;
const url = keys.url;
let currentUri = url;

const app = express();

// app.get("/api/v1/property", (req, res) => {});

async function getCurrentApi() {
  try {
    const options = {
      headers: {
        Authorization: keys.auth,
      },
    };

    if (currentUri === undefined) return;
    const request = await axios(currentUri, options);

    const response = request.data;

    currentUri = response["@odata.nextLink"];

    response.value.map(async (data) => {
      const media = data.Media;

      if (media != undefined) {
        // await Promise.all(
        //   media.map((getUrlLink) => {
        //     download(getUrlLink.MediaURL, __dirname + "/upload");
        //   })
        // );

        function downloadMedia(url) {
          const filename = path.basename(url);

          const req = https.get(url, function (res) {
            const fileStream = fs.createWriteStream(uploadFile(filename));

            res.pipe(fileStream);

            fileStream.on("error", (err) => {
              console.log(err);
            });

            fileStream.on("finish", function () {
              fileStream.close();

              console.log("done");
            });
          });

          req.on("error", (err) => {
            console.log(`ERR: ${err}`);
          });
        }

        media.map(async (getMediaUrl) => {
          try {
            const mediaURL = getMediaUrl.MediaURL;

            downloadMedia(mediaURL);
          } catch (error) {
            // console.log(error);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

getCurrentApi();

app.listen(PORT, () => {
  console.log(`Server running`);
});
