import React from "react";
import "./MemberForm.css";

export default function MemberForm({ member, onChange, onSubmit, onCancel }) {
  return (
    <form className="member-form" onSubmit={onSubmit}>
      <h2>{member.id ? "Edit Member" : "Add Member"}</h2>

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          value={member.firstname}
          onChange={(e) => onChange({ ...member, firstname: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          value={member.lastname}
          onChange={(e) => onChange({ ...member, lastname: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={member.email}
          onChange={(e) => onChange({ ...member, email: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={member.password}
          onChange={(e) => onChange({ ...member, password: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <input
          type="text"
          value={member.role}
          onChange={(e) => onChange({ ...member, role: e.target.value })}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
