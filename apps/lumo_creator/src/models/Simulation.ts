// models/Simulation.ts
import mongoose, { Document, Model, Types } from 'mongoose';

export interface ISimulation extends Document {
  _id: string;
  createBy: Types.ObjectId;
  provider: string;
  name: string;
  url: string;
  createdAt: Date;
}

const SimulationSchema = new mongoose.Schema<ISimulation>({
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Adjust reference if your user model is named differently
  },
  provider: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Simulation: Model<ISimulation> =
  mongoose.models.Media || mongoose.model<ISimulation>('Simulation', SimulationSchema);

export default Simulation;
