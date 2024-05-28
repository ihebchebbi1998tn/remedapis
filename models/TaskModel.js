import mongoose from "mongoose";
const taskSchema = mongoose.Schema({
  coach: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  contacts: {
    type: String,
    required: true,
  },
  typeSport: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
});
const TaskModel = mongoose.model("TaskModel", taskSchema);
export default TaskModel;
