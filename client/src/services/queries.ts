import { gql } from "@apollo/client";

export const GET_APPOINTMENTS_BY_FILTER = gql`
  query AppointmentsByFilter($date: String, $time: String, $clientName: String) {
    appointmentsByFilter(date: $date, time: $time, clientName: $clientName) {
      id
      date
      time
      reason
      status
      client {
        name
        phoneNumber
      }
    }
  }
`;

export const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
    }
  }
`;
