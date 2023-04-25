import multer from 'multer';
import path from 'node:path';
import { v4 } from 'uuid';
import { HttpException } from './HttpException';

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
		const exts = ['.png', '.jpg', '.gif', '.mp3', '.mp4', '.jpeg'];

		if (!exts.includes(ext)) {
			return cb(new HttpException(415, 'Invalid file-format'));
		}
		cb(null, true);
	},
});

export const uploadPostBody = upload.array('files', 8);
