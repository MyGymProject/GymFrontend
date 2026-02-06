import React, { useState } from "react";
import useMembers from "../hooks/useMembers";
import useTrainers from "../hooks/useTrainers";
import useAmounts from "../hooks/useAmounts";

import MemberCard from "./MembersCard";
import MemberForm from "./MemberForm";
import TrainerForm from "./TrainerForm";
import AmountForm from "./AmountForm";
import Header from "./Header";
import Modal from "./Model";   // import modal
import "./AdminDashBoard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMember, setSelectedMember] = useState(null);

  const { trainers, addTrainer, deleteTrainer, updateTrainer } = useTrainers();
  const { addAmount } = useAmounts();
  const { members, addMember, deleteMember, updateMember } = useMembers();

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({ firstname:"", lastname:"", email:"", password:"", role:"Member" });

  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ firstname:"", lastname:"", email:"", password:"", role:"Trainer" });

  const [showAmountForm, setShowAmountForm] = useState(false);
  const [amountData, setAmountData] = useState({ amount:0, start_date:"", end_date:"", user_id:0 });

  const handleAddAmount = async (e) => {
    e.preventDefault();
    const newAmt = await addAmount(amountData);
    setShowAmountForm(false);
    setAmountData({ amount:0, start_date:"", end_date:"", user_id:0 });
    if (newAmt && selectedMember) {
      const withId = { ...newAmt, id: Date.now() };
      setSelectedMember({
        ...selectedMember,
        amounts:[...(selectedMember.amounts||[]), withId],
      });
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <Header />

      <div className="tab-buttons">
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("members")}>Members</button>
        <button onClick={() => setActiveTab("trainers")}>Trainers</button>
      </div>

      <div className="tab-content">
        {activeTab==="dashboard" && (
          <>
            <h2>Overview</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card"><h3>Total Members</h3><p>{members.length}</p></div>
              <div className="dashboard-card"><h3>Total Trainers</h3><p>{trainers.length}</p></div>
              <div className="dashboard-card"><h3>Total Amount</h3>
                <p>{members.reduce((sum,m)=>sum+(m.amounts?.reduce((a,x)=>a+x.amount,0)||0),0)}</p>
              </div>
            </div>
          </>
        )}

        {activeTab==="members" && (
          <>
            <h2>Members</h2>
            {!selectedMember ? (
              <>
                <button onClick={()=>setShowMemberForm(true)}>Add Member</button>

                {showMemberForm && (
                  <Modal onClose={()=>setShowMemberForm(false)}>
                    <MemberForm
                      member={newMember}
                      onChange={setNewMember}
                      onSubmit={e=>{
                        e.preventDefault();
                        addMember(newMember);
                        setShowMemberForm(false);
                        setNewMember({ firstname:"", lastname:"", email:"", password:"", role:"Member" });
                      }}
                      onCancel={()=>setShowMemberForm(false)}
                    />
                  </Modal>
                )}

                {editingMember && (
                  <Modal onClose={()=>setEditingMember(null)}>
                    <MemberForm
                      member={editingMember}
                      onChange={setEditingMember}
                      onSubmit={e=>{
                        e.preventDefault();
                        updateMember(editingMember);
                        setEditingMember(null);
                      }}
                      onCancel={()=>setEditingMember(null)}
                    />
                  </Modal>
                )}

                <div className="members-grid">
                  {members.map(m=>(
                    <MemberCard
                      key={m.email}
                      member={m}
                      onDelete={deleteMember}
                      onEdit={setEditingMember}
                      onClick={()=>setSelectedMember(m)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="amounts-section">
                <h3>Amounts for {selectedMember.firstname} {selectedMember.lastname}</h3>

                <div className="amounts-actions">
                  <button
                    className="btn-secondary"
                    onClick={()=>setSelectedMember(null)}
                  >
                    Back to Members
                  </button>
                  <button
                    className="btn-primary"
                    onClick={()=>{
                      setAmountData({ amount:0, start_date:"", end_date:"", user_id:selectedMember.id });
                      setShowAmountForm(true);
                    }}
                  >
                    Add Amount
                  </button>
                </div>

                {selectedMember.amounts?.length ? (
                  <div className="amounts-grid">
                    {selectedMember.amounts.map((amt,idx)=>(
                      <div key={amt.id||idx} className="amount-card">
                        <div className="amount-header">₹{amt.amount}</div>
                        <div className="amount-dates"><span className="date-label">Start:</span><span className="date-value">{amt.start_date}</span></div>
                        <div className="amount-dates"><span className="date-label">End:</span><span className="date-value">{amt.end_date}</span></div>
                      </div>
                    ))}
                  </div>
                ) : <p>No previous amounts found.</p>}

                {showAmountForm && (
                  <Modal onClose={()=>setShowAmountForm(false)}>
                    <AmountForm
                      amountData={amountData}
                      onChange={setAmountData}
                      onSubmit={handleAddAmount}
                      onCancel={()=>setShowAmountForm(false)}
                    />
                  </Modal>
                )}
              </div>
            )}
          </>
        )}

        {activeTab==="trainers" && (
          <>
            <h2>Trainers</h2>
            <button onClick={()=>setShowTrainerForm(true)}>Add Trainer</button>
            {showTrainerForm && (
              <Modal onClose={()=>setShowTrainerForm(false)}>
                <TrainerForm
                  trainer={newTrainer}
                  onChange={setNewTrainer}
                  onSubmit={e=>{
                    e.preventDefault();
                    addTrainer(newTrainer);
                    setShowTrainerForm(false);
                    setNewTrainer({ firstname:"", lastname:"", email:"", password:"", role:"Trainer" });
                  }}
                  onCancel={()=>setShowTrainerForm(false)}
                />
              </Modal>
            )}
            <div className="trainers-grid">
              {trainers.map(t=>(
                <div key={t.email} className="trainer-card">
                  <div className="trainer-avatar"><span>{t.firstname[0]}{t.lastname[0]}</span></div>
                  <div className="trainer-info">
                    <h3>{t.firstname} {t.lastname}</h3>
                    <div className="trainer-field"><span className="trainer-label">Email:</span><span className="trainer-value">{t.email}</span></div>
                    <div className="trainer-field"><span className="trainer-label">Role:</span><span className="trainer-value">{t.role}</span></div>
                  </div>
                  <div className="trainer-actions">
                    <button className="btn btn-delete" onClick={()=>deleteTrainer(t.email)}>Delete</button>
                    <button className="btn btn-edit" onClick={()=>updateTrainer(t)}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
