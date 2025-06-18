export const typeDefs = `
    type User {
        _id: ID
        username: String
        clients: [Client]!
    }

    type Auth{
        token: ID!
        user: User
    }

    type Client {
        _id: ID!
        name: String!
        phoneNumber: String!
        assignedUserId: User!
        user: User
        createdAt: String
        updatedAt: String
    }

    type Appointment {
        _id: ID!
        date: String
        reason: String!
        status: String
        clientId: ID
        client: Client
    }

    input CreateUserInput {
        username: String!
        password: String!
    }

    input UserInput {
        username: String!
        password: String!
    }
    
    input ClientInput {
        name: String!
        phoneNumber: String!
        
    }

    input UpdateClientInput {
        name: String
        phoneNumber: String
        
    }

    input CreateAppointmentInput {
        date: String
        reason: String!
        status: String
        clientId: ID
    }
    
    input UpdateAppointmentInput {
        date: String
        reason: String
        status: String
        clientId: ID
    }

    type Query { 
        users: [User]!
        user(userId: ID!, username: String): User
        me: User
        clients: [Client]!
        client(clientId: ID!, name: String): Client
        appointments: [Appointment]!
        appointment(_id: ID!): Appointment
    }

    type Mutation{
        addUser(input: CreateUserInput!): Auth
        login(username: String!, password: String!): Auth
        addClient(input : ClientInput!): Client
        updateClient(_id: ID!, input: ClientInput!): Client
        removeClient(_id: ID!): Client
        addAppointment(input: CreateAppointmentInput!): Appointment
        updateAppointment(_id: ID!, input: UpdateAppointmentInput!): Appointment
        removeAppointment(_id: ID!): Appointment
    }
`