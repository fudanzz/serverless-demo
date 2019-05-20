'use strict';

const co         = require("co");
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Jimp = require('jimp'); //https://github.com/oliver-moran/jimp


module.exports.handler = co.wrap(function* (event, context, callback) {

  let bucket = event.Records[0].s3.bucket.name;
  let key = event.Records[0].s3.object.key;
  console.log(` uploaded file ${key} into bucket ${bucket}`);

  const newKey = replacePrefix(key);
  const height = 512;

  const data = yield getS3Object(bucket, key);

  resizer(data.Body, height).then(buffer => putS3Object(bucket, newKey, buffer));

  callback(null, { message: 'The thumbnail was created' });


});


function* getS3Object(bucket, key) {
  const data = yield S3.getObject({
    Bucket: bucket,
    Key: key
  }).promise();

  return data;
}

function putS3Object(bucket, key, body) {

  return S3.putObject({
    Body: body,
    Bucket: bucket,
    ContentType: 'image/jpg',
    Key: key
  }).promise();
}

function replacePrefix(key, extra) {
  const uploadPrefix = 'uploads/';
  let thumbnailsPrefix = 'thumbnails/';

  if (extra !== null && extra !== undefined) {
    thumbnailsPrefix = thumbnailsPrefix + extra;
  }

  return key.replace(uploadPrefix, thumbnailsPrefix);
}


function resizer(data, height) {
  return Jimp.read(data)
    .then(image => {
      return image
        .resize(Jimp.AUTO, height)
        .quality(100) // set JPEG quality
        .getBufferAsync(Jimp.MIME_JPEG);
    })
    .catch(err => err);
}
