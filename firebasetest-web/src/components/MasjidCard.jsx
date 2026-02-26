import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMoon, IoLocation, IoTime, IoCalendarOutline } from "react-icons/io5";

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

function formatDistance(d) {
    if (!d) return "---";
    if (typeof d === "string") return d;
    if (typeof d === "number") {
        return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
    }
    return "---";
}

export default function MasjidCard({
    MasjidName,
    MasjidDistance,
    NextNamazTime,
    masjid,
    showEvents = false,
    fullWidth = false,
}) {
    const navigate = useNavigate();
    const hasEvents = masjid?.details?.events?.length > 0;

    return (
        <div
            className={`masjid-card${fullWidth ? " full-width" : ""}`}
            onClick={() => navigate("/about-masjid", { state: { masjid } })}
        >
            <div className="masjid-card-content">
                <div className="masjid-card-icon">
                    <IoMoon size={24} color="#10B981" />
                </div>
                <div className="masjid-card-text">
                    <h3>{toPascalCase(MasjidName)}</h3>
                    <div className="masjid-card-badges">
                        <span className="badge badge-primary">
                            <IoLocation size={12} /> {formatDistance(MasjidDistance)}
                        </span>
                        <span className="badge badge-accent">
                            <IoTime size={12} /> {NextNamazTime || "---"}
                        </span>
                    </div>
                </div>
            </div>

            {showEvents && hasEvents && (
                <div className="events-section">
                    <div className="divider" />
                    <div className="events-title">Upcoming Events</div>
                    {masjid.details.events.slice(0, 2).map((event, idx) => (
                        <div key={idx} className="event-item">
                            <IoCalendarOutline size={14} color="#6B7280" />
                            <span>
                                {event.name || event.title} - {event.date || event.time}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
