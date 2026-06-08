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

        // Direct bypass for standard external web placeholders
        if ((imagePath.startsWith("http://") || imagePath.startsWith("https://")) && 
            !imagePath.includes("/storage/") && !imagePath.includes("/logos/") && !imagePath.includes("/covers/")) {
            setImageSrc(imagePath);
            return;
        }

        const fetchBase64Image = async () => {
            try {
                let cleanPath = imagePath;

                // Safely extract the relative directory target chunks
                if (cleanPath.includes("/storage/")) {
                    cleanPath = cleanPath.split("/storage/")[1];
                } else if (cleanPath.includes("/public/")) {
                    cleanPath = cleanPath.split("/public/")[1];
                }

                cleanPath = cleanPath.replace(/^\//, "").replace("storage/", "").replace("public/", "");

                // Handle string isolation if a full production url bypasses splitting
                if (cleanPath.startsWith("http")) {
                    const parts = cleanPath.split('/');
                    cleanPath = "products/" + parts[parts.length - 1];
                }

                // Hit our custom backend route map
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