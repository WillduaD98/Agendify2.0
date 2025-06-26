import { gql } from "@apollo/client";

export const GET_APPOINTMENTS_BY_FILTER = gql`
  query AppointmentsByFilter($date: String) {
    appointmentsByFilter(date: $date) {
      _id
      date
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
