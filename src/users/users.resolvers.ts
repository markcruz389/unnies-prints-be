import { getUsers } from './users.model';
const usersResolvers = {
    Query: {
        users: async () => {
            return await getUsers();
        },
    },
};

export default usersResolvers;
