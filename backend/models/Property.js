import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  listingType: { type: String, enum: ["rent", "sell"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Property", propertySchema);
