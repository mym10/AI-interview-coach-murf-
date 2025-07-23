import React from 'react';

const RoleSelector = ({ role, setRole }) => {
  const roles = ['Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager'];

  return (
    <div style={{ margin: '1rem 0' }}>
      <label>Select Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">-- Choose a role --</option>
        {roles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
};

export default RoleSelector;
