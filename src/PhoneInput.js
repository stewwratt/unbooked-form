import React from 'react';

const countries = [
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  // Add more as needed
];

function PhoneInput({ value, onChange, onKeyDown, onBlur, error }) {
  const handleCountryChange = (e) => {
    onChange({ ...value, countryCode: e.target.value });
  };

  const handleNumberChange = (e) => {
    onChange({ ...value, phoneNumber: e.target.value });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <select
        value={value.countryCode}
        onChange={handleCountryChange}
        style={{
          fontSize: '1.1rem',
          border: 'none',
          borderBottom: '2px solid #aaa',
          borderRadius: '0',
          background: 'transparent',
          appearance: 'none',
          outline: 'none',
          cursor: 'pointer',
          padding: '18px 8px',
          minWidth: '80px'
        }}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={value.phoneNumber}
        onChange={handleNumberChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder="0412 345 678"
        style={{
          fontSize: '1.1rem',
          border: 'none',
          borderBottom: error ? '2px solid red' : '2px solid #aaa',
          borderRadius: '0',
          outline: 'none',
          background: 'transparent',
          flex: '1',
          padding: '18px 10px'
        }}
      />
    </div>
  );
}

export default PhoneInput;
