import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import logger from '../_services/logger';

// Resources
// - https://dev.to/qbentil/how-to-write-custom-error-handler-middleware-in-expressjs-using-javascript-29j1
// - https://reflectoring.io/express-error-handling/

interface ErrorResponse extends ApiResponse {
    status: number;
    message: string;
    stack?: string;
}

class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = Error.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

const errorHandler = (
    err: CustomError,
    _: Request,
    res: Response,
    next: NextFunction /* eslint-disable-line @typescript-eslint/no-unused-vars */
) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';

    const error = {
        success: false,
        status: errStatus,
        message: errMsg,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    } as ErrorResponse;

    logger.error(err.stack);
    return res.status(errStatus).json(error);
};

export { CustomError, errorHandler };
