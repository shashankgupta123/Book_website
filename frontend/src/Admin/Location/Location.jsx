import { useEffect, useState } from "react";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const res = await fetch("http://localhost:5000/api/locations");
    const data = await res.json();
    setLocations(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLocation = { name, lat: parseFloat(lat), lng: parseFloat(lng) };

    const response = await fetch("http://localhost:5000/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLocation),
    });

    if (response.ok) {
      alert("Location added successfully!");
      fetchLocations();
      setName("");
      setLat("");
      setLng("");
    } else {
      alert("Error adding location.");
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:5000/api/locations/${id}`, { method: "DELETE" });
    if (response.ok) {
      fetchLocations();
    } else {
      alert("Error deleting location.");
    }
  };

  return (
    <div>
      <h2>Add Location</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" step="any" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} required />
        <input type="number" step="any" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} required />
        <button type="submit">Add Location</button>
      </form>

      <h2>Existing Locations</h2>
      <ul>
        {locations.map((loc) => (
          <li key={loc._id}>
            {loc.name} - {loc.lat}, {loc.lng}
            <button onClick={() => handleDelete(loc._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Location;