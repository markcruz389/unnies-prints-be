import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
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

export default mongoose.model('User', usersSchema);
