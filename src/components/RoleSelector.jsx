import React from 'react';

const RoleSelector = ({ role, setRole }) => {
  const roles = ['Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager'];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#f4f4f5]">
        Select Role
      </label>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full bg-[#1c1e26] border border-[#2e2e32] text-[#f4f4f5] text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-200">
        <option value=""> Choose a role </option>
        {roles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
};

export default RoleSelector;
