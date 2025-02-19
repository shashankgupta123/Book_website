import Location from '../Models/Location.js'

export const getLocations = async (req, res) => {
    try {
      const locations = await Location.find();
      res.json(locations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Add a new location
export const addLocation = async (req, res) => {
    const { name, lat, lng } = req.body;
    try {
      const newLocation = new Location({ name, lat, lng });
      await newLocation.save();
      res.status(201).json(newLocation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Delete a location
export const deleteLocation = async (req, res) => {
    try {
      await Location.findByIdAndDelete(req.params.id);
      res.json({ message: "Location deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  