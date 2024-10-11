import { Router } from 'express';
import { getTopCustomer, getSalesPerCity, getStockReport, getUserRequestsPerHour, getAverageSalesPerMonthPerCategoryAndCity } from '../controllers/reportController';

const router = Router();

router.get('/top-customer', getTopCustomer);
router.get('/sales-per-city', getSalesPerCity);
router.get('/stock-report', getStockReport);
router.get('/user-requests-per-hour', getUserRequestsPerHour);
router.get('/average-sales-per-month-category-city', getAverageSalesPerMonthPerCategoryAndCity);

export default router;
