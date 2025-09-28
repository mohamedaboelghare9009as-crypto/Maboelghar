import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Appointment } from '../../types/database';

interface Props {
  patientId: string; // ID of the logged-in patient
}

export default function AppointmentList({ patientId }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            doctor:doctors(*)
          `)
          .eq('patient_id', patientId)
          .order('appointment_date', { ascending: true });

        if (error) throw error;
        setAppointments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [patientId]);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (appointments.length === 0) return <p>No appointments found.</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ color: '#007bff', marginBottom: '15px' }}>My Appointments</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id} style={{ marginBottom: '12px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <strong>Date:</strong> {appt.appointment_date} <br />
            <strong>Time:</strong> {appt.appointment_time} <br />
            <strong>Status:</strong> {appt.status} <br />
            <strong>Doctor:</strong> {appt.doctor?.name} ({appt.doctor?.specialization}) <br />
            {appt.reason && <><strong>Reason:</strong> {appt.reason}<br /></>}
            {appt.notes && <><strong>Notes:</strong> {appt.notes}</>}
          </li>
        ))}
      </ul>
    </div>
  );
}