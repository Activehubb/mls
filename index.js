const axios = require("axios");
const stream = require('stream');
const request = require('request');
require('dotenv').config()

const { uploadFile } = require("./s3");

const { MongoClient } = require('mongodb');
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);

const url = process.env.url;
let currentUri = url;

async function uploadMedia(url, key) {
  console.log('Download and uploading image from == ', url);
  const pass = new stream.PassThrough();
  request(url).pipe(pass);
  await uploadFile(pass, key);
  console.log('Successfully done == ', url);
}

async function getApiData() {
  try {
    const options = {
      headers: {
        Authorization:  process.env.auth,
      },
    };

    do {
      const request = await axios(currentUri, options);
      const response = request.data;
      console.log(`Going to process url == ${currentUri}`)

      for (const data of response.value) {
        const mediaData = data.Media;
        if (mediaData != null) {

          for (const media of mediaData) {
            try {
              await uploadMedia(media.MediaURL, media.MediaKey);
              const collection = client.db().collection('media_urls');
              await collection.insertOne({ media_url: media.MediaURL, aws_url: media.MediaKey });
            } catch (error) {
              console.log('Unable to store the media ' + media.MediaURL)
            }

          }
        }

      }
      // get the next uri
      console.error(`DONE === ${currentUri}`)
      currentUri = response["@odata.nextLink"]
    } while (currentUri && currentUri != null)
  } catch (error) {
    console.log(error);
  }
}


client.connect().then(async () => {
  await getApiData();
})





      // await Promise.all(response.value.map(async (data) => {
      //   console.log(data);
      //   await new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, 5000);
      //   });
      // }));

      // console.log(response.value.length);
      // await Promise.all(response.value.map(async (data) => {
      //   const mediaData = data.Media;
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, 5000);
      //   })
      //   // if (mediaData != undefined) {
      //   //   mediaData.map(async (media) => {
      //   //     try {
      //   //       await new Promise((resolve, reject) => {
      //   //         setTimeout(() => {
      //   //           resolve();
      //   //         }, 5000);
      //   //       })
      //   //       // await uploadMedia(media.MediaURL, media.MediaKey);
      //   //       // const collection = client.db().collection('media_urls');
      //   //       // await collection.insertOne({ media_url: media.MediaURL, aws_url: media.MediaKey });
      //   //     } catch (error) {
      //   //       console.error(`Failed to get url for === ${mediaUrl}`)
      //   //       reject();
      //   //     }
      //   //   });
      //   // }
      // }));
