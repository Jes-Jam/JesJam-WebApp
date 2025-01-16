import { useState, useEffect } from 'react';
import axios from 'axios';

export const useRequestCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get("/api/admin/public-requests");
                setCount(response.data.length);
            } catch (error) {
                console.error("Failed to fetch request count");
            }
        };

        fetchCount();
        // Optional: Set up polling to check for new requests
        const interval = setInterval(fetchCount, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return count;
};