import React, { useEffect, useState } from "react";
import MemberCard from "./MembersCard";

function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ firstname: "", lastname:"",email: "", password: "",role:""});

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/get_members", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch members");
        return res.json();
      })
      .then((data) => setMembers(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/Add_Trainer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMember),
    });

    if (res.ok) {
      const added = await res.json();
      setMembers([...members, added]); // update UI
      setShowForm(false); // close form
      setNewMember({ name: "", email: "", phone: "" }); // reset
    } else {
      alert("Failed to add member");
    }
  };

  const handleDelete = async (email) => { 
  const token = localStorage.getItem("token"); 
  const res = await fetch(`http://127.0.0.1:8000/Delete_Member/${email}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }, }); 
  if (res.ok) { setMembers(members.filter((m) => m.email !== email)); } 
  else { alert("Failed to delete member"); } };
  const handleEdit = async (member) => {
  const token = localStorage.getItem("token");

  // Build the payload exactly as backend expects
  const updated = {
    firstname: member.firstname,
    lastname: member.lastname,
    email: member.email,
    password: member.password,  // or a new password if you want to change it
    role: member.role,
  };

  const res = await fetch(`http://127.0.0.1:8000/update_member/${member.email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updated),
  });

  if (res.ok) {
    const newMember = await res.json();
    setMembers(members.map((m) => (m.email === member.email ? newMember : m)));
  } else {
    alert("Failed to update member");
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! You have full access.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => setShowForm(true)}>Add Member</button>

      {showForm && (
        <form onSubmit={handleAddMember} style={{ marginTop: "20px" }}>
          <h3>New Member</h3>
          <input
            placeholder="FirstName"
            value={newMember.firstname}
            onChange={(e) => setNewMember({ ...newMember, firstname: e.target.value })}
          />
          <input
            placeholder="LastName"
            value={newMember.lastname}
            onChange={(e) => setNewMember({ ...newMember, lastname: e.target.value })}
          />
          <input
            placeholder="Email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          />
          <input
            placeholder="Password"
            value={newMember.password}
            onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {members.map((member) => (
  <MemberCard
    key={member.email}   // ✅ unique key
    member={member}
    onDelete={handleDelete}
    onEdit={handleEdit}
  />
))}


      </div>
    </div>
  );
}

export default AdminDashboard;
