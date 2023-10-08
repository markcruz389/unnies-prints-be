import { getUsers } from './users.model';

const usersResolvers = {
    Query: {
        users: async () => {
            console.log(await getUsers());
            return await getUsers();
        },
    },
};

export default usersResolvers;
