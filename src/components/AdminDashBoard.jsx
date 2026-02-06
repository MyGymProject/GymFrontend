import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import useMembers from "../hooks/useMembers";
import useTrainers from "../hooks/useTrainers";
import useAmounts from "../hooks/useAmounts";
import MemberCard from "./MembersCard";
import MemberForm from "./MemberForm";
import TrainerForm from "./TrainerForm";
import AmountForm from "./AmountForm";
import Header from "./Header";
import Modal from "./Model";
import "./AdminDashBoard.css";

function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [selMember, setSelMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMember, setNewMember] = useState({ firstname:"", lastname:"", email:"", password:"", role:"Member" });

  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ firstname:"", lastname:"", email:"", password:"", role:"Trainer" });
  const [editTrainer, setEditTrainer] = useState(null);

  const [showAmountForm, setShowAmountForm] = useState(false);
  const [amountData, setAmountData] = useState({ amount:0, start_date:"", end_date:"", user_id:0 });

  const { trainers, addTrainer, deleteTrainer, updateTrainer } = useTrainers();
  const { members, addMember, deleteMember, updateMember } = useMembers();
  const { addAmount } = useAmounts();

  const handleAddAmount = async e => {
    e.preventDefault();
    const newAmt = await addAmount(amountData);
    setShowAmountForm(false);
    setAmountData({ amount:0, start_date:"", end_date:"", user_id:0 });
    if (newAmt && selMember) {
      setSelMember({ ...selMember, amounts:[...(selMember.amounts||[]), { ...newAmt, id:Date.now() }] });
    }
  };

  // Decode login user info
  let loginUser = null;
  const token = localStorage.getItem("token");
  if (token) {
    try { loginUser = jwtDecode(token); } catch (err) { console.error("Invalid token", err); }
  }

  return (
    <div className="admin-dashboard">
      <header className="header"><h1>Admin Dashboard</h1><Header /></header>
      <div className="middle-container">
        <div className="left-container">
          <div className="tab-buttons">
            <button onClick={()=>setTab("dashboard")}>Dashboard</button>
            <button onClick={()=>setTab("members")}>Members</button>
            <button onClick={()=>setTab("trainers")}>Trainers</button>
          </div>

          <div className="tab-content">
            {tab==="dashboard" && (
              <div className="dashboard-cards">
                <div className="dashboard-card"><h3>Total Members</h3><p>{members.length}</p></div>
                <div className="dashboard-card"><h3>Total Trainers</h3><p>{trainers.length}</p></div>
                <div className="dashboard-card"><h3>Total Amount</h3><p>{members.reduce((s,m)=>s+(m.amounts?.reduce((a,x)=>a+x.amount,0)||0),0)}</p></div>
              </div>
            )}

            {tab==="members" && (!selMember ? (
              <>
                <button onClick={()=>setShowMemberForm(true)}>Add Member</button>
                {showMemberForm && (
                  <Modal onClose={()=>setShowMemberForm(false)}>
                    <MemberForm
                      member={newMember}
                      onChange={setNewMember}
                      onSubmit={e=>{e.preventDefault();addMember(newMember);setShowMemberForm(false);setNewMember({ firstname:"", lastname:"", email:"", password:"", role:"Member" });}}
                      onCancel={()=>setShowMemberForm(false)}
                    />
                  </Modal>
                )}
                {editMember && (
                  <Modal onClose={()=>setEditMember(null)}>
                    <MemberForm
                      member={editMember}
                      onChange={setEditMember}
                      onSubmit={e=>{e.preventDefault();updateMember(editMember);setEditMember(null);}}
                      onCancel={()=>setEditMember(null)}
                    />
                  </Modal>
                )}
                <div className="members-grid">
                  {members.map(m=><MemberCard key={m.email} member={m} onDelete={deleteMember} onEdit={setEditMember} onClick={()=>setSelMember(m)} />)}
                </div>
              </>
            ) : (
              <div className="amounts-section">
                <h3>Amounts for {selMember.firstname} {selMember.lastname}</h3>
                <div className="amounts-actions">
                  <button className="btn-secondary" onClick={()=>setSelMember(null)}>Back</button>
                  <button className="btn-primary" onClick={()=>{setAmountData({ amount:0, start_date:"", end_date:"", user_id:selMember.id });setShowAmountForm(true);}}>Add Amount</button>
                </div>
                {selMember.amounts?.length ? (
                  <table className="amounts-table">
                    <thead><tr><th>Amount</th><th>Start Date</th><th>End Date</th></tr></thead>
                    <tbody>{selMember.amounts.map((amt,i)=><tr key={amt.id||i}><td>₹{amt.amount}</td><td>{amt.start_date}</td><td>{amt.end_date}</td></tr>)}</tbody>
                  </table>
                ) : <p>No previous amounts found.</p>}
                {showAmountForm && (
                  <Modal onClose={()=>setShowAmountForm(false)}>
                    <AmountForm amountData={amountData} onChange={setAmountData} onSubmit={handleAddAmount} onCancel={()=>setShowAmountForm(false)} />
                  </Modal>
                )}
              </div>
            ))}

            {tab==="trainers" && (
              <>
                <button onClick={()=>setShowTrainerForm(true)}>Add Trainer</button>
                {showTrainerForm && (
                  <Modal onClose={()=>setShowTrainerForm(false)}>
                    <TrainerForm
                      trainer={newTrainer}
                      onChange={setNewTrainer}
                      onSubmit={e=>{e.preventDefault();addTrainer(newTrainer);setShowTrainerForm(false);setNewTrainer({ firstname:"", lastname:"", email:"", password:"", role:"Trainer" });}}
                      onCancel={()=>setShowTrainerForm(false)}
                    />
                  </Modal>
                )}
                {editTrainer && (
                  <Modal onClose={()=>setEditTrainer(null)}>
                    <TrainerForm
                      trainer={editTrainer}
                      onChange={setEditTrainer}
                      onSubmit={e=>{e.preventDefault();updateTrainer(editTrainer);setEditTrainer(null);}}
                      onCancel={()=>setEditTrainer(null)}
                    />
                  </Modal>
                )}
                <div className="trainers-grid">
                  {trainers.map(t=>(
                    <div key={t.email} className="trainer-card">
                      <div className="trainer-avatar"><span>{t.firstname[0]}{t.lastname[0]}</span></div>
                      <div className="trainer-info">
                        <h3>{t.firstname} {t.lastname}</h3>
                        <div><strong>Email:</strong> {t.email}</div>
                        <div><strong>Role:</strong> {t.role}</div>
                      </div>
                      <div className="trainer-actions">
                        <button className="btn btn-delete" onClick={()=>deleteTrainer(t.email)}>Delete</button>
                        <button className="btn btn-edit" onClick={()=>setEditTrainer(t)}>Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="right-container">
          <h2>Login User Info</h2>
          {loginUser ? (
            <div>
              <p><b>Username:</b> {loginUser.username || loginUser.email}</p>
              <p><b>Role:</b> {loginUser.role}</p>
              <p><b>ID:</b> {loginUser.id}</p>
            </div>
          ) : <p>No login user info found.</p>}

          <h2>Selected Member Info</h2>
          {selMember ? (
            <div>
              <p><b>Name:</b> {selMember.firstname} {selMember.lastname}</p>
              <p><b>Email:</b> {selMember.email}</p>
              <p><b>Role:</b> {selMember.role}</p>
            </div>
          ) : <p>No member selected.</p>}
        </div>
      </div>
      <footer className="bottom-container"><p>© 2026 MyGym | Admin Panel</p></footer>
    </div>
  );
}

export default AdminDashboard;
