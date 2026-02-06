// src/hooks/useMembers.js
import { useEffect, useState } from "react";

export default function useMembers() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/get_members", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => setError(err.message));
  }, []);

  const addMember = async (newMember) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/Add_Member", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newMember),
    });
    if (res.ok) {
      const added = await res.json();
      setMembers([...members, added]);
    }
  };

  const deleteMember = async (email) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:8000/Delete_Member/${email}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setMembers(members.filter((m) => m.email !== email));
    }
  };

  const updateMember = async (member) => {
  const token = localStorage.getItem("token");
  const { email, ...updateData } = member; // remove email from body
  const res = await fetch(`http://127.0.0.1:8000/update_member/${email}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(updateData),
  });
  if (res.ok) {
    const updated = await res.json();
    setMembers(members.map((m) => (m.email === updated.email ? updated : m)));
  }
};


  return { members, error, addMember, deleteMember, updateMember };
}
