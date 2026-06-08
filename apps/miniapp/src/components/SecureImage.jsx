import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const SecureImage = ({ imagePath, alt, className, fallback }) => {
    const defaultFallback = fallback || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300";
    const [imageSrc, setImageSrc] = useState(defaultFallback);

    useEffect(() => {
        if (!imagePath) {
            setImageSrc(defaultFallback);
            return;
        }

        // 1️⃣ Direct Passthrough for absolute external mockup placeholder URLs
        if ((imagePath.startsWith("http://") || imagePath.startsWith("https://")) && 
            !imagePath.includes("/storage/") && !imagePath.includes("/logos/")) {
            setImageSrc(imagePath);
            return;
        }

        const fetchBase64Image = async () => {
            try {
                let cleanPath = imagePath;

                // 2️⃣ 🎯 BULLETPROOF SPLITTER: Extract everything after /storage/ or /public/ dynamically
                if (cleanPath.includes("/storage/")) {
                    cleanPath = cleanPath.split("/storage/")[1];
                } else if (cleanPath.includes("/public/")) {
                    cleanPath = cleanPath.split("/public/")[1];
                }

                // 3️⃣ Strip out any remaining leading slashes or wrapper fragments
                cleanPath = cleanPath.replace(/^\//, "");
                
                // If it still has a full URL structure because of an edge case, get the path fragment
                if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
                    const urlObj = new URL(cleanPath);
                    cleanPath = urlObj.pathname.replace(/^\//, "").replace("storage/", "").replace("public/", "");
                }

                // 🚀 Call your backend MediaController API to request the unblockable Base64 string context
                const response = await api.get(`/media?path=${encodeURIComponent(cleanPath)}`);
                
                if (response.data && response.data.data) {
                    setImageSrc(response.data.data);
                } else {
                    setImageSrc(defaultFallback);
                }
            } catch (error) {
                console.log("🔒 Secure image loading error, keeping fallback visual");
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
                if (e.target.src !== defaultFallback) {
                    e.target.src = defaultFallback;
                }
            }}
        />
    );
};

export default SecureImage;