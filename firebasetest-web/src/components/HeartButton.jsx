import React, { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { updateUserDetails } from "../api/userupdate";

export default function HeartButton({ masjidid, initialFavorited = false }) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [loading, setLoading] = useState(false);

    const handlePress = async (e) => {
        e.stopPropagation(); // prevent navigation if placed inside a card
        setLoading(true);

        try {
            let userData = localStorage.getItem("@user");
            if (!userData) {
                alert("Please login to add favorites.");
                setLoading(false);
                return;
            }

            userData = JSON.parse(userData);

            // Update favorites list
            const updates = { favorites: [masjidid] };
            await updateUserDetails(userData.userid || userData.id, updates);

            setIsFavorited(!isFavorited);
            alert(isFavorited ? "Removed from favorites" : "Added to favorites");
        } catch (err) {
            console.error(err);
            alert("Failed to update user details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePress}
            disabled={loading}
            style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {isFavorited ? (
                <IoHeart size={24} color="#EF4444" />
            ) : (
                <IoHeartOutline size={24} color="#6B7280" />
            )}
        </button>
    );
}
