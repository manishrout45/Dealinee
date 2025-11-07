import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  SBU: { type: String },
  CA: { type: String },
  furnishing: {
    type: String,
    enum: ["Furnished", "Semi Furnished", "Unfurnished"],
    required: true
  },
  propertyFor: { type: String, enum: ["Rent", "Buy", "Commercial", "Plot"], required: true },
  type: { type: String, enum: ["Apartment", "Individual House", "Other"], default: "Other" },
  images: [{ type: String }],
}, { timestamps: true });

const Property = mongoose.model("Property", propertySchema);

export default Property;
