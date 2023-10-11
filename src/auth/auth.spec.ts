import request from 'supertest';
import dotenv from 'dotenv';

import { mongoConnect, monngoDisconnect } from '../_services/mongo';
import initializeApp from '../_services/app';
import {
    checkIfUserExists,
    signUpUser,
    deleteUser,
} from '../users/users.model';

dotenv.config();

const config = {
    MONGO_URL: process.env.MONGO_URL || '',
    TEST_ACCOUNT_USERNAME: process.env.TEST_ACCOUNT_USERNAME || '',
    TEST_ACCOUNT_PASSWORD: process.env.TEST_ACCOUNT_PASSWORD || '',
};
const app = initializeApp();

// Functions created for github actions workflow
const createTestUser = async (username: string, password: string) => {
    const exists = await checkIfUserExists(username);
    if (!exists) {
        await signUpUser(username, password);
    }
};

describe('Auth APIs', () => {
    beforeAll(async () => {
        await mongoConnect(config.MONGO_URL);
        await createTestUser(
            config.TEST_ACCOUNT_USERNAME,
            config.TEST_ACCOUNT_PASSWORD
        );
    });
    afterAll(async () => {
        await deleteUser(config.TEST_ACCOUNT_USERNAME);
        await monngoDisconnect();
    });

    describe('POST /auth/login', () => {
        // Success cases
        it('Should login with valid credentials', async () => {
            const validCredentials = {
                username: config.TEST_ACCOUNT_USERNAME,
                password: config.TEST_ACCOUNT_PASSWORD,
            };

            const response = await request(app)
                .post('/auth/login')
                .send(validCredentials)
                .expect('Content-Type', /json/)
                .expect('Set-Cookie', /session/)
                .expect('Set-Cookie', /session.sig/)
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        // Failed cases
        it('Should fail with invalid credentials', async () => {
            const invalidCredentials = {
                username: 'notAUser',
                password: 'notAPassword',
            };

            await request(app)
                .post('/auth/login')
                .send(invalidCredentials)
                .expect(401);
        });

        it('Should fail with missing required input', async () => {
            const incompleteInput = {
                username: 'username',
            };

            await request(app)
                .post('/auth/login')
                .send(incompleteInput)
                .expect(400);
        });
    });

    describe('POST / auth/signup', () => {
        // Success cases
        it('Should create user', async () => {
            const validUser = {
                username: 'testUser',
                password: config.TEST_ACCOUNT_PASSWORD,
            };

            const response = await request(app)
                .post('/auth/signup')
                .send(validUser)
                .expect('Content-Type', /json/)
                .expect(201);

            const { success, data } = response.body;

            expect(success).toBe(true);
            expect(data).toHaveProperty('id');
            expect(data).toHaveProperty('username', validUser.username);

            await deleteUser(validUser.username);
        });

        // Failed cases
        it('Should fail if username already exists', async () => {
            const invalidUser = {
                username: config.TEST_ACCOUNT_USERNAME,
                password: config.TEST_ACCOUNT_PASSWORD,
            };

            const response = await request(app)
                .post('/auth/signup')
                .send(invalidUser)
                .expect('Content-Type', /json/)
                .expect(400);

            const { success, error } = response.body;

            expect(success).toBe(false);
            expect(error).toBe('User already exists');
        });
    });
});
