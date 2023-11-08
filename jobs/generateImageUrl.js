module.exports = (item, width) => {
    let name = item.name.split('.')[0];
    let ext = item.name.split('.')[1];
    
    return `${process.env.DOMAIN}/images/public/${item.folder}/${name}_${width}.${ext}`;
}