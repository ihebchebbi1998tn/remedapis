import CoachModel from "../models/CoachModel.js";

// Create a new coach
export const createCoach = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    const coach = await CoachModel.findOne({ email: email });
    if (coach) {
      return res.status(401).json("email already exists");
    }
    const newCoach = new CoachModel({
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    const savedCoach = await newCoach.save();
    res.status(200).send({ savedCoach });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// Get all coaches
export const getAllCoaches = async (req, res) => {
  try {
    const coaches = await CoachModel.find();
    res.status(200).send({ coaches });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
