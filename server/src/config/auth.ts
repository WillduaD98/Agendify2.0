// import jwt from 'jsonwebtoken';

// export const generateToken = (username: string): string => {
//   const secret = process.env.JWT_SECRET_KEY;
//   if (!secret) throw new Error('JWT_SECRET_KEY no definida en .env');

//   return jwt.sign({ username }, secret, {
//     expiresIn: '1h',
//   });
// };

const jwt = require('jsonwebtoken');

const generateToken = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET_KEY || '', {
    expiresIn: '1h'
  });
};

module.exports = generateToken;
