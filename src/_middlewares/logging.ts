import morgan from 'morgan';
import logger from '../_services/logger';
import { Request } from 'express';

// Resource: https://lioncoding.com/logging-in-express-js-using-winston-and-morgan/#configure-morgan

const stream = {
    // Use the http severity
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    write: (message: any) => logger.http(message),
};

const skip = (req: Request) => {
    const env = process.env.NODE_ENV || 'development';
    const isGraphqlEndpoint = req.baseUrl === '/graphql';
    const doSkip =
        env !== 'development' || (env === 'development' && isGraphqlEndpoint);

    return doSkip;
};

const loggingMiddleware = morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    ':remote-addr :method :url :status :res[content-length] - :response-time ms',
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream, skip }
);

export default loggingMiddleware;
