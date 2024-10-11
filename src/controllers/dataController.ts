import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db/pool';

export const saveData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;
    const uniqueCode = uuidv4();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO data_store (data, unique_code) VALUES ($1, $2) RETURNING *`,
        [data, uniqueCode]
      );
      await client.query('COMMIT');
      res.status(201).json({ message: 'Data saved successfully', data: result.rows[0] });
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
};
