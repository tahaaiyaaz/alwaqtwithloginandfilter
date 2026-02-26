import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function FilterPopover({ onClose, onApply }) {
    const [timeFilter, setTimeFilter] = useState("before");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [distance, setDistance] = useState("3");
    const [dropdownValue, setDropdownValue] = useState("");

    const handleApply = () => {
        onApply({
            distance: parseFloat(distance) || 3,
            timeFilterType: dropdownValue ? "prayer" : "custom",
            prayerType: dropdownValue,
            customTimeConfig: dropdownValue ? null : {
                type: timeFilter, // "before" or "between"
                singleTime: selectedTime,
                rangeStart: selectedStartTime,
                rangeEnd: selectedEndTime
            }
        });
    };

    const handleClear = () => {
        setTimeFilter("before");
        setSelectedTime("");
        setSelectedStartTime("");
        setSelectedEndTime("");
        setDistance("3");
        setDropdownValue("");
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#111827", margin: 0 }}>Filter Options</h2>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                        <IoClose size={24} color="#6B7280" />
                    </button>
                </div>

                {/* Distance Filter */}
                <div style={{ marginBottom: 20 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Distance (km)</label>
                    <input
                        type="number"
                        className="form-input"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g. 5"
                    />
                </div>

                {/* Prayer Dropdown */}
                <div style={{ marginBottom: 20 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>By Prayer Event</label>
                    <select
                        className="form-select"
                        value={dropdownValue}
                        onChange={(e) => setDropdownValue(e.target.value)}
                    >
                        <option value="">Select a Prayer</option>
                        <option value="fajr">Fajr</option>
                        <option value="dhuhr">Dhuhr</option>
                        <option value="asar">Asar</option>
                        <option value="isha">Isha</option>
                        <option value="jummatiming">Jummah</option>
                    </select>
                </div>

                <div style={{ textAlign: "center", color: "#6B7280", margin: "10px 0" }}>OR Filter by Actual Time</div>

                {/* Time Filter Type */}
                <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                    <button
                        className={`btn-secondary ${timeFilter === "before" ? "active" : ""}`}
                        style={{ flex: 1, borderColor: timeFilter === "before" ? "#10B981" : "#D1D5DB", color: timeFilter === "before" ? "#10B981" : "#374151" }}
                        onClick={() => setTimeFilter("before")}
                    >
                        Before Time
                    </button>
                    <button
                        className={`btn-secondary ${timeFilter === "between" ? "active" : ""}`}
                        style={{ flex: 1, borderColor: timeFilter === "between" ? "#10B981" : "#D1D5DB", color: timeFilter === "between" ? "#10B981" : "#374151" }}
                        onClick={() => setTimeFilter("between")}
                    >
                        Between Times
                    </button>
                </div>

                {/* Time Inputs */}
                {timeFilter === "before" ? (
                    <div style={{ marginBottom: 20 }}>
                        <label className="form-label">Select Time</label>
                        <input type="time" className="time-input" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Start Time</label>
                            <input type="time" className="time-input" value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">End Time</label>
                            <input type="time" className="time-input" value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)} />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button className="btn-secondary" style={{ flex: 1 }} onClick={handleClear}>Clear</button>
                    <button className="btn-primary" style={{ flex: 2 }} onClick={handleApply}>Apply Filters</button>
                </div>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .modal-content {
          background: white;
          width: 90%;
          max-width: 400px;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
      `}</style>
        </div>
    );
}
