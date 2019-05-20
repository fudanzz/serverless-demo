'use strict';

const imageManger = require('../libs/imageMetadataManager');

module.exports.handler = function (event, context, callback) {

  const bucket = event.bucketName;
  const key = event.objectKey;
  console.log('saveImageMetadata was called');

  imageMetadataManager
    .saveImageMetadata(bucket, key, false)
    .then(() => {
      console.log('Save image metadata was completed');
      callback(null, null);
    })
    .catch(error => {
      console.log(error);
      callback(null, null);
    });
};

