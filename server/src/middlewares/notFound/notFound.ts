import { Request, Response, NextFunction } from 'express';

function notFound(req: Request, res: Response, next: NextFunction) {
	res.sendStatus(404);
}

export { notFound };
