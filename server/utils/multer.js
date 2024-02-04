const multer = require('multer')
function fileUpload(validation,) {
    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (!validation.includes(file.mimetype)) {
            return cb(new Error('please upload your photo'), null)
        }
        cb(null, true)
    }
    const upload = multer({
        dest: "uploads", fileFilter, storage
    })
    return upload

}
module.exports = fileUpload