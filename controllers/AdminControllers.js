import bcrypt from "bcrypt";
import AdminModel from "../models/AdminModel.js";

// LOGGING IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    if (!admin) {
      return res.status(401).json("Invalid email ");
    }
    const validPass = password === admin.password;
    if (!validPass) {
      return res.status(401).json("Invalid password");
    }
    delete admin.password;
    console.log({ admin });
    res.status(200).send({
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// REGISTERING
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    if (admin) {
      return res.status(401).json("email already exists");
    }
    const newAdmin = new AdminModel({
      firstName,
      lastName,
      email,
      password,
    });
    const savedAdmin = await newAdmin.save();
    delete savedAdmin.password;
    res.status(200).send({ savedAdmin });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    if (!admin) {
      return res.status(401).json("Invalid email ");
    }
    const password = admin.password;
    res.status(200).send({ password });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
