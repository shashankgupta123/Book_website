import express from 'express';
import { getLocations, addLocation, deleteLocation} from "../Controllers/location-controller.js"

const router = express.Router();
router.get("/", getLocations);
router.post("/", addLocation);
router.delete("/:id", deleteLocation);
export default router;