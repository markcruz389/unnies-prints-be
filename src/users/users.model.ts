import users from './users.schema';

const getUsers = async () => {
    return await users.find({}, { __v: 0 });
};

export { getUsers };
