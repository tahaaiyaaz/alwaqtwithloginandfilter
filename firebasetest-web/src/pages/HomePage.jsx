import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MasjidCard from "../components/MasjidCard";
import FilterPopover from "../components/FilterPopover";
import { IoFilter } from "react-icons/io5";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

const timeToMinutes = (timeStr, prayerName = "") => {
    if (!timeStr) return null;
    try {
        const cleaned = timeStr.toString().trim();
        const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (!match) return null;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3];
        if (period) {
            if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
            if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
        }
        return hours * 60 + minutes;
    } catch {
        return null;
    }
};

const getNextPrayer = (timings) => {
    if (!timings) return { time: "---", name: "none" };
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = ["fajr", "dhuhr", "asar", "maghrib", "isha"];
    let nextPrayer = null;
    for (const prayer of prayers) {
        let timeStr = timings[prayer];
        if (!timeStr && prayer === "asar") timeStr = timings["asr"]; // fallback
        const mins = timeToMinutes(timeStr, prayer);
        if (mins !== null && mins > currentMinutes) {
            nextPrayer = { name: prayer, time: timeStr, diff: mins - currentMinutes };
            break;
        }
    }
    if (!nextPrayer && timings.fajr) {
        nextPrayer = { name: "fajr", time: timings.fajr };
    }
    return nextPrayer || { time: "---", name: "none" };
};

const toTitleCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function HomePage() {
    const navigate = useNavigate();
    const [location, setLocation] = useState({ lat: "", lng: "" });
    const [masjidData, setMasjidData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilters, setActiveFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setErrorMsg("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Geolocation Success:", position.coords.latitude, position.coords.longitude);
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                console.error("Geolocation Error:", err);
                setErrorMsg(`Could not get location: ${err.message}`);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    useEffect(() => {
        if (!location.lat || !location.lng) return;

        const fetchMasjids = async () => {
            setLoading(true);
            try {
                const url = new URL(window.location.origin + "/api/getNearestMasjid");
                url.searchParams.append("latitude", location.lat);
                url.searchParams.append("longitude", location.lng);
                url.searchParams.append("radiusInKm", 50);

                const response = await fetch(url.toString(), {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                const masjids = data.masjids || [];

                const processed = masjids.map((m) => {
                    let distance = null;
                    if (m.location?.latitude && m.location?.longitude) {
                        distance = calculateDistance(
                            location.lat,
                            location.lng,
                            m.location.latitude,
                            m.location.longitude
                        );
                    }
                    const nextPrayer = getNextPrayer(m.details?.timings);
                    return {
                        ...m,
                        distance,
                        distanceText:
                            distance !== null
                                ? distance < 1
                                    ? `${Math.round(distance * 1000)} m`
                                    : `${distance.toFixed(1)} km`
                                : "N/A",
                        nextPrayerTime: nextPrayer.time,
                        minsUntilPrayer: nextPrayer.diff,
                    };
                });

                processed.sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                });

                setMasjidData(processed);
                setFilteredData(processed);
            } catch (err) {
                console.error("Error fetching masjids", err);
                setErrorMsg("Failed to load masjids");
            } finally {
                setLoading(false);
            }
        };

        fetchMasjids();
    }, [location]);

    const handleApplyFilter = (filters) => {
        setActiveFilters(filters);
        const res = masjidData.filter(m => m.distance === null || m.distance <= filters.distance);
        setFilteredData(res);
        setShowFilter(false);
    };

    // Compute exact Early / Late arrays purely targeting the global current prayer or filtered prayer
    const computePrayerLists = (dataArray, filters) => {
        const prayers = ["fajr", "dhuhr", "asar", "maghrib", "isha"];
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let timesByPrayer = {};
        prayers.forEach(prayer => {
            timesByPrayer[prayer] = dataArray
                .map(m => {
                    let timeStr = m.details?.timings?.[prayer];
                    if (!timeStr && prayer === "asar") timeStr = m.details?.timings?.["asr"];
                    return {
                        ...m,
                        targetPrayerTimeStr: timeStr,
                        targetPrayerMins: timeToMinutes(timeStr, prayer)
                    };
                })
                .filter(m => m.targetPrayerMins !== null)
                .sort((a, b) => a.targetPrayerMins - b.targetPrayerMins);
        });

        let targetPrayer = null;
        if (filters && filters.timeFilterType === "prayer" && filters.prayerType) {
            targetPrayer = filters.prayerType.toLowerCase();
            if (targetPrayer === "asr") targetPrayer = "asar";
        }

        let upcomingObj;

        if (targetPrayer && prayers.includes(targetPrayer)) {
            upcomingObj = {
                name: targetPrayer,
                masjids: timesByPrayer[targetPrayer] || []
            };
        } else {
            // Find the first prayer where the LATEST time is >= current time
            console.log(`[DEBUG] Current Time: ${Math.floor(currentMinutes / 60)}:${currentMinutes % 60} (${currentMinutes} mins)`);

            upcomingObj = prayers
                .map(prayer => {
                    const sorted = timesByPrayer[prayer] || [];
                    const latestMin = sorted.length > 0 ? sorted[sorted.length - 1].targetPrayerMins : 0;
                    console.log(`[DEBUG] Evaluating ${prayer.toUpperCase()}: Total Masjids found = ${sorted.length}, Latest time across all masjids = ${Math.floor(latestMin / 60)}:${latestMin % 60} (${latestMin} mins)`);
                    return {
                        name: prayer,
                        masjids: sorted,
                        latestMin: latestMin
                    };
                })
                .find(p => p.masjids.length > 0 && p.latestMin >= currentMinutes);

            if (!upcomingObj) {
                console.log("[DEBUG] No prayer found where the latest time is >= current time. Falling back!");
                // If late at night (past all Ishas), just select the first prayer that has any masjids (usually Fajr)
                upcomingObj = prayers
                    .map(prayer => ({ name: prayer, masjids: timesByPrayer[prayer] || [] }))
                    .find(p => p.masjids.length > 0) || { name: "Prayer", masjids: [] };
            }

            console.log(`[DEBUG] Selected Prayer: ${upcomingObj.name.toUpperCase()}`);
        }

        let finalMasjids = upcomingObj.masjids;

        // Apply custom time filter config if any
        if (filters && filters.timeFilterType === "custom" && filters.customTimeConfig) {
            const cfg = filters.customTimeConfig;
            if (cfg.type === "before" && cfg.singleTime) {
                const limit = timeToMinutes(cfg.singleTime);
                if (limit) finalMasjids = finalMasjids.filter(m => m.targetPrayerMins <= limit);
            } else if (cfg.type === "between" && cfg.rangeStart && cfg.rangeEnd) {
                const start = timeToMinutes(cfg.rangeStart);
                const end = timeToMinutes(cfg.rangeEnd);
                if (start && end) finalMasjids = finalMasjids.filter(m => m.targetPrayerMins >= start && m.targetPrayerMins <= end);
            }
        }

        return {
            prayerName: toTitleCase(upcomingObj.name),
            allMasjids: finalMasjids,
            earliest: finalMasjids.slice(0, 10),
            late: [...finalMasjids].reverse().slice(0, 10)
        };
    };

    const prayerLists = computePrayerLists(filteredData, activeFilters);
    const earliestMasjids = prayerLists.earliest;
    const lateMasjids = prayerLists.late;
    const globalPrayerName = prayerLists.prayerName;

    // Nearby should also be affected by the prayer filter/timing filter
    const nearbyMasjids = [...prayerLists.allMasjids]
        .sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        })
        .slice(0, 10);

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <h1>Find Peace</h1>
                <p>Nearest Masjids & Prayer Times</p>
                <div className="header-search-row">
                    <div style={{ flex: 1 }}>
                        <SearchBar setSendCoords={setLocation} />
                    </div>
                    <button className="filter-btn" onClick={() => setShowFilter(true)}>
                        <IoFilter />
                    </button>
                </div>

                <div style={{ marginTop: 15, padding: "10px 15px", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: 8, borderLeft: "4px solid #10B981" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#065F46", fontWeight: "600" }}>
                        <span style={{ display: "block", marginBottom: 2 }}>📍 Active Prayer: {globalPrayerName}</span>
                        <span style={{ fontWeight: "normal" }}>
                            {activeFilters && activeFilters.timeFilterType === "prayer"
                                ? "Manually selected via filter."
                                : `Auto-selected because ${globalPrayerName} is the next upcoming prayer.`}
                        </span>
                    </p>
                </div>
            </div>

            {showFilter && (
                <FilterPopover
                    onClose={() => setShowFilter(false)}
                    onApply={handleApplyFilter}
                />
            )}

            {/* Content */}
            <div className="page-padding">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner" />
                    </div>
                ) : errorMsg && masjidData.length === 0 ? (
                    <div className="empty-state">
                        <p>{errorMsg}</p>
                    </div>
                ) : (
                    <>
                        {/* Nearby Masjids Section */}
                        <div className="section-header">
                            <span className="section-title">Nearby</span>
                            <button className="see-all" onClick={() => navigate("/masjids", { state: { masjids: filteredData } })}>See All</button>
                        </div>
                        {nearbyMasjids.length === 0 ? (
                            <p style={{ color: "#6B7280", fontSize: 14 }}>No masjids found</p>
                        ) : (
                            <div className="horizontal-scroll">
                                {nearbyMasjids.map((m, idx) => (
                                    <MasjidCard
                                        key={m.id || idx}
                                        MasjidName={m.details?.name || m.mosqueName}
                                        MasjidDistance={m.distanceText}
                                        NextNamazTime={m.targetPrayerTimeStr}
                                        masjid={m}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Early Prayer Section */}
                        <div className="section-header">
                            <span className="section-title">Earliest {globalPrayerName}</span>
                            <button className="see-all" onClick={() => navigate("/masjids", { state: { masjids: earliestMasjids } })}>See All</button>
                        </div>
                        {earliestMasjids.length === 0 ? (
                            <p style={{ color: "#6B7280", fontSize: 14 }}>No masjids found</p>
                        ) : (
                            <div className="horizontal-scroll">
                                {earliestMasjids.map((m, idx) => (
                                    <MasjidCard
                                        key={m.id || idx}
                                        MasjidName={m.details?.name || m.mosqueName}
                                        MasjidDistance={m.distanceText}
                                        NextNamazTime={m.targetPrayerTimeStr}
                                        masjid={m}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Late Prayer Section */}
                        <div className="section-header">
                            <span className="section-title">Late {globalPrayerName}</span>
                            <button className="see-all" onClick={() => navigate("/masjids", { state: { masjids: lateMasjids } })}>See All</button>
                        </div>
                        {lateMasjids.length === 0 ? (
                            <p style={{ color: "#6B7280", fontSize: 14 }}>No masjids found</p>
                        ) : (
                            <div className="horizontal-scroll">
                                {lateMasjids.map((m, idx) => (
                                    <MasjidCard
                                        key={m.id || idx}
                                        MasjidName={m.details?.name || m.mosqueName}
                                        MasjidDistance={m.distanceText}
                                        NextNamazTime={m.targetPrayerTimeStr}
                                        masjid={m}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
