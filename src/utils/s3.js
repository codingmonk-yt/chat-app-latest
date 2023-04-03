import AWS from 'aws-sdk';

const S3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'ap-south-1',
  accessKeyId: '', // YOUR AWS ACCESS KEY
  secretAccessKey: '', // YOUR AWS SECRET ACCESS KEY
});


export default S3;