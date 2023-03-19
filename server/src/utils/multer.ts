import multer from 'multer';
import path from 'node:path';
import { v4 } from 'uuid';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public');
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${v4()}-${file.originalname}`.trim());
	},
});

export const upload = multer({
	storage: storage,
	limits: {
		fileSize: 12_000_000, // 12MB in bytes
	},
	fileFilter: function (req, file, cb) {
		let ext = path.extname(file.originalname).toLowerCase();

		if (
			ext !== '.png' &&
			ext !== '.jpg' &&
			ext !== '.gif' &&
			ext !== '.mp3' &&
			ext !== '.mp4' &&
			ext !== '.jpeg'
		) {
			return cb(new Error('Invalid format'));
		}
		cb(null, true);
	},
}).array('files', 8);
