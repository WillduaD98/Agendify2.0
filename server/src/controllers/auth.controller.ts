import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';


const SECRET = process.env.JWT_SECRET_KEY || '';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    return res.status(201).json({ message: 'Usuario creado', user });
  } catch (err) {
    return res.status(500).json({ message: 'Error en el registro', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log(`req.body ${req.body}`)
    
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    console.log(`user.pasword from DB: `, user?.password)
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login exitoso', token });
  } catch (err) {
    return res.status(500).json({ message: 'Error en el login', error: err });
  }
};
