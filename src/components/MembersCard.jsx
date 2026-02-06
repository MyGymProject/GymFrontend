import React from "react";
import "./MembersCard.css";

export default function MemberCard({ member, onDelete, onEdit, onClick }) {
  return (
    <div className="member-card" onClick={() => onClick(member)}>
      <div className="member-info">
        <h3 className="member-name">
          {member.firstname} {member.lastname}
        </h3>

        <div className="member-field">
          <span className="member-label">Email:</span>
          <span className="member-value">{member.email}</span>
        </div>

        <div className="member-field">
          <span className="member-label">Role:</span>
          <span className="member-value">{member.role}</span>
        </div>
      </div>

      <div className="member-actions">
        <button
          className="btn btn-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(member.email);
          }}
        >
          Delete
        </button>
        <button
          className="btn btn-edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(member);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
