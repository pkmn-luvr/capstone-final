// src/components/Forms.js
import React from 'react';
import './styles/Forms.css';


const FormInput = ({ label, type, name, value, onChange, required, disabled }) => (
  <div>
    <label>{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange} 
      required={required} 
      disabled={disabled} 
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, required }) => (
  <div>
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange} required={required}>
      <option value="" disabled>Select {label}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const FormButton = ({ label, type, disabled }) => (
  <button type={type} disabled={disabled}>{label}</button>
);

export { FormInput, FormSelect, FormButton };
