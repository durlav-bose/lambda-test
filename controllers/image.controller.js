
const asyncMiddleware = require("../middleware/async");
const ImageService = require("../services/ServiceImage");

exports.upload = asyncMiddleware(async (req, res) => {
    const sizes = req.query && req.query.sizes ? req.query.sizes.split(',') : [-1];
    const dest = req.userData.shop;

    if(!req.files) throw new Error('NO_FILE');

    //check error
    if(sizes.length > parseInt(process.env.MAX_NUMBER_IMAGE_RESIZE)) throw new Error('IMAGE_RESIZE_EXCEED');
    
    let p = new ImageService(req, dest, sizes);
    let data;
    if(sizes[0] == -1) {
        data =  await p.uploadFilesToS3();
    }
    else {
        data = await p.ResizeAndSaveToFolder();
    }
    res.status(201).send(data);
    p.DeleteFilesLocally();

    return res.status(201).send({message: 'success'});
});

