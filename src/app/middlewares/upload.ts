import multer from "multer";

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter(req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
        }
        cb(null, true);
    }
});

export { upload };