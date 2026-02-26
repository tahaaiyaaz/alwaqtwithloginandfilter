import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SearchBar from "../components/SearchBar";
import { addMasjid } from "../api/apiaddmasjid";
import { IoArrowForward, IoArrowBack, IoCheckmarkCircleOutline, IoLocate } from "react-icons/io5";

// Haversine formula to compute distance between points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

function ChangeView({ center, zoom }) {
    const map = useMap();
    if (center && center[0] && center[1]) {
        map.flyTo(center, zoom || 15);
    }
    return null;
}

export default function AddMasjid() {
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState("");
    const [masjidName, setMasjidName] = useState("");
    const [location, setLocation] = useState({ lat: "", lng: "" });
    const [locationofmasjid, setLocationofmasjid] = useState({ lat: "", lng: "" });
    const [nearbyMasjids, setNearbyMasjids] = useState([]);
    const [loadingNearby, setLoadingNearby] = useState(false);
    const [timings, setTimings] = useState({
        fajr: "", dhuhr: "", asar: "", isha: "", jummatiming: "", taraweeh: "",
    });

    const mapCenter = [
        locationofmasjid.lat || location.lat || 17.385,
        locationofmasjid.lng || location.lng || 78.4867,
    ];

    const fetchNearbyMasjids = async (lat, lng) => {
        setLoadingNearby(true);
        try {
            const url = new URL(window.location.origin + "/api/getNearestMasjid");
            url.searchParams.append("latitude", lat);
            url.searchParams.append("longitude", lng);
            url.searchParams.append("radiusInKm", 50); // Fetch wide to bypass backend limiters

            const res = await fetch(url.toString(), {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            const masjids = data.masjids || [];

            const fetched = [];
            masjids.forEach((m) => {
                if (m.location?.latitude && m.location?.longitude) {
                    const dist = calculateDistance(
                        parseFloat(lat),
                        parseFloat(lng),
                        parseFloat(m.location.latitude),
                        parseFloat(m.location.longitude)
                    );
                    if (dist <= 5) { // strictly filter to 5km locally
                        fetched.push({ ...m, distance: dist });
                    }
                }
            });
            // Sort closest first
            fetched.sort((a, b) => a.distance - b.distance);
            setNearbyMasjids(fetched);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingNearby(false);
        }
    };

    const handleMapClick = (latlng) => {
        setLocation({ lat: latlng.lat, lng: latlng.lng });
        fetchNearbyMasjids(latlng.lat, latlng.lng);
    };

    const handleStep2MapClick = (latlng) => {
        setLocationofmasjid({ lat: latlng.lat, lng: latlng.lng });
        setAddress(`Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`);
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setLocationofmasjid({ lat, lng });
                setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
            },
            () => alert("Could not get location")
        );
    };

    const getCurrentLocationStep1 = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setLocation({ lat, lng });
                fetchNearbyMasjids(lat, lng);
            },
            () => alert("Could not get location")
        );
    };

    const handleAddMasjid = async () => {
        if (!locationofmasjid.lat || !locationofmasjid.lng) {
            alert("Please select a location on the map or use current location.");
            return;
        }
        if (!masjidName.trim()) {
            alert("Please enter the masjid name.");
            return;
        }
        for (const [prayer, time] of Object.entries(timings)) {
            if (!time.trim()) {
                alert(`Please provide the ${prayer} timing.`);
                return;
            }
        }
        const finalData = {
            latitude: locationofmasjid.lat,
            longitude: locationofmasjid.lng,
            countryName: "India",
            cityName: "City",
            stateName: "State",
            details: {
                addressLine1: address || "Custom Location",
                name: masjidName,
                timings,
            },
        };
        try {
            await addMasjid(finalData);
            alert("Submitted! We will reach out to you soon.");
            setStep(1);
            setMasjidName("");
            setAddress("");
            setLocationofmasjid({ lat: "", lng: "" });
            setTimings({ fajr: "", dhuhr: "", asar: "", isha: "", jummatiming: "", taraweeh: "" });
        } catch {
            alert("Failed to add masjid. Please try again.");
        }
    };

    // STEP 1
    if (step === 1) {
        return (
            <div style={{ padding: 20 }}>
                <h2 className="step-title" style={{ fontSize: 20, marginBottom: 5 }}>Step 1: Check if Masjid Exists</h2>
                <p className="step-subtitle" style={{ fontSize: 14, marginBottom: 15 }}>Search for a location or tap "Use Current Location" to see masjids around you.</p>

                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 15 }}>
                    <div style={{ flex: 1 }}>
                        <SearchBar
                            placeholder="Search by area or city..."
                            setSendCoords={(coords) => {
                                setLocation(coords);
                                fetchNearbyMasjids(coords.lat, coords.lng);
                            }}
                        />
                    </div>
                    <button
                        onClick={getCurrentLocationStep1}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            padding: "10px", backgroundColor: "#E8F0FE", color: "#4285F4",
                            border: "1px solid #4285F4", borderRadius: 8, cursor: "pointer", flexShrink: 0
                        }}>
                        <IoLocate size={20} />
                    </button>
                </div>

                <div className="map-container" style={{ height: 250 }}>
                    <MapContainer center={[location.lat || 17.385, location.lng || 78.4867]} zoom={location.lat ? 15 : 12} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapClickHandler onMapClick={handleMapClick} />
                        {location.lat && location.lng && (
                            <>
                                <ChangeView center={[parseFloat(location.lat), parseFloat(location.lng)]} zoom={15} />
                                <Marker position={[parseFloat(location.lat), parseFloat(location.lng)]} />
                            </>
                        )}
                    </MapContainer>
                    <div className="map-instruction">Tap inside the map to search nearby</div>
                </div>

                {loadingNearby && (
                    <div className="loading-container"><div className="spinner" /></div>
                )}

                {nearbyMasjids.length > 0 && (
                    <div className="card" style={{ marginTop: 10 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Existing Masjids Nearby</h4>
                        {nearbyMasjids.map((m, idx) => (
                            <div key={idx} className="nearby-list-item">
                                <h4>{m.details?.name || m.mosqueName || "Unknown"}</h4>
                                <p>{m.details?.addressLine1 || ""}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: "center", marginTop: 25, padding: "20px", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                    <p style={{ fontSize: 14, color: "#374151", marginBottom: 10, fontWeight: "500" }}>
                        Is the masjid you are looking for not in this list?
                    </p>
                    <button className="btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }} onClick={() => setStep(2)}>
                        Proceed to Add New Masjid <IoArrowForward />
                    </button>
                </div>
            </div>
        );
    }

    // STEP 2
    if (step === 2) {
        return (
            <div style={{ padding: 20 }}>
                <h2 className="step-title">Step 2: Details</h2>

                <div className="card">
                    <label className="form-label">Masjid Name</label>
                    <input
                        className="form-input"
                        placeholder="Enter masjid name"
                        value={masjidName}
                        onChange={(e) => setMasjidName(e.target.value)}
                        style={{ marginBottom: 15 }}
                    />

                    <label className="form-label">Location</label>
                    <div style={{ marginBottom: 15 }}>
                        <SearchBar
                            placeholder="Search area for the pin..."
                            setSendCoords={(coords) => {
                                setLocationofmasjid(coords);
                                setAddress(`Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`);
                            }}
                        />
                    </div>
                    <button className="btn-secondary" onClick={getCurrentLocation} style={{ width: "100%", marginBottom: 15 }}>
                        <IoLocate /> Use Current Location
                    </button>

                    <div className="map-container" style={{ height: 250 }}>
                        <MapContainer
                            center={[locationofmasjid.lat || location.lat || 17.385, locationofmasjid.lng || location.lng || 78.4867]}
                            zoom={15}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapClickHandler onMapClick={handleStep2MapClick} />
                            {locationofmasjid.lat && locationofmasjid.lng && (
                                <>
                                    <ChangeView center={[parseFloat(locationofmasjid.lat), parseFloat(locationofmasjid.lng)]} zoom={16} />
                                    <Marker position={[parseFloat(locationofmasjid.lat), parseFloat(locationofmasjid.lng)]} />
                                </>
                            )}
                        </MapContainer>
                        <div className="map-instruction">Tap map to adjust location</div>
                    </div>

                    {locationofmasjid.lat && (
                        <div className="info-box">
                            <strong>✅ Coordinates Captured:</strong>
                            <p>{parseFloat(locationofmasjid.lat).toFixed(6)}, {parseFloat(locationofmasjid.lng).toFixed(6)}</p>
                        </div>
                    )}
                    {address && (
                        <div className="info-box">
                            <strong>📍 Address:</strong>
                            <p>{address}</p>
                        </div>
                    )}
                </div>

                <div className="btn-row">
                    <button className="btn-back" onClick={() => setStep(1)}>
                        <IoArrowBack /> Back
                    </button>
                    <button className="btn-primary" onClick={() => {
                        if (!locationofmasjid.lat || !locationofmasjid.lng) {
                            alert("Please select a location on the map or use current location.");
                            return;
                        }
                        setStep(3);
                    }}>
                        Next: Timings <IoArrowForward />
                    </button>
                </div>
            </div>
        );
    }

    // STEP 3
    return (
        <div style={{ padding: 20 }}>
            <h2 className="step-title">Step 3: Prayer Timings</h2>

            <div className="card">
                {["fajr", "dhuhr", "asar", "isha", "jummatiming", "taraweeh"].map((prayer) => (
                    <div key={prayer} className="time-row">
                        <label>{prayer.charAt(0).toUpperCase() + prayer.slice(1)}</label>
                        <input
                            type="time"
                            className="time-input"
                            value={timings[prayer]}
                            onChange={(e) => setTimings((prev) => ({ ...prev, [prayer]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>

            <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(2)}>
                    <IoArrowBack /> Back
                </button>
                <button className="btn-primary" style={{ background: "#10B981" }} onClick={handleAddMasjid}>
                    Add Masjid <IoCheckmarkCircleOutline />
                </button>
            </div>
        </div>
    );
}
