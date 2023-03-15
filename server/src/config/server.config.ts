const server = {
	port: process.env.PORT ?? 8080,
};

const jwt = {
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
};

export const serverConfig = {
	server,
	jwt,
};
