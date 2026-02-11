// src/hooks/useTrainers.js
import { useEffect, useState } from "react";

export default function useTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/get_trainer`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((err) => setError(err.message));
  }, []);

  const addTrainer = async (newTrainer) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/Add_Trainer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...newTrainer, role: "Trainer" }), // enforce role
    });
    if (res.ok) {
      const added = await res.json();
      setTrainers([...trainers, added]);
    }
  };

  const deleteTrainer = async (email) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/Delete_Trainer/${email}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTrainers(trainers.filter((t) => t.email !== email));
    }
  };

  const updateTrainer = async (trainer) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/update_Trainer/${trainer.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(trainer),
    });
    if (res.ok) {
      const updated = await res.json();
      setTrainers(trainers.map((t) => (t.email === updated.email ? updated : t)));
    }
  };

  return { trainers, error, addTrainer, deleteTrainer, updateTrainer };
}
