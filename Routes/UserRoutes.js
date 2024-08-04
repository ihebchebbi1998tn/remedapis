import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  login,
  sendBug,
  sendEmail,
  updateUser,
  updatePassword,
} from '../controllers/userController.js';

const router = express.Router();

// POST /users/create - Create a new user
router.post('/create', createUser);

// DELETE /users/:id_utilisateur - Delete a user
router.delete('/:id_utilisateur', deleteUser);

// GET /users/all - Get all users
router.get('/all', getAllUsers);

// POST /users/login - Login
router.post('/login', login);

// POST /users/send-bug - Send bug report
router.post('/send-bug', sendBug);

// POST /users/send-email - Send email
router.post('/send-email', sendEmail);

// PUT /users/update - Update user
router.put('/update', updateUser);

// PUT /users/update-password - Update password
router.put('/update-password', updatePassword);

export default router;
