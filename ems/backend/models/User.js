const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    position: { type: String, default: "" },
    bio: { type: String, default: "" },
    department: { type: String, default: "" },
    basicSalary: { type: Number, default: 1000 },
    avatarUrl: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

userSchema.methods.initials = function () {
  return this.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

module.exports = mongoose.model("User", userSchema);
