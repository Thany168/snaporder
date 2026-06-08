import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const SecureImage = ({ imagePath, alt, className, fallback }) => {
    // ☕ Safe default asset mockup string
    const defaultFallback = fallback || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300";
    const [imageSrc, setImageSrc] = useState(defaultFallback);

    useEffect(() => {
        if (!imagePath) {
            setImageSrc(defaultFallback);
            return;
        }

        // 1️⃣ Direct Passthrough for absolute external URLs (Unsplash, etc.)
        if ((imagePath.startsWith("http://") || imagePath.startsWith("https://")) && 
            !imagePath.includes("/storage/") && !imagePath.includes("/logos/")) {
            setImageSrc(imagePath);
            return;
        }

        const fetchBase64Image = async () => {
            try {
                let cleanPath = imagePath;

                // Strip full domain mappings out if sent by Laravel
                if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
                    if (cleanPath.includes("/storage/")) {
                        cleanPath = cleanPath.split("/storage/")[1];
                    } else if (cleanPath.includes("/logos/")) {
                        cleanPath = "logos/" + cleanPath.split("/logos/")[1];
                    }
                }

                // Clean redundant naming keys safely
                cleanPath = cleanPath.replace(/^\//, "").replace("storage/", "").replace("public/", "");

                // 🚀 CALL THE BACKEND API
                const response = await api.get(`/media?path=${encodeURIComponent(cleanPath)}`);
                
                if (response.data && response.data.data) {
                    setImageSrc(response.data.data);
                } else {
                    // 🎯 Catch internal failures cleanly
                    setImageSrc(defaultFallback);
                }
            } catch (error) {
                console.log("🔒 Secure image not on local disk, using fallback stream visual context");
                // 🎯 THE CRITICAL FRONTLINE FIX: Safely override state variables on any 404 block!
                setImageSrc(defaultFallback);
            }
        };

        fetchBase64Image();
    }, [imagePath, defaultFallback]);

    return (
        <img 
            src={imageSrc} 
            alt={alt} 
            className={className} 
            onError={(e) => {
                // Absolute backup check if the remote placeholder fails to render string data natively
                if (e.target.src !== defaultFallback) {
                    e.target.src = defaultFallback;
                }
            }}
        />
    );
};

export default SecureImage;