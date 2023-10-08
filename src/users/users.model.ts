import crypto from 'node:crypto';
import users from './users.schema';

const checkIfUserExists = async (username: string) => {
    const user = await users.findOne({ username });

    if (!user) {
        return false;
    }

    return true;
};

const authenticateUserLocal = async (username: string, password: string) => {
    const user = await users.findOne({ username });

    if (!user) {
        return null;
    }

    const hash = crypto
        .pbkdf2Sync(password, user.salt, 1000, 64, `sha512`)
        .toString(`hex`);

    if (hash !== user.hash) {
        return null;
    }

    return {
        id: user._id,
    };
};

const signUpUser = async (username: string, password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');

    const user = await users.create({ username, hash, salt });

    return { id: user.id, username: user.username };
};

const getUsers = async () => {
    return await users.find({}, { __v: 0 });
};

export { checkIfUserExists, authenticateUserLocal, signUpUser, getUsers };
