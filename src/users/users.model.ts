import crypto from 'node:crypto';
import users from './users.schema';

const checkIfUserExists = async (username: string) => {
    return await users.findOne({ username });
};

const authenticateUserLocal = async (username: string, password: string) => {
    const user = await users.findOne({ username });

    if (!user) {
        return null;
    }

    // TODO - use bcrypt
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
    // TODO - use bcrypt
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

const deleteUser = async (username: string) => {
    await users.deleteOne({ username });
};

export {
    checkIfUserExists,
    authenticateUserLocal,
    signUpUser,
    getUsers,
    deleteUser,
};
