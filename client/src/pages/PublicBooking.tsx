// src/pages/PublicBooking.tsx

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_APPOINTMENTS_BY_FILTER } from "../services/queries";
import "../components/publicbooking.css";

const PublicBooking = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const { data, loading, error } = useQuery(GET_APPOINTMENTS_BY_FILTER, {
    variables: { date: selectedDate },
    skip: !selectedDate,
  });

  const appointments = data?.appointmentsByFilter || [];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Appointment List</h1>

      <div className="mb-6 w-1/3">
        <label className="block text-sm font-medium text-gray-700">Select a Date:</label>
        <input
          type="date"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {loading && <p className="text-blue-600">Loading appointments...</p>}
      {error && <p className="text-red-500">Error loading appointments: {error.message}</p>}

      <div className="appointment-container">
        {appointments.length === 0 ? (
          selectedDate && (
            <p className="text-gray-500">There are no appointments for the selected date.</p>
          )
        ) : (
          appointments.map((appt: any) => (
            <div key={appt.id} className="appointment-card">
              <div className="appointment-header">
                <div className="client-icon">👤</div>
                <p className="text-lg font-semibold text-gray-800">
                  {appt.client?.name ?? "Sin nombre"}
                </p>
              </div>
              <p className="detail-text">
                <span className="detail-label">Reason:</span> {appt.reason}
              </p>
              <p className="detail-text">
                <span className="detail-label">Date:</span> {appt.date} {appt.time}
              </p>
              <p className="detail-text">
                <span className="detail-label">Status:</span> {appt.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicBooking;
