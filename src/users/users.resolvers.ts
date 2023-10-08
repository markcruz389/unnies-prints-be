import { getUsers } from './users.model';

const usersResolvers = {
    Query: {
        users: () => {
            return getUsers;
        },
    },
};

export default usersResolvers;
