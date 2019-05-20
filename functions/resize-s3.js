'use strict';

const resizer = require('../libs/resizer');

module.exports.handler = function (event, context, callback) {
  console.log(event);

  //let bucket = event.Records[0].s3.bucket.name;
  //let key = event.Records[0].s3.object.key;
  const bucket = event.bucketName;
  const key = event.objectKey;
  console.log(` uploaded file ${key} into bucket ${bucket}`);

 resizer
    .resize(bucket, key)
    .then(() => {
      console.log(`The thumbnail was created`);
      callback(null, { message: 'The thumbnail was created' });
    })
    .catch(error => {
      console.log(error);
      callback(error);
    });
};

