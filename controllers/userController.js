import { User } from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying transporter: ', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, country, password } = req.body;

    if (!firstName || !lastName || !username || !email || !country || !password) {
      return res.status(400).send({ message: 'Please fill all fields.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      FirstName: firstName,
      LastName: lastName,
      Username: username,
      Email: email,
      Country: country,
      Password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).send({ message: 'User created successfully', user: savedUser });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id_utilisateur } = req.params;

    if (!id_utilisateur) {
      return res.status(400).send({ message: 'Missing parameters.' });
    }

    const deletedUser = await User.findByIdAndDelete(id_utilisateur);
    if (deletedUser) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'Invalid username or password' });
    }

    const user = await User.findOne({ Username: username });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Incorrect password' });
    }

    const userData = {
      id: user._id,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Username: user.Username,
      Email: user.Email,
      Country: user.Country,
      role: user.role,
      created_at: user.created_at,
    };

    res.status(200).send({ user: userData });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const sendBug = async (req, res) => {
  try {
    const { firstName, lastName, id, subject, message: messageContent } = req.body;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'erzerino2@gmail.com',
      subject: `Message from ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { width: 80%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .footer { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 0 0 10px 10px; font-size: 0.9em; }
                .message-section { margin-bottom: 20px; }
                .message-section p { margin: 5px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Bug report in the app</h1>
                </div>
                <div class="content">
                    <div class="message-section">
                        <p><strong>Name:</strong> ${firstName} ${lastName} (${id})</p>
                        <p><strong>Message:</strong><br>${messageContent.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>Best regards,<br>REMED APP Team</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Bug report sent successfully' });
  } catch (e) {
    console.error('Error sending email: ', e);
    res.status(500).send({ error: e.message });
  }
};

export const sendEmail = async (req, res) => {
  try {
    const { firstName, lastName, id, subject, message: messageContent } = req.body;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'erzerino2@gmail.com',
      subject: `[REMED-APP] : Message from ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { width: 80%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .footer { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 0 0 10px 10px; font-size: 0.9em; }
                .message-section { margin-bottom: 20px; }
                .message-section p { margin: 5px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Message from REMED APP</h1>
                </div>
                <div class="content">
                    <div class="message-section">
                        <p><strong>Name:</strong> ${firstName} ${lastName} (${id})</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong><br>${messageContent.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>Best regards,<br>REMED APP Team</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (e) {
    console.error('Error sending email: ', e);
    res.status(500).send({ error: e.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, firstName, lastName, username, email, country, password } = req.body;

    if (!id) {
      return res.status(400).send({ message: 'Invalid input: id parameter is required.' });
    }

    const updateFields = {};
    if (firstName) updateFields.FirstName = firstName;
    if (lastName) updateFields.LastName = lastName;
    if (username) updateFields.Username = username;
    if (email) updateFields.Email = email;
    if (country) updateFields.Country = country;
    if (password) updateFields.Password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });
    if (updatedUser) {
      res.status(200).send({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate({ Email: email }, { Password: hashedPassword }, { new: true });

    if (updatedUser) {
      res.status(200).send({ message: 'Password updated successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
