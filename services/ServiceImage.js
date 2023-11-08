const AWS = require('aws-sdk');
var fs = require('fs');
const resizeImage = require('../jobs/resizeImage');
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({ endpoint: spacesEndpoint, accessKeyId: process.env.DO_SPACES_KEY, secretAccessKey: process.env.DO_SPACES_SECRET });

module.exports = class ImageService {
  /**
   * Constructor for image service
   * @param {object} req the request object
   */
  constructor(req, dest, sizes) {
    this.headers = req.headers;
    this.connection = req.connection;
    this.files = req.files;
    this.destinationFolder = dest;
    if (sizes) this.sizes = sizes;
    if (req.userData) this.ref = req.userData.id;
    this.toSaveLogs = []
    this.toDelete = []
  }

  DeleteFilesLocally() {
    this.toDelete.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully:', filePath);
        }
      });
    });
  }

  generateS3Params(file, name) {
    const fileContent = fs.readFileSync(file);
    let params = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: name,
      Body: fileContent,
      ACL: 'public-read',
    };
    return params;
  }

  async uploadFilesToS3() {
    await Promise.all(
      this.files.map(async (item) => {
        let p = this.generateS3Params(item.path, `${this.destinationFolder}/${item.filename}`);
        let res = await s3.upload(p).promise();
        let obj = {
          name: item.originalname,
          original: {
            url: res.Location,
            width: item.width,
            size: item.size,
            Key: res.Key,
            Bucket: res.Bucket,
          }
        };
        this.toSaveLogs.push(obj);
        this.toDelete.push(item.path); // delete local file of original image
      })
    )
    return this.toSaveLogs;
  }

  /**
   * Resize and save the images to the destination folder
   */
  async ResizeAndSaveToFolder() {
    const dest = this.destinationFolder;
    const files = await resizeImage(this.files, 60, dest, this.sizes);

    await Promise.all(
      files.map(async (item) => {

        let p = this.generateS3Params(item.original.path, `${dest}/${item.original.filename}`);
        let ognRes = await s3.upload(p).promise();
        let original = item.original;
        let obj = {
          name: original.originalname,
          original: {
            url: ognRes.Location,
            width: original.width,
            size: original.size,
            Key: ognRes.Key,
            Bucket: ognRes.Bucket,
          }
        };

        const uploadPromises = item.variants.map((file) => {
          this.toDelete.push(file.dest); // delete local file of resized image
          let params = this.generateS3Params(file.dest, `${dest}/${file.name}`)
          return s3.upload(params).promise();
        });

        let res = await Promise.all(uploadPromises);

        obj.variants = res.map((v, index) => {
          return {
            url: v.Location,
            width: item.variants[index].image.width,
            size: item.variants[index].image.size,
            Key: v.Key,
            Bucket: v.Bucket,
          }
        });
        this.toSaveLogs.push(obj);
        this.toDelete.push(original.path); // delete local file of original image
      })
    );
    return this.toSaveLogs;
  }
}
