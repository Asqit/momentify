async function processFiles(files: FileList) {
	for (const file of files) {
		const URL = await processFile(file);
	}
}

async function processFile(file: File) {
	new Promise((resolve, reject) => {
		const rawImage = new Image();

		rawImage.addEventListener('load', () => {
			resolve(rawImage);
		});

		rawImage.src = URL.createObjectURL(file);
	})
		.then((rawImage) => {
			const copy = rawImage as HTMLImageElement;

			return new Promise((resolve, reject) => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				canvas.width = copy.width;
				canvas.height = copy.height;

				ctx?.drawImage(copy, 0, 0);

				canvas.toBlob((blob) => {
					resolve(URL.createObjectURL(blob!));
				}, 'image/webp');
			});
		})
		.then((imageUrl) => {
			return new Promise((resolve, reject) => {
				const scaledImage = new Image();

				scaledImage.addEventListener('load', () => {
					resolve({ imageUrl, scaledImage });

					scaledImage.setAttribute('src', String(imageUrl));
				});
			});
		});
}
