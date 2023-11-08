const fs = require("fs");

//TODO - write promise

module.exports = (link) => {
    if (link) {
        if (fs.existsSync(link)) {
            fs.unlink(link, err => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
}