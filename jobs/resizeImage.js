/* RESIZE OPTIMIZE IMAGES */
const sharp = require('sharp');

const generateFileName = require('../utils/createImageFileName');
const generateImagePath = require('./generateImagePath');

/**
 * Resize + optimize images.
 *
 * @param {Array} images An array of images paths.
 * @param {Number} quality Optional number value of quality of the image e.g. 90.
 * @param {String} destinationFolder destination image folder
 * @param {Array} sizes all converted sizes
 */
module.exports = async (images, quality, destinationFolder, sizes) => {
	return await Promise.all(
		images.map(async item => {
			let img = await Promise.all(
				sizes.map(async width => {
					let w = parseInt(width);
					let fileName = generateFileName(item.filename, item.mimetype, width);
					let dest = generateImagePath(destinationFolder, fileName)
					const image = await sharp(item.path).resize(w < 0 ? null : w).toFile(dest)
					return { image, dest, name: fileName };
				})
			)
			return { original: item, variants: img };
		})
	);
};