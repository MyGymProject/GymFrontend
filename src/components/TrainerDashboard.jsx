import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMembers from "../hooks/useMembers";
import useAmounts from "../hooks/useAmounts";

import MemberCard from "./MembersCard";
import MemberForm from "./MemberForm";
import AmountForm from "./AmountForm";
import Header from "./Header";
import Modal from "./Model";
import "./AdminDashBoard.css";

function TrainerDashboard() {
  const [selectedMember, setSelectedMember] = useState(null);

  const { members, addMember, deleteMember, updateMember } = useMembers();
  const { addAmount } = useAmounts();

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "Member",
  });

  const [showAmountForm, setShowAmountForm] = useState(false);
  const [amountData, setAmountData] = useState({
    amount: 0,
    start_date: "",
    end_date: "",
    user_id: 0,
  });

  const navigate = useNavigate();

  const handleAddAmount = async (e) => {
    e.preventDefault();
    const newAmt = await addAmount(amountData);
    setShowAmountForm(false);
    setAmountData({ amount: 0, start_date: "", end_date: "", user_id: 0 });
    if (newAmt && selectedMember) {
      const withId = { ...newAmt, id: Date.now() };
      setSelectedMember({
        ...selectedMember,
        amounts: [...(selectedMember.amounts || []), withId],
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <h1>Trainer Dashboard</h1>
      {/* Header already contains logout */}
      <Header onLogout={handleLogout} />

      <div className="tab-buttons">
        <button onClick={() => setSelectedMember(null)}>Members</button>
      </div>

      <div className="tab-content">
        {!selectedMember ? (
          <>
            <h2>Members</h2>
            <button onClick={() => setShowMemberForm(true)}>Add Member</button>

            {showMemberForm && (
              <Modal onClose={() => setShowMemberForm(false)}>
                <MemberForm
                  member={newMember}
                  onChange={setNewMember}
                  onSubmit={(e) => {
                    e.preventDefault();
                    addMember(newMember);
                    setShowMemberForm(false);
                    setNewMember({
                      firstname: "",
                      lastname: "",
                      email: "",
                      password: "",
                      role: "Member",
                    });
                  }}
                  onCancel={() => setShowMemberForm(false)}
                />
              </Modal>
            )}

            {editingMember && (
              <Modal onClose={() => setEditingMember(null)}>
                <MemberForm
                  member={editingMember}
                  onChange={setEditingMember}
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMember(editingMember);
                    setEditingMember(null);
                  }}
                  onCancel={() => setEditingMember(null)}
                />
              </Modal>
            )}

            <div className="members-grid">
              {members.map((m) => (
                <MemberCard
                  key={m.email}
                  member={m}
                  onDelete={deleteMember}
                  onEdit={setEditingMember}
                  onClick={() => setSelectedMember(m)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="amounts-section">
            <h3>
              Amounts for {selectedMember.firstname} {selectedMember.lastname}
            </h3>

            <div className="amounts-actions">
              <button
                className="btn-secondary"
                onClick={() => setSelectedMember(null)}
              >
                Back to Members
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setAmountData({
                    amount: 0,
                    start_date: "",
                    end_date: "",
                    user_id: selectedMember.id,
                  });
                  setShowAmountForm(true);
                }}
              >
                Add Amount
              </button>
            </div>

            {selectedMember.amounts?.length ? (
              <div className="amounts-grid">
                {selectedMember.amounts.map((amt, idx) => (
                  <div key={amt.id || idx} className="amount-card">
                    <div className="amount-header">₹{amt.amount}</div>
                    <div className="amount-dates">
                      <span className="date-label">Start:</span>
                      <span className="date-value">{amt.start_date}</span>
                    </div>
                    <div className="amount-dates">
                      <span className="date-label">End:</span>
                      <span className="date-value">{amt.end_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No previous amounts found.</p>
            )}

            {showAmountForm && (
              <Modal onClose={() => setShowAmountForm(false)}>
                <AmountForm
                  amountData={amountData}
                  onChange={setAmountData}
                  onSubmit={handleAddAmount}
                  onCancel={() => setShowAmountForm(false)}
                />
              </Modal>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainerDashboard;
