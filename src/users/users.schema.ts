import mongoose from 'mongoose';

interface IUser {
    username: string;
    hash: string;
    salt: string;
}

const usersSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IUser>('User', usersSchema);
