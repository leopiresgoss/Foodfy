const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}=${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const Accepted = ['image/png', 'image/jpg', 'image/jpeg']
    .find(AcceptedFormat => AcceptedFormat == file.mimetype)

    if(!Accepted) cb(null, false)

    return cb(null, true) 
}

module.exports = multer({
    storage,
    fileFilter
})