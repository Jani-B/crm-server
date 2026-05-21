"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeAddress = geocodeAddress;
async function geocodeAddress(address) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "FastVistior",
            },
        });
        const data = await res.json();
        if (!data.length) {
            return null;
        }
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
        };
    }
    catch (err) {
        console.error("GEOCODE ERROR:", err);
        return null;
    }
}
