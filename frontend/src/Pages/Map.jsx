import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/Map.css";

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

  useEffect(() => {
    axios.get("http://localhost:5000/api/books")
      .then((response) => {
        console.log("Books API Response:", response.data);
        const booksData = response.data.map(book => ({
          ...book,
          locations: book.locations?.filter(loc => 
            loc.latitude !== undefined && loc.longitude !== undefined
          ) || []
        }));
        console.log("Processed Books Data:", booksData);
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

  return (
    <div className="map-wrapper">
      <h2>Current Zoom Level: {zoomLevel}</h2>
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

        {books.flatMap((book) =>
          book.locations.map((loc) => (
            <Marker key={`${book._id}-${loc._id}`} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <b>{book.title}</b> <br />
                Quantity: {loc.quantity} <br />
                Location: {loc.placeName}
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default MergedMap;
