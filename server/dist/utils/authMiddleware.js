import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
        req.user = decoded;
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
