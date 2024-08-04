import express from 'express';
import { 
  createReport, 
  getAllReports, 
  getAllReportsLazy, 
  getMyReports, 
  markCollected, 
  updateReport 
} from '../controllers/reportController.js';

const router = express.Router();

// POST /reports/create - Create a new report
router.post('/create', createReport);

// GET /reports/all - Get all reports
router.get('/all', getAllReports);

// GET /reports/all-lazy - Get all reports with pagination
router.get('/all-lazy', getAllReportsLazy);

// GET /reports/user - Get reports by user
router.get('/user', getMyReports);

// PUT /reports/mark-collected - Mark report as collected
router.put('/mark-collected', markCollected);

// PUT /reports/update - Update report by ID
router.put('/update', updateReport);

export default router;
