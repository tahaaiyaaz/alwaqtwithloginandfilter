import React, { useState, useEffect } from "react";
import MasjidCard from "../components/MasjidCard";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const getNextPrayer = (timings) => {
    if (!timings) return { time: "---" };
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = ["fajr", "dhuhr", "asar", "maghrib", "isha"];
    for (const prayer of prayers) {
        const t = timings[prayer];
        if (!t) continue;
        const match = t.toString().trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (!match) continue;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3];
        if (period) {
            if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
            if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
        }
        const mins = hours * 60 + minutes;
        if (mins > currentMinutes) return { name: prayer, time: t };
    }
    return { time: timings.fajr || "---" };
};

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const stored = localStorage.getItem("@user");
            if (!stored) { setLoading(false); return; }
            const user = JSON.parse(stored);
            const userId = user.userid || user.id;
            if (!userId) { setLoading(false); return; }

            // Get user location
            let userLat = null, userLng = null;
            try {
                const pos = await new Promise((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                );
                userLat = pos.coords.latitude;
                userLng = pos.coords.longitude;
            } catch { }

            const res = await fetch("/api/getFavoriteMasjids", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            const raw = data.masjids || [];

            const processed = raw.map((m) => {
                let distance = null;
                if (userLat && m.location?.latitude && m.location?.longitude) {
                    distance = calculateDistance(userLat, userLng, m.location.latitude, m.location.longitude);
                }
                const nextPrayer = getNextPrayer(m.details?.timings);
                return {
                    ...m,
                    distance,
                    distanceText: distance !== null
                        ? (distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`)
                        : "N/A",
                    nextPrayerTime: nextPrayer.time,
                };
            });
            processed.sort((a, b) => {
                if (a.distance === null) return 1;
                if (b.distance === null) return -1;
                return a.distance - b.distance;
            });
            setFavorites(processed);
        } catch (err) {
            console.error("Error fetching favorites:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#10B981", marginBottom: 20 }}>
                ❤️ Favorite Masjids
            </h2>
            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : favorites.length === 0 ? (
                <div className="empty-state"><p>No favorites yet. Heart a masjid to add it here!</p></div>
            ) : (
                favorites.map((m, idx) => (
                    <MasjidCard
                        key={m.id || idx}
                        MasjidName={m.details?.name || m.mosqueName}
                        MasjidDistance={m.distanceText}
                        NextNamazTime={m.nextPrayerTime}
                        masjid={m}
                        showEvents={true}
                        fullWidth={true}
                    />
                ))
            )}
        </div>
    );
}
