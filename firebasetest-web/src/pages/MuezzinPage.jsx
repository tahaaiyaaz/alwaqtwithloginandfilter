import React from "react";
import { IoBusiness } from "react-icons/io5";

export default function MuezzinPage() {
    return (
        <div className="centered-container" style={{ textAlign: "center", padding: 20 }}>
            <IoBusiness size={80} color="#10B981" style={{ marginBottom: 20 }} />
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#10B981", marginBottom: 10 }}>Your Masjid</h1>
            <p style={{ fontSize: 16, color: "#6B7280" }}>
                All the details of your masjid will appear here soon.
            </p>
        </div>
    );
}
