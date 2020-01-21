var aws = require("aws-sdk");
var fs = require("fs");

function setupAws() {
  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION
  });
  const s3 = new aws.S3();
  return s3;
}

module.exports = {
  setupAws
};
