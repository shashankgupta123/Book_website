import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  });

const Location = mongoose.model("Location", LocationSchema);

export default Location;
