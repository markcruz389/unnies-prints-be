import { Request, Response, NextFunction } from 'express';

function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
    const isLoggedIn = req.isAuthenticated() && req.user; // passport

    if (!isLoggedIn) {
        return res.status(401).json({
            error: 'Not logged in',
        });
    }

    next();
}

export { checkLoggedIn };
