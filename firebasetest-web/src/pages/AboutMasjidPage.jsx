import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    IoLocationSharp,
    IoNavigate,
    IoArrowBack,
    IoCreateOutline,
    IoTimeOutline,
    IoPeopleOutline,
    IoMoonOutline,
    IoMapOutline
} from "react-icons/io5";
import HeartButton from "../components/HeartButton";

function toPascalCase(str) {
    if (!str) return "";
    return str
        .split(/([ -])/g)
        .map((word) =>
            word.match(/[a-zA-Z]/)
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word
        )
        .join("");
}

export default function AboutMasjidPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const masjid = state?.masjid;

    const [displayAddress, setDisplayAddress] = useState("");
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    useEffect(() => {
        if (!masjid) return;

        const getAddress = async () => {
            const existingAddress = masjid.details?.addressLine1 || masjid.details?.address || masjid.address;

            // Only use reverse geocoding if address is missing or is raw coordinates
            if (existingAddress &&
                existingAddress !== "Custom Location" &&
                existingAddress !== "Address not available" &&
                !existingAddress.startsWith("Lat:")) {
                setDisplayAddress(existingAddress);
                return;
            }

            const loc = masjid.location;
            if (loc && loc.latitude && loc.longitude) {
                setIsLoadingAddress(true);
                try {
                    const res = await fetch(`/osm/reverse?format=json&lat=${loc.latitude}&lon=${loc.longitude}`);
                    const data = await res.json();
                    if (data && data.display_name) {
                        // Nominatim display_name is usually long, so we take the first few parts if needed
                        setDisplayAddress(data.display_name);
                    } else {
                        setDisplayAddress("Address not available");
                    }
                } catch (error) {
                    console.error("Reverse geocode failed:", error);
                    setDisplayAddress("Address not available");
                } finally {
                    setIsLoadingAddress(false);
                }
            } else {
                setDisplayAddress("Address not available");
            }
        };

        getAddress();
    }, [masjid]);

    if (!masjid) {
        return (
            <div className="empty-state">
                <p>No masjid data available.</p>
                <button className="btn-primary" onClick={() => navigate("/")}>Go Home</button>
            </div>
        );
    }

    const details = masjid.details || {};
    const timings = details.timings || {};
    const name = details.name || masjid.mosqueName || "Unknown Masjid";

    const safeTime = (t) => {
        if (!t || t === "NaN" || t === "undefined") return "---";

        try {
            // Convert "13:30" to "1:30 PM" if possible
            const tStr = typeof t === 'string' ? t.trim() : Object.values(t).join(""); // fallback if t is weirdly an object
            if (!tStr) return "---";

            const parts = tStr.split(":");
            if (parts.length >= 2) {
                let hours = parseInt(parts[0], 10);
                const minutes = parts[1].replace(/[^0-9]/g, ''); // strip out existing AM/PM if any just in case
                if (!isNaN(hours)) {
                    if (tStr.toLowerCase().includes('am') || tStr.toLowerCase().includes('pm')) {
                        return tStr; // already formatted
                    }
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    return `${hours}:${minutes.padStart(2, '0')} ${ampm}`;
                }
            }
            return tStr;
        } catch (error) {
            console.error("safeTime parsing error for:", t, error);
            return "---";
        }
    };

    const prayerList = [
        { name: "Fajr", time: timings.fajr },
        { name: "Dhuhr", time: timings.dhuhr },
        { name: "Asr", time: timings.asar || timings.asr },
        { name: "Maghrib", time: timings.maghrib },
        { name: "Isha", time: timings.isha },
    ];

    // Get Jumma timings (can be string or array)
    const getJummaTimings = () => {
        if (!timings?.jummatiming) return null;
        if (Array.isArray(timings.jummatiming)) {
            return timings.jummatiming.filter(t => t && t.trim());
        }
        return [timings.jummatiming];
    };

    // Get Taraweeh entries
    const getTaraweehEntries = () => {
        const taravi = timings?.taravi || timings?.taraweeh;
        if (!taravi) return null;
        if (Array.isArray(taravi)) return taravi;
        return [taravi]; // in case it was accidentally saved as a single object
    };

    const jummaTimings = getJummaTimings();
    const taraweehEntries = getTaraweehEntries();

    const openGoogleMaps = () => {
        if (masjid.location?.latitude && masjid.location?.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${masjid.location.latitude},${masjid.location.longitude}`,
                "_blank"
            );
        } else {
            alert("Location not available");
        }
    };

    return (
        <div className="about-page-content page-padding" style={{ paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <button className="btn-back" onClick={() => navigate(-1)} style={{ marginRight: 15, marginBottom: 0 }}>
                    <IoArrowBack />
                </button>
                <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#111827", margin: 0, flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                    {toPascalCase(name)}
                    <HeartButton masjidid={masjid.id || masjid.mosqueId} />
                </h2>
            </div>

            {/* Address & Distance Card */}
            <div className="card" style={{ marginBottom: 15 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                    <IoLocationSharp size={20} color="#10B981" />
                    <span style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#111827" }}>Address</span>
                </div>
                {isLoadingAddress ? (
                    <div className="spinner" style={{ width: 20, height: 20, margin: "10px 0" }} />
                ) : (
                    <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.5, marginBottom: 15 }}>
                        {displayAddress}
                    </p>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                    {masjid.distanceText && masjid.distanceText !== "N/A" && (
                        <div style={{ display: "flex", alignItems: "center", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "6px 12px", borderRadius: 20, fontSize: 13, color: "#065F46", fontWeight: "600" }}>
                            <IoNavigate size={16} color="#10B981" style={{ marginRight: 6 }} />
                            {masjid.distanceText}
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Timings */}
            <div className="card" style={{ marginBottom: 15 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                    <IoTimeOutline size={20} color="#10B981" />
                    <span style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#111827" }}>Daily Prayer Timings</span>
                </div>
                {Object.keys(timings).length === 0 ? (
                    <p style={{ color: "#6B7280", fontSize: 14, fontStyle: "italic" }}>Timings not available yet.</p>
                ) : (
                    <div>
                        {prayerList.map((p, index) => (
                            <div key={p.name} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px 0",
                                borderBottom: index !== prayerList.length - 1 ? "1px solid #E5E7EB" : "none"
                            }}>
                                <div style={{ fontSize: 15, color: "#4B5563", fontWeight: "500" }}>{p.name}</div>
                                <div style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}>{safeTime(p.time)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Jumma Timings */}
            {jummaTimings && jummaTimings.length > 0 && (
                <div className="card" style={{ marginBottom: 15 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                        <IoPeopleOutline size={20} color="#059669" />
                        <span style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#059669" }}>Jumma Timings</span>
                    </div>
                    <div>
                        {jummaTimings.map((time, index) => (
                            <div key={index} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px 0",
                                borderBottom: index !== jummaTimings.length - 1 ? "1px solid #E5E7EB" : "none"
                            }}>
                                <div style={{ fontSize: 15, color: "#4B5563", fontWeight: "500" }}>
                                    Jumma {jummaTimings.length > 1 ? index + 1 : ''}
                                </div>
                                <div style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}>{safeTime(time)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Taraweeh Schedule */}
            {taraweehEntries && taraweehEntries.length > 0 && (
                <div className="card" style={{ marginBottom: 15 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                        <IoMoonOutline size={20} color="#6366F1" />
                        <span style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#6366F1" }}>Taraweeh Schedule</span>
                    </div>
                    {taraweehEntries.map((entry, index) => (
                        <div key={index} style={{
                            backgroundColor: "#F9FAFB",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: index !== taraweehEntries.length - 1 ? 10 : 0
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 13, color: "#6B7280" }}>Start Date:</span>
                                <span style={{ fontSize: 14, color: "#111827", fontWeight: "600" }}>{entry.startDate || 'Not set'}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 13, color: "#6B7280" }}>Time:</span>
                                <span style={{ fontSize: 14, color: "#111827", fontWeight: "600" }}>{safeTime(entry.time)}</span>
                            </div>
                            {entry.parah && (
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 13, color: "#6B7280" }}>Parah:</span>
                                    <span style={{ fontSize: 14, color: "#111827", fontWeight: "600" }}>{entry.parah}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 15, marginTop: 25, marginBottom: 20 }}>
                {masjid.location?.latitude && masjid.location?.longitude && (
                    <button
                        onClick={openGoogleMaps}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            borderRadius: 12,
                            padding: "16px",
                            cursor: "pointer",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ backgroundColor: "#E8F0FE", padding: 12, borderRadius: "50%" }}>
                                <IoNavigate size={24} color="#4285F4" />
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <span style={{ display: "block", fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 2 }}>Navigate to Masjid</span>
                                <span style={{ display: "block", fontSize: 13, color: "#6B7280" }}>Open in Google Maps</span>
                            </div>
                        </div>
                        <IoNavigate size={20} color="#9CA3AF" />
                    </button>
                )}

                <button
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        backgroundColor: "#10B981",
                        color: "white",
                        border: "none",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.4)"
                    }}
                    onClick={() => navigate("/update-timings", { state: { masjid } })}
                >
                    <IoCreateOutline size={22} />
                    Update Timings
                </button>
            </div>

        </div>
    );
}
