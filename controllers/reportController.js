import { Report } from '../models/ReportModel.js';
import multer from 'multer';
import path from 'path';
// import axios from 'axios'; // Commenting this out as we won't use it for now

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDirectory = 'uploads/';
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image_' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

// Create a new report
export const createReport = async (req, res) => {
  try {
    upload.single('picture')(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ error: err.message });
      }

      const { reported_by_id, reported_by, title, description, location, altitude, longitude, state, pickedup_by } = req.body;

      if (!req.file) {
        return res.status(400).json({ status: false, message: 'Image file is required.' });
      }

      const imagePath = req.file.path;

      // Commenting out the image verification for testing
      /*
      const imageCheck = await checkImageWithImagga(imagePath);
      if (imageCheck.status !== true) {
        return res.status(400).json(imageCheck);
      }
      */

      const newReport = new Report({
        reported_by_id,
        reported_by,
        title,
        description,
        location,
        altitude,
        longitude,
        picture: imagePath,
        state,
        pickedup_by,
      });

      const savedReport = await newReport.save();
      res.status(200).send({ savedReport });
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// Commenting out the function as it's not used now
/*
async function checkImageWithImagga(imagePath) {
  const api_credentials = {
    key: 'acc_e341052809d97ef',
    secret: '59459e15a86bfdeb507206510abb4917'
  };
  const top_tags = ['construction', 'building', 'brick', 'rubbish', 'wall', 'stone', 'history', 'wreck', 'old', 'architecture', 'structure', 'metal'];
  const image_url = 'https://talelgym.tn/remed/api/reports/' + imagePath;

  try {
    const response = await axios.get('https://api.imagga.com/v2/tags', {
      params: { image_url },
      auth: {
        username: api_credentials.key,
        password: api_credentials.secret
      }
    });

    const tags = response.data.result.tags.slice(0, 5).map(tag => tag.tag.en);
    const top_tags_count = tags.filter(tag => top_tags.includes(tag)).length;

    if (top_tags_count >= 2) {
      return { status: true, tags };
    } else {
      return { status: false, tags, image_url };
    }
  } catch (error) {
    return { status: false, message: 'Error checking image', error: error.message });
  }
}
*/

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).send(reports);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// Get all reports with pagination
export const getAllReportsLazy = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const reports = await Report.find().skip((page - 1) * limit).limit(limit);
    res.status(200).send(reports);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// Get reports by user
export const getMyReports = async (req, res) => {
  const { current_user_id } = req.query;

  if (!current_user_id) {
    return res.status(400).json({ status: false, message: 'Missing current_user_id parameter' });
  }

  try {
    const reports = await Report.find({ reported_by_id: current_user_id });
    res.status(200).send(reports);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// Mark report as collected
export const markCollected = async (req, res) => {
  const { report_id, pickedup_by } = req.query;

  if (!report_id || !pickedup_by) {
    return res.status(400).json({ status: false, message: 'Missing parameters.' });
  }

  try {
    const report = await Report.findByIdAndUpdate(
      report_id,
      { pickedup_by, state: 'Collected', updated_at: new Date() },
      { new: true }
    );

    if (report) {
      res.status(200).send({ message: 'Record updated successfully', report });
    } else {
      res.status(404).json({ status: false, message: 'Report not found' });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// Update report
export const updateReport = async (req, res) => {
  const { id } = req.query;
  const { title, description, state, pickedup_by } = req.body;

  if (!id || !title || !description || !state || !pickedup_by) {
    return res.status(400).json({ status: false, message: 'Missing parameters.' });
  }

  try {
    const report = await Report.findByIdAndUpdate(
      id,
      { title, description, state, pickedup_by, updated_at: new Date() },
      { new: true }
    );

    if (report) {
      res.status(200).send({ message: 'Report updated successfully', report });
    } else {
      res.status(404).json({ status: false, message: 'Report not found' });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
