import React, { useState, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import debounce from "lodash.debounce";

export default function SearchBar({ setSendCoords }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const fetchResults = useCallback(
        debounce(async (text) => {
            if (!text || text.length < 3) {
                setResults([]);
                return;
            }
            try {
                const response = await fetch(
                    `/ola-api/places/v1/autocomplete?input=${encodeURIComponent(text)}&api_key=4yMoq0DZvYfIOnx8bt5vllCNmshBnfNIrsRvE36q`,
                    { headers: { "X-Request-Id": "REACT-WEB" } }
                );
                const data = await response.json();
                setResults(data.predictions || []);
            } catch (err) {
                console.error("Search error:", err);
            }
        }, 300),
        []
    );

    const handleSelect = (item) => {
        const lat = item.geometry?.location?.lat;
        const lng = item.geometry?.location?.lng;
        if (lat && lng) {
            setSendCoords({ lat, lng });
        }
        setQuery(item.description || item.structured_formatting?.main_text || "");
        setResults([]);
    };

    return (
        <div className="search-bar-wrapper">
            <div className="search-input-row">
                <IoSearch size={18} />
                <input
                    type="text"
                    placeholder="Search location..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        fetchResults(e.target.value);
                    }}
                />
            </div>
            {results.length > 0 && (
                <div className="search-results-list">
                    {results.map((item, idx) => (
                        <div
                            key={idx}
                            className="search-result-item"
                            onClick={() => handleSelect(item)}
                        >
                            {item.description || item.structured_formatting?.main_text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
