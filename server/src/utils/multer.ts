import multer from 'multer'

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public')
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	},
})

export const upload = multer({
	storage: storage,
	limits: {
		fileSize: 8388608, // 8MB in bytes
	},
}).single('file')
