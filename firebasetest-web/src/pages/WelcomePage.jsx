import React from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="centered-container" style={{ backgroundColor: "#F3F4F6", justifyContent: "space-between", padding: "60px 20px 40px" }}>
            <div style={{ flex: 1 }} />

            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: 42, fontWeight: "bold", color: "#10B981", marginBottom: 8 }}>Al Waqt</h1>
                <p style={{ fontSize: 16, color: "#6B7280" }}>Your Own Islamic Community App</p>
            </div>

            <div style={{ flex: 1 }} />

            <button
                className="btn-primary"
                style={{ width: "100%", padding: 18, borderRadius: 12, fontSize: 18, fontWeight: "bold" }}
                onClick={() => navigate("/")}
            >
                Let's Start
            </button>
        </div>
    );
}
