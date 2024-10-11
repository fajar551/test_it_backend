import express from 'express';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';
import reportRoutes from './routes/reportRoutes';
import transactionRoutes from './routes/transactionRoutes';
import integrationRoutes from './routes/integrationRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cron from 'node-cron';
import { pool } from './db/pool';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/data', dataRoutes);
app.use('/reports', reportRoutes);
app.use('/transaction', transactionRoutes);
app.use('/integration', integrationRoutes); 

app.use(errorHandler);

// Penjadwalan task menggunakan cron
cron.schedule('0 0 * * *', async () => {
  console.log('Scheduled task running at 00:00 daily');
  try {
    await pool.query(`UPDATE data_store SET processed = TRUE WHERE processed = FALSE`);
    console.log('Data processing completed successfully');
  } catch (err) {
    console.error('Error processing data:', err);
  }
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
