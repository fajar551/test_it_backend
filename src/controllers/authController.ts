import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool';

// Registrasi user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

// Login dengan password
export const loginPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw { status: 401, message: 'Invalid credentials' };
    }
    const token = jwt.sign({ username }, 'secretKey');
    await pool.query(`UPDATE users SET token = $1 WHERE id = $2`, [token, user.id]);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// Login dengan token
export const loginToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw { status: 401, message: 'Invalid token' };
    }
    const result = await pool.query(`SELECT * FROM users WHERE token = $1`, [token]);
    const user = result.rows[0];
    if (!user) {
      throw { status: 401, message: 'Token not valid' };
    }
    res.json({ message: 'Token login successful' });
  } catch (err) {
    next(err);
  }
};
