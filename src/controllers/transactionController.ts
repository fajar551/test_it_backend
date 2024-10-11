import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool';

export const executeTransaction = async (req: Request, res: Response, next: NextFunction) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { userId, productId, quantity } = req.body;

    // Update stock
    await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [quantity, productId]);

    // Insert order
    await client.query(`INSERT INTO orders (customer_id, product_id, quantity, order_date) VALUES ($1, $2, $3, NOW())`, [userId, productId, quantity]);

    // Log activity
    await client.query(`INSERT INTO logs (timestamp, activity_type) VALUES (NOW(), $1)`, ['Order Placed']);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Transaction completed' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
