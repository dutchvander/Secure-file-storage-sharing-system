// src/components/Field.jsx
import React from "react";

export function Field({ label, icon: IconComponent, type="text", placeholder, value, onChange, error, showToggle, visible, onToggle }) {
  return (
    <div className="field">
      <label>
        <span className="field-label">{label}</span>
        <div className="input-wrapper">
          {IconComponent && <IconComponent />}
          <input
            type={showToggle ? (visible ? "text" : "password") : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          {showToggle && <button type="button" onClick={onToggle}>{visible ? "Hide" : "Show"}</button>}
        </div>
      </label>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}