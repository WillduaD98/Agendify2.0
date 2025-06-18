import type { Request }  from 'express';
import { GraphQLError } from 'graphql';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    _id: unknown;
    username: string;
}

export const authenticateToken = async ({ req }: { req: Request}) => {
    const authHeader = req.headers.authorization || '';
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('No authorization header found or it does not start with Bearer');
        return { user: null}
    }
    const token =  authHeader.split(' ')[1];
    const secretKeyt = process.env.JWT_SECRET_KEY || '';

    if (!secretKeyt) {
        throw new GraphQLError('JWT_SECRET_KEY is not defined', {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR',
            },
        });
    }
    try {
        const decoded = jwt.verify(token, secretKeyt) as JwtPayload;
        return { user: { _id: decoded._id, username: decoded.username } };
    } catch (error) {
        throw new GraphQLError('Invalid token', {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        });
    }
};

export const signToken = (username: string, _id: unknown) => {
    const payload = {username, _id};
    const secretKey = process.env.JWT_SECRET_KEY || '';

    return jwt.sign(payload, secretKey, {expiresIn: '1h'});
};

export class AuthenticationError extends GraphQLError {
    constructor(message: string) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: AuthenticationError})
    }
}