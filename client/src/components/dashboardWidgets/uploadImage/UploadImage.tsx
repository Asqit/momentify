import { ChangeEvent, useState } from 'react';
import { Button } from '~/components/common/button/Button';

export interface File {
	url: string;
	name: string;
}

export function UploadImage() {
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	const [filePreviews, setFilePreviews] = useState<string[]>();

	const selectImages = (e: ChangeEvent<HTMLInputElement>) => {
		const images: string[] = [];
		const files = e.target.files;

		if (files) {
			const FILES_LENGTH = files.length;

			for (let i = 0; i < FILES_LENGTH; i++) {
				images.push(URL.createObjectURL(files[i]));
			}
		}

		setSelectedFiles(files);
		setFilePreviews(images);
	};

	return (
		<div>
			<input type="file" multiple accept="image/*" onChange={selectImages} />
			{filePreviews ? (
				<div>
					{filePreviews.map((preview) => (
						<img key={filePreviews.indexOf(preview)} src={preview} />
					))}
				</div>
			) : null}
			<Button disabled={!selectImages}>upload</Button>
		</div>
	);
}
