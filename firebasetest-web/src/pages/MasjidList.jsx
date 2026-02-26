import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMoon, IoChevronForward, IoArrowBack } from "react-icons/io5";

function toPascalCase(str) {
    if (!str) return "Unknown Masjid";
    return str
        .split(/([ -])/g)
        .map((word) =>
            word.match(/[a-zA-Z]/)
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word
        )
        .join("");
}

export default function MasjidList() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const masjidData = state?.masjids || [];

    return (
        <div style={{ padding: 20 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button className="btn-back" onClick={() => navigate(-1)} style={{ marginRight: 15, marginBottom: 0 }}>
                        <IoArrowBack />
                    </button>
                    <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#111827", margin: 0 }}>All Masjids</h2>
                </div>
            </div>

            {masjidData.length === 0 ? (
                <div className="empty-state"><p>No masjids found.</p></div>
            ) : (
                masjidData.map((item, idx) => (
                    <div
                        key={idx}
                        className="card"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 15,
                            marginBottom: 12,
                            cursor: "pointer"
                        }}
                        onClick={() => navigate("/about-masjid", { state: { masjid: item } })}
                    >
                        <div style={{
                            width: 50, height: 50, borderRadius: 25, backgroundColor: "#D1FAE5",
                            display: "flex", alignItems: "center", justifyContent: "center", marginRight: 15
                        }}>
                            <IoMoon size={24} color="#10B981" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                                {toPascalCase(item.details?.name)}
                            </h3>
                            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>
                                {toPascalCase(item.details?.addressLine1)} {toPascalCase(item.details?.addressLine2)} {item.cityID}
                            </p>
                        </div>

                        <IoChevronForward size={20} color="#9CA3AF" />
                    </div>
                ))
            )}

            <div style={{ marginTop: 25, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 10 }}>Can't find your masjid?</p>
                <button
                    className="btn-primary"
                    style={{ width: "100%", padding: 14 }}
                    onClick={() => navigate("/add-masjid")}
                >
                    + Add New Masjid
                </button>
            </div>
        </div>
    );
}
