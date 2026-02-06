// src/hooks/useAmounts.js
import { useState } from "react";

export default function useAmounts() {
  const [error, setError] = useState(null);

  const addAmount = async (amountData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/Add_Amount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(amountData),
      });
      if (!res.ok) throw new Error("Failed to add amount");
      return await res.json();
    } catch (err) {
      setError(err.message);
    }
  };

  const editAmount = async (user_id, amountData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/Edit_Amount/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(amountData),
      });
      if (!res.ok) throw new Error("Failed to edit amount");
      return await res.json();
    } catch (err) {
      setError(err.message);
    }
  };

  return { addAmount, editAmount, error };
}
