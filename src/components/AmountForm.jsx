import React from "react";
import "./AmountForm.css";

export default function AmountForm({ amountData, onChange, onSubmit, onCancel }) {
  return (
    <form
  className="amount-form"
  onSubmit={(e) => {
    e.preventDefault();
    onSubmit(e);
  }}
>

      <h2>{amountData.id ? "Edit Amount" : "Add Amount"}</h2>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          value={amountData.amount}
          onChange={(e) => onChange({ ...amountData, amount: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Start Date</label>
        <input
          type="date"
          value={amountData.start_date}
          onChange={(e) => onChange({ ...amountData, start_date: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>End Date</label>
        <input
          type="date"
          value={amountData.end_date}
          onChange={(e) => onChange({ ...amountData, end_date: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>User ID</label>
        <input
          type="number"
          value={amountData.user_id}
          onChange={(e) => onChange({ ...amountData, user_id: e.target.value })}
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
