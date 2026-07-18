import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: Date;
  status: "Active" | "Inactive";
  role: "Super Admin" | "HR Manager" | "Employee";
  manager?: mongoose.Types.ObjectId;
  profileImage?: string;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    role: {
      type: String,
      enum: ["Super Admin", "HR Manager", "Employee"],
      default: "Employee",
    },

    manager: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;