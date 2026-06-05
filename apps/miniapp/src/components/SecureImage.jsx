import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const SecureImage = ({ imagePath, alt, className, fallback }) => {
    // Standard default coffee shop fallback template string
    const defaultFallback = fallback || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300";
    const [imageSrc, setImageSrc] = useState(defaultFallback);

    useEffect(() => {
        if (!imagePath) {
            setImageSrc(defaultFallback);
            return;
        }

        // Pass external URLs straight through
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            if (!imagePath.includes("/storage/") && !imagePath.includes("/logos/")) {
                setImageSrc(imagePath);
                return;
            }
        }

        const fetchBase64Image = async () => {
            try {
                // Strip redundant characters to get clean filename params
                let cleanPath = imagePath.replace(/^\//, "");
                cleanPath = cleanPath.replace("storage/", "").replace("public/", "");
                
                if (cleanPath.startsWith("http")) {
                    const separator = cleanPath.includes("/storage/") ? "/storage/" : "/logos/";
                    cleanPath = (separator === "/logos/" ? "logos/" : "") + cleanPath.split(separator)[1];
                }

                // 🚀 Fetch the data pattern via Axios (fully bypassing ngrok asset blocks!)
                const response = await api.get(`/media?path=${encodeURIComponent(cleanPath)}`);
                
                if (response.data && response.data.data) {
                    setImageSrc(response.data.data);
                } else {
                    setImageSrc(defaultFallback);
                }
            } catch (error) {
                console.error("🔒 Secure binary load crash error:", error);
                setImageSrc(defaultFallback);
            }
        };

        fetchBase64Image();
    }, [imagePath, defaultFallback]);

    return <img src={imageSrc} alt={alt} className={className} />;
};

export default SecureImage;
