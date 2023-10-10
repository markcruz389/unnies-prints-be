import passport from 'passport';
import { Strategy } from 'passport-local';
import { authenticateUserLocal } from '../users/users.model';

type User = {
    id?: string;
};

const initializePassportStrategy = () => {
    passport.use(
        new Strategy(async function verify(username, password, done) {
            const user = await authenticateUserLocal(username, password);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        })
    );
    passport.serializeUser((user: User, done) => {
        done(null, user);
    });
    passport.deserializeUser((user: User, done) => done(null, user));

    return passport;
};

export default initializePassportStrategy;
