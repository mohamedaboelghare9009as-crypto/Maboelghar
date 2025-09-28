import React from 'react';

export default function AppointmentBooking() {
  console.log('AppointmentBooking component is rendering!');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', border: '2px solid #007bff', borderRadius: '8px' }}>
      <h1 style={{ color: '#007bff', fontSize: '24px', marginBottom: '10px' }}>
        🔵 COMPONENT IS WORKING!
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '10px' }}>
        ✅ Component rendered successfully at {new Date().toLocaleTimeString()}
      </p>
      <p style={{ fontSize: '14px', color: '#666' }}>
        If you can see this, the component is loading properly.
      </p>
      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <strong>Next steps:</strong> We can now add back the Supabase functionality step by step.
      </div>
    </div>
  );
}