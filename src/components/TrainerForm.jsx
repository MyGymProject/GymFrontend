import React from 'react';
import './TrainerForm.css';  // import CSS file

function TrainerForm({ trainer, onChange, onSubmit, onCancel }) {
  return (
    <form className="trainer-form" onSubmit={onSubmit}>
      <h2>Add Trainer</h2>

      <label>
        First Name
        <input
          type="text"
          value={trainer.firstname}
          onChange={(e) => onChange({ ...trainer, firstname: e.target.value })}
          required
        />
      </label>

      <label>
        Last Name
        <input
          type="text"
          value={trainer.lastname}
          onChange={(e) => onChange({ ...trainer, lastname: e.target.value })}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={trainer.email}
          onChange={(e) => onChange({ ...trainer, email: e.target.value })}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={trainer.password}
          onChange={(e) => onChange({ ...trainer, password: e.target.value })}
          required
        />
      </label>

      <input type="hidden" value="Trainer" />

      <div className="form-actions">
        <button type="submit" className="btn-primary">Save Trainer</button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TrainerForm;
