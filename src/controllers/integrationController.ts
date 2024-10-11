import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const fetchExternalData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mengganti URL dengan API eksternal yang valid dan aktif
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    res.json({ data: response.data });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Axios error:', err.response?.status, err.message);
      res.status(err.response?.status || 500).json({ message: err.message });
    } else {
      console.error('Unexpected error:', err);
      next(err);
    }
  }
};
