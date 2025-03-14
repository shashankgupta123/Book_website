import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/Map.css";
import emailjs from "emailjs-com"

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ZoomTracker = ({ setZoomLevel }) => {
  const map = useMap();
  useEffect(() => {
    const handleZoom = () => setZoomLevel(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => map.off("zoomend", handleZoom);
  }, [map, setZoomLevel]);
  return null;
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
};

const MergedMap = () => {
  const [zoomLevel, setZoomLevel] = useState(12);
  const [userLocation, setUserLocation] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/books")
      .then((response) => {
        const booksData = response.data.map(book => ({
          ...book,
          locations: book.locations?.filter(loc => loc.latitude !== undefined && loc.longitude !== undefined) || []
        }));
        setBooks(booksData);
      })
      .catch((err) => setError("Error fetching books: " + err.message));
  }, []);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (err) => setError("Geolocation error: " + err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Group books by location
  const groupedLocations = {};
  books.forEach(book => {
    book.locations.forEach(loc => {
      const key = `${loc.latitude},${loc.longitude}`;
      if (!groupedLocations[key]) {
        groupedLocations[key] = { latitude: loc.latitude, longitude: loc.longitude, placeName: loc.placeName, books: [] };
      }
      groupedLocations[key].books.push({ title: book.title, quantity: loc.quantity });
    });
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (submitCount >= 5) {
      setSubmitError("You have reached the maximum number of submissions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/save-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitCount(submitCount + 1);
        alert("Form submitted successfully!");
        setShowForm(false);
        setSubmitError("");
        console.log("Calling sendEmail...");

        const emailResponse = await sendEmail(formData);
        if (emailResponse) {
          console.log("Email sent successfully");
        } else {
          console.log("Error sending email");
        }
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // Handle Email Sending
  const sendEmail = async (formData) => {
    const emailTemplateParams = {
      to_name: "Admin",
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      store_name: formData.storeName,
    };

    try {
      const result = await emailjs.send(
        "service_i5w8e6j",
        "template_gzgzjrq",
        emailTemplateParams,
        "jbtlMNNQBfxu8oioy"
      );
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      return null;
    }
  };

  return ( 
    <>
    <div className="map-wrapper">
      {/* <h2>Current Zoom Level: {zoomLevel}</h2> */}

      {error && <div className="error-message">{error}</div>}

      <MapContainer center={userLocation || [19.076, 72.8777]} zoom={zoomLevel} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomTracker setZoomLevel={setZoomLevel} />

        {userLocation && (
          <>
            <RecenterMap center={[userLocation.lat, userLocation.lng]} />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          </>
        )}

        {/* Render grouped books at each unique location */}
        {Object.values(groupedLocations).map((group, index) => (
          <Marker key={index} position={[group.latitude, group.longitude]} 
            eventHandlers={{ click: () => setSelectedLocation(group) }}>
            <Popup>
              <b>Books at {group.placeName}</b>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Dynamic Table Displaying Books at Selected Location */}
      {selectedLocation && (
        <div className="table-container" style={{ maxHeight: "500px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}><br></br>
          <h3><i>Books Available at {selectedLocation.placeName}</i></h3>
          <div style={{ maxHeight: "150px", overflowY: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedLocation.books.map((book, idx) => (
                  <tr key={idx}>
                    <td>{book.title}</td>
                    <td>{book.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
     {/* Button to toggle form visibility */}
     {/* <button onClick={() => setShowForm(true)} style={{ marginTop: "10px" }}>
      Contact Us
    </button> */}

    {/* Contact Form */}
    {showForm && (
        <form
          onSubmit={handleFormSubmit}
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            maxWidth: "400px",
          }}
        >
          <h3>Contact Us</h3>
          {submitError && <div style={{ color: "red" }}>{submitError}</div>}

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
          </label>
          <label>
            Store Name:
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
          </label>
          <label>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
          </label>
          <button type="submit" style={{ width: "100%" }}>
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default MergedMap;
