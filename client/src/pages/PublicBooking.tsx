// src/pages/PublicBooking.tsx

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_APPOINTMENTS_BY_DATE } from "../services/queries.js";

const PublicBooking = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const { data, loading, error } = useQuery(GET_APPOINTMENTS_BY_DATE, {
    variables: { date: selectedDate, time: "", clientName: "" },
    skip: !selectedDate, // Solo ejecuta la query si hay fecha seleccionada
  });

  const appointments = data?.appointmentsByFilter || [];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Appointment History</h1>

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
      {error && <p className="text-red-500">Error loading quotes.</p>}

      <div className="space-y-4">
        {appointments.length === 0 ? (
          selectedDate && <p className="text-gray-500">There are no appointments for the selected date.</p>
        ) : (
          appointments.map((appt: any) => (
            <div
              key={appt.id}
              className="flex items-center justify-between border border-gray-300 rounded p-4 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{appt.client?.name ?? "Sin nombre"}</p>
                  <p className="text-sm text-gray-600">Motivo: {appt.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-700 text-sm">{appt.date} {appt.time}</p>
                <p className="text-sm text-green-600 font-medium">{appt.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicBooking;