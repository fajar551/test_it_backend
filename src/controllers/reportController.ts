import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool';

const createTables = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS customers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            initial_stock INT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES customers(id),
            product_id INT REFERENCES products(id),
            quantity INT NOT NULL,
            discount DECIMAL(5, 2),
            order_date TIMESTAMP NOT NULL
        );
        CREATE TABLE IF NOT EXISTS returns (
            id SERIAL PRIMARY KEY,
            order_id INT REFERENCES orders(id),
            return_date TIMESTAMP NOT NULL,
            quantity INT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS logs (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMP NOT NULL,
            activity_type VARCHAR(100) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS restocks (
            id SERIAL PRIMARY KEY,
            product_id INT REFERENCES products(id),
            quantity INT NOT NULL,
            restock_date TIMESTAMP NOT NULL
        );
    `;

  try {
    await pool.query(query);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

createTables();

// Customer dengan Pembelian Terbanyak
export const getTopCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(`
            SELECT 
                c.id AS customer_id,
                c.name AS customer_name,
                c.city AS customer_city,
                SUM(o.quantity) AS total_products_bought,
                SUM(o.quantity * p.price * (1 - COALESCE(o.discount, 0) / 100.0)) - 
                    COALESCE(SUM(r.quantity * p.price), 0) AS total_spent
            FROM 
                orders o
            JOIN 
                customers c ON o.customer_id = c.id
            JOIN 
                products p ON o.product_id = p.id
            LEFT JOIN 
                returns r ON o.id = r.order_id
            WHERE 
                o.order_date BETWEEN '2024-01-01' AND '2024-12-31'
            GROUP BY 
                c.id, c.name, c.city
            ORDER BY 
                total_spent DESC
            LIMIT 1;
        `);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Pembelian Produk per Kota
export const getSalesPerCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(`
            SELECT 
                c.city AS customer_city,
                p.category AS product_category,
                SUM(o.quantity) AS total_units_sold,
                SUM(o.quantity * p.price) AS total_sales_value
            FROM 
                orders o
            JOIN 
                customers c ON o.customer_id = c.id
            JOIN 
                products p ON o.product_id = p.id
            GROUP BY 
                c.city, p.category
            ORDER BY 
                c.city, p.category;
        `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Laporan Stok
export const getStockReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(`
            SELECT 
                p.id AS product_id,
                p.name AS product_name,
                p.category AS product_category,
                p.initial_stock AS starting_stock,
                COALESCE(SUM(rs.quantity), 0) AS total_restock,
                COALESCE(SUM(o.quantity), 0) AS total_sold,
                COALESCE(SUM(r.quantity), 0) AS total_returns,
                (p.initial_stock + COALESCE(SUM(rs.quantity), 0) - COALESCE(SUM(o.quantity), 0) + COALESCE(SUM(r.quantity), 0)) AS final_stock
            FROM 
                products p
            LEFT JOIN 
                restocks rs ON p.id = rs.product_id
            LEFT JOIN 
                orders o ON p.id = o.product_id
            LEFT JOIN 
                returns r ON o.id = r.order_id
            GROUP BY 
                p.id, p.name, p.category, p.initial_stock
            ORDER BY 
                p.category, p.name;
        `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Jumlah Request User per Jam
export const getUserRequestsPerHour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(`
            SELECT 
                EXTRACT(HOUR FROM log.timestamp) AS hour,
                log.activity_type,
                COUNT(log.id) AS total_requests
            FROM 
                logs log
            WHERE 
                log.timestamp >= CURRENT_DATE AND log.timestamp < CURRENT_DATE + INTERVAL '1 day'
            GROUP BY 
                EXTRACT(HOUR FROM log.timestamp), log.activity_type
            ORDER BY 
                hour, log.activity_type;
        `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Jumlah Rata-Rata Produk yang Terjual per Bulan
export const getAverageSalesPerMonthPerCategoryAndCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(`
            SELECT 
                TO_CHAR(o.order_date, 'YYYY-MM') AS month,
                p.category AS product_category,
                c.city AS customer_city,
                SUM(o.quantity * (1 - COALESCE(o.discount, 0) / 100.0)) - 
                    COALESCE(SUM(r.quantity), 0) AS net_quantity_sold,
                AVG(SUM(o.quantity * (1 - COALESCE(o.discount, 0) / 100.0)) - 
                    COALESCE(SUM(r.quantity), 0)) OVER (PARTITION BY p.category, c.city, TO_CHAR(o.order_date, 'YYYY-MM')) AS average_quantity_per_month
            FROM 
                orders o
            JOIN 
                products p ON o.product_id = p.id
            JOIN 
                customers c ON o.customer_id = c.id
            LEFT JOIN 
                returns r ON o.id = r.order_id AND r.return_date >= o.order_date
            GROUP BY 
                TO_CHAR(o.order_date, 'YYYY-MM'), p.category, c.city
            ORDER BY 
                TO_CHAR(o.order_date, 'YYYY-MM'), p.category, c.city;
        `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};


