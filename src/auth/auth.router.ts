import express from 'express';
import passport from 'passport';

import { checkLoggedIn } from '../_middlewares/checkIfLoggedIn';
import { checkIfUserExists, signUpUser } from '../users/users.model';

const authRouter = express.Router();

authRouter.post(
    '/auth/login',
    passport.authenticate('local', {
        session: true,
        failureMessage: false,
    }),
    (_, res) => {
        res.set({ 'Content-Type': 'application/json' });
        res.status(200).json({ success: true });
    }
);

authRouter.post('/auth/signup', async (req, res, next) => {
    if (req.isAuthenticated()) {
        return res
            .status(400)
            .json({ success: false, error: 'Already signed in' });
    }

    const { username, password } = req.body;

    try {
        const exists = await checkIfUserExists(username);

        if (exists) {
            return res
                .status(400)
                .json({ success: false, error: 'User already exists' });
        }

        const user = await signUpUser(username, password);
        return res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});

authRouter.get('/auth/logout', checkLoggedIn, (req, res) => {
    req.session = null;
    res.status(200).json({ success: true });
});

export default authRouter;
