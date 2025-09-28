// components/Patient/DoctorList.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Doctor } from '../../types/database'; // Make sure you have this interface

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('is_available', true)
          .order('name');

        if (error) throw error;
        setDoctors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
      <h2 style={{ color: '#007bff', marginBottom: '10px' }}>Available Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors available.</p>
      ) : (
        <ul>
          {doctors.map((doc) => (
            <li key={doc.id} style={{ marginBottom: '8px' }}>
              <strong>{doc.name}</strong> - {doc.specialization} ({doc.years_experience ?? 0} yrs)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
