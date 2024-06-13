const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require("path");                // path is gev upload file path.name ex. .img .pdf .zip .mp3

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')        // img add file name
    },
    filename: function(req, file, cb) {
        const uniquename = uuidv4();
        cb(null, uniquename+path.extname(file.originalname));
    }
})   

const upload = multer({ storage: storage });

module.exports = upload;