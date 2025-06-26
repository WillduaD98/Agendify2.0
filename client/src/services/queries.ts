import { gql } from "@apollo/client";

export const GET_APPOINTMENTS_BY_DATE = gql`
  query appointments($date: String) {
    appointments(date: $date) {
      _id
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
