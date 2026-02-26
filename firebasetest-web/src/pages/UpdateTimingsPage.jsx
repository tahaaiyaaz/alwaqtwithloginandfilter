import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack, IoCheckmarkCircleOutline, IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { updateMasjidDetails } from "../api/apiupdatemasjiddetails";

export default function UpdateTimingsPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const masjid = state?.masjid;

    if (!masjid) {
        return (
            <div className="empty-state">
                <p>No masjid data available.</p>
                <button className="btn-primary" onClick={() => navigate("/")}>Go Home</button>
            </div>
        );
    }

    const currentTimings = masjid.details?.timings || {};

    // Helper: Convert "1:30 PM" to "13:30" (for <input type="time">)
    const parseTo24Hour = (timeStr) => {
        if (!timeStr) return "";
        timeStr = timeStr.trim();

        // Handle AM/PM format
        if (timeStr.toUpperCase().includes("AM") || timeStr.toUpperCase().includes("PM")) {
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
            if (match) {
                let hours = parseInt(match[1], 10);
                const minutes = match[2];
                const period = match[3].toUpperCase();

                if (period === "PM" && hours !== 12) hours += 12;
                if (period === "AM" && hours === 12) hours = 0;

                return `${hours.toString().padStart(2, '0')}:${minutes}`;
            }
        }

        // Check if already HH:mm
        const parts = timeStr.split(":");
        if (parts.length >= 2) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            if (!isNaN(hours) && !isNaN(minutes)) {
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
        }
        return "";
    };

    // Helper: Convert "13:30" to "1:30 PM" (for database)
    const formatAMPM = (timeStr24) => {
        if (!timeStr24) return "";
        const [hours24, minutes] = timeStr24.split(":");
        let hours = parseInt(hours24, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    // Helper: Format Dates safely
    const parseDateToYYYYMMDD = (dateStr) => {
        if (!dateStr) return "";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "";
            return d.toISOString().split("T")[0];
        } catch {
            return "";
        }
    };
    const formatYYYYMMDDToDateString = (isoStr) => {
        if (!isoStr) return "";
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return "";
            return d.toDateString(); // "Wed Mar 12 2026"
        } catch {
            return "";
        }
    };

    // Initialize Jumma arrays
    const initJumma = () => {
        const existing = currentTimings.jummatiming;
        if (Array.isArray(existing)) {
            return existing.map(t => parseTo24Hour(t));
        } else if (typeof existing === 'string' && existing) {
            return [parseTo24Hour(existing)];
        }
        return [""]; // at least one input block
    };

    // Initialize Taraweeh arrays
    const initTaraweeh = () => {
        const existing = currentTimings.taravi || currentTimings.taraweeh;
        if (Array.isArray(existing)) {
            return existing.map(entry => ({
                time: parseTo24Hour(entry.time),
                parah: entry.parah || "",
                startDate: parseDateToYYYYMMDD(entry.startDate)
            }));
        } else if (existing && typeof existing === 'object') {
            return [{
                time: parseTo24Hour(existing.time),
                parah: existing.parah || "",
                startDate: parseDateToYYYYMMDD(existing.startDate)
            }];
        }
        return [];
    };

    const [timings, setTimings] = useState({
        fajr: parseTo24Hour(currentTimings.fajr),
        dhuhr: parseTo24Hour(currentTimings.dhuhr),
        asar: parseTo24Hour(currentTimings.asar || currentTimings.asr),
        maghrib: parseTo24Hour(currentTimings.maghrib),
        isha: parseTo24Hour(currentTimings.isha),
    });

    const [jummaTimings, setJummaTimings] = useState(initJumma());
    const [taraweehEntries, setTaraweehEntries] = useState(initTaraweeh());
    const [loading, setLoading] = useState(false);

    // Dynamic handers for Jumma
    const addJumma = () => setJummaTimings([...jummaTimings, ""]);
    const removeJumma = (index) => setJummaTimings(jummaTimings.filter((_, i) => i !== index));
    const updateJumma = (index, value) => {
        const newTimings = [...jummaTimings];
        newTimings[index] = value;
        setJummaTimings(newTimings);
    };

    // Dynamic handers for Taraweeh
    const addTaraweeh = () => setTaraweehEntries([...taraweehEntries, { time: "", parah: "", startDate: "" }]);
    const removeTaraweeh = (index) => setTaraweehEntries(taraweehEntries.filter((_, i) => i !== index));
    const updateTaraweeh = (index, field, value) => {
        const newEntries = [...taraweehEntries];
        newEntries[index][field] = value;
        setTaraweehEntries(newEntries);
    };

    const handleUpdate = async () => {
        setLoading(true);

        const cleanJumma = jummaTimings.filter(t => t.trim() !== "");
        const formattedJumma = cleanJumma.map(t => formatAMPM(t));

        const cleanTaraweeh = taraweehEntries.filter(t => t.time || t.parah || t.startDate);
        const formattedTaraweeh = cleanTaraweeh.map(entry => ({
            time: formatAMPM(entry.time),
            parah: entry.parah,
            startDate: formatYYYYMMDDToDateString(entry.startDate)
        }));

        const formattedTimings = {
            fajr: formatAMPM(timings.fajr),
            dhuhr: formatAMPM(timings.dhuhr),
            asar: formatAMPM(timings.asar),
            maghrib: formatAMPM(timings.maghrib),
            isha: formatAMPM(timings.isha),
            jummatiming: formattedJumma,
            taravi: formattedTaraweeh,
        };

        const updates = { timings: formattedTimings };

        try {
            await updateMasjidDetails(masjid.id || masjid.mosqueId, updates);

            // Create deeply updated state properly, pass it back so AboutMasjid updates instantly
            const updatedMasjid = {
                ...masjid,
                details: {
                    ...masjid.details,
                    timings: formattedTimings
                }
            };

            alert("Timings Updated Successfully!");
            // Use replace: true so hitting back doesn't get messed up traversing local history
            navigate("/about-masjid", { state: { masjid: updatedMasjid }, replace: true });
        } catch (error) {
            console.error(error);
            alert("Could not update timings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "80px 20px 100px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <button className="btn-back" onClick={() => navigate(-1)} style={{ marginRight: 15, marginBottom: 0 }}>
                    <IoArrowBack />
                </button>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#111827", margin: 0 }}>Update Timings</h2>
                    <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>{masjid.details?.name}</p>
                </div>
            </div>

            {/* Daily Prayers Card */}
            <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: "bold", color: "#374151", marginBottom: 15 }}>Daily Prayers</h3>
                {['fajr', 'dhuhr', 'asar', 'maghrib', 'isha'].map((prayer) => (
                    <div key={prayer} className="time-row" style={{ marginBottom: 15 }}>
                        <label style={{ fontSize: 15, fontWeight: 500, color: "#4B5563" }}>
                            {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                        </label>
                        <input
                            type="time"
                            className="time-input"
                            value={timings[prayer]}
                            onChange={(e) => setTimings({ ...timings, [prayer]: e.target.value })}
                        />
                    </div>
                ))}
            </div>

            {/* Jumu'ah Timings Card */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <h3 style={{ fontSize: 16, fontWeight: "bold", color: "#059669", margin: 0 }}>Jummah Timings</h3>
                    <button
                        onClick={addJumma}
                        style={{ color: "#059669", background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, fontWeight: "600", cursor: "pointer" }}
                    >
                        <IoAddCircleOutline size={18} /> Add
                    </button>
                </div>
                {jummaTimings.map((time, idx) => (
                    <div key={idx} className="time-row" style={{ marginBottom: 15, display: "flex", alignItems: "center", gap: 10 }}>
                        <label style={{ fontSize: 15, fontWeight: 500, color: "#4B5563", flex: 1 }}>
                            Jummah {jummaTimings.length > 1 ? idx + 1 : ''}
                        </label>
                        <input
                            type="time"
                            className="time-input"
                            style={{ flex: 2 }}
                            value={time}
                            onChange={(e) => updateJumma(idx, e.target.value)}
                        />
                        {jummaTimings.length > 1 && (
                            <button onClick={() => removeJumma(idx)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "5px" }}>
                                <IoTrashOutline size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Taraweeh Schedule Card */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <h3 style={{ fontSize: 16, fontWeight: "bold", color: "#6366F1", margin: 0 }}>Taraweeh Schedule</h3>
                    <button
                        onClick={addTaraweeh}
                        style={{ color: "#6366F1", background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, fontWeight: "600", cursor: "pointer" }}
                    >
                        <IoAddCircleOutline size={18} /> Add
                    </button>
                </div>

                {taraweehEntries.length === 0 && (
                    <p style={{ color: "#6B7280", fontSize: 14, fontStyle: "italic", textAlign: "center", margin: "10px 0" }}>
                        No Taraweeh schedule added.
                    </p>
                )}

                {taraweehEntries.map((entry, idx) => (
                    <div key={idx} style={{ backgroundColor: "#F9FAFB", padding: 15, borderRadius: 8, marginBottom: 15, position: "relative" }}>
                        <button
                            onClick={() => removeTaraweeh(idx)}
                            style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}
                        >
                            <IoTrashOutline size={20} />
                        </button>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: 14, color: "#4B5563" }}>Taraweeh #{idx + 1}</h4>

                        <div style={{ display: "grid", gap: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 14, color: "#374151", width: "30%" }}>Date</span>
                                <input
                                    type="date"
                                    className="modal-input"
                                    style={{ margin: 0, padding: "8px", width: "65%" }}
                                    value={entry.startDate}
                                    onChange={(e) => updateTaraweeh(idx, "startDate", e.target.value)}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 14, color: "#374151", width: "30%" }}>Time</span>
                                <input
                                    type="time"
                                    className="time-input"
                                    style={{ margin: 0, padding: "8px", width: "65%" }}
                                    value={entry.time}
                                    onChange={(e) => updateTaraweeh(idx, "time", e.target.value)}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 14, color: "#374151", width: "30%" }}>Parah</span>
                                <input
                                    type="text"
                                    placeholder="e.g. Parah 1 to 3"
                                    className="modal-input"
                                    style={{ margin: 0, padding: "8px", width: "65%" }}
                                    value={entry.parah}
                                    onChange={(e) => updateTaraweeh(idx, "parah", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 25 }}>
                <button
                    className="btn-primary"
                    style={{ width: "100%", background: "#10B981", padding: 16 }}
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    {loading ? "Updating..." : (
                        <>
                            Save Timings <IoCheckmarkCircleOutline style={{ marginLeft: 8 }} size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
