// hooks/useExpiredMembers.js
import { useState, useEffect } from "react";

export default function useExpiredMembers() {
  const [expiredMembers, setExpiredMembers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://16.171.9.39:80';
  useEffect(() => {
    fetch(`${API_URL}/members/expired`)
      .then(res => res.json())   // parse JSON body
      .then(data => setExpiredMembers(data))
      .catch(err => console.error("Failed to fetch expired members", err));
  }, []);

  return { expiredMembers };
}
