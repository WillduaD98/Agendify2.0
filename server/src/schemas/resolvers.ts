// IMPORTS
import Appointment from '../models/appointment.model.js';
import Client from '../models/client.model.js';
import User, { UserAttributes } from '../models/user.model.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// INTERFACES
export interface AddUser {
  input: {
    username: string;
    password: string;
  };
}

export interface GetUserArgs {
  userId?: string;
  username?: string;
}
export interface AddClient {
  input: {
    name: string;
    phoneNumber: string;
  };
}
export interface UpdateClient {
  _id: string;
  input: {
    name?: string;
    phoneNumber?: string;
  };
}
export interface GetClientArgs {
  clientId?: string;
  name?: string;
}
export interface RemoveClient {
  _id: string;
}
export interface AddAppointment {
  input: {
    date: string;
    reason: string;
    status: string;
    clientId: string;
  };
}
export interface UpdateAppointment {
  _id: string;
  input: {
    date?: string;
    reason?: string;
    status?: string;
    clientId: string;
  };
}
export interface RemoveAppointment {
  _id: string;
}
export interface Context {
  user?: UserAttributes;
}

// RESOLVERS
export const resolvers = {
  Query: {
    users: async (): Promise<UserAttributes[]> => {
      return await User.find();
    },
    user: async (_: any, args: GetUserArgs, context: Context) => {
      const query: any = { $or: [] };
      if (args.userId) query.$or.push({ _id: args.userId });
      if (args.username) query.$or.push({ username: args.username });
      if (context.user) query.$or.push({ _id: context.user._id });
      if (query.$or.length === 0) throw new Error('No criteria provided to find user.');
      return await User.findOne(query);
    },
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) throw AuthenticationError;
      return await User.findById(context.user._id);
    },
    clients: async (_: any, __: any, context: Context) => {
      if (!context.user) throw AuthenticationError;
      return await Client.find({ assignedUserId: context.user._id }).populate('assignedUserId');
    },
    client: async (_: any, args: GetClientArgs, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const filters: any = { assignedUserId: context.user._id };
      if (args.clientId) filters._id = args.clientId;
      if (args.name) filters.name = args.name;
      return await Client.findOne(filters).populate('assignedUserId');
    },
    appointments: async (_: any, __: any, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const clients = await Client.find({ assignedUserId: context.user._id });
      const clientIds = clients.map(c => c._id);
      return await Appointment.find({ clientId: { $in: clientIds } }).populate('client');
    },
    appointment: async (_: any, args: { appointmentId: string }, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const appointment = await Appointment.findById(args.appointmentId).populate({
        path: 'clientId',
        populate: { path: 'assignedUserId' }
      });
      if (
        appointment &&
        appointment.clientId &&
        (appointment.clientId as any).assignedUserId.toString() === context.user._id.toString()
      ) {
        return appointment;
      }
      return null;
    },

    // ✅ Resolver público por filtros
    appointmentsByFilter: async (
      _: any,
      args: { date?: string; time?: string; clientName?: string }
    ) => {
      try {
        const filters: any = {};
        if (args.date) filters.date = args.date;

        if (args.clientName) {
          const clientMatches = await Client.find({
            name: { $regex: args.clientName, $options: 'i' }
          });

          const clientIds = clientMatches.map(c => c._id);
          filters.clientId = { $in: clientIds };
        }

        return await Appointment.find(filters).populate({ path: 'clientId', model: 'Client' }).then(appointments =>
  appointments.map(appt => ({
    ...appt.toObject(),
    client: appt.clientId // re-map clientId → client
  }))
);
      } catch (error) {
        console.error('Error in appointmentsByFilter:', error);
        throw new Error('Failed to fetch filtered appointments.');
      }
    }
  },

  Mutation: {
    addUser: async (_: any, { input }: AddUser) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user._id);
      return { token, user };
    },
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      const user = await User.findOne({ username });
      if (!user) throw new AuthenticationError('No user found with that username');
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError('Incorrect credentials');
      const token = signToken(user.username, user._id);
      return { token, user };
    },
    addClient: async (_: any, { input }: { input: AddClient['input'] }, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const newClient = await Client.create({ ...input, assignedUserId: context.user._id });
      return await Client.findById(newClient._id).populate('assignedUserId');
    },
    updateClient: async (_: any, { _id, input }: UpdateClient, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const client = await Client.findByIdAndUpdate(_id, { $set: input }, { new: true }).populate('assignedUserId');
      if (!client) throw new Error('Client not found.');
      return client;
    },
    removeClient: async (_: any, { _id }: RemoveClient, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const client = await Client.findByIdAndDelete({ _id, assignedUserId: context.user._id }).populate('assignedUserId');
      if (!client) throw new Error('Client not found.');
      return client;
    },
    addAppointment: async (_: any, { input }: AddAppointment, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const client = await Client.findOne({ _id: input.clientId, assignedUserId: context.user._id });
      if (!client) throw new Error('Client not found or not authorized.');
      const newAppointment = await Appointment.create(input);
      const clientData = await Client.findById(input.clientId).populate('assignedUserId');
      const userData = await User.findById(context.user._id);
      return { ...newAppointment.toObject(), client: clientData, user: userData };
    },
    updateAppointment: async (_: any, { _id, input }: UpdateAppointment, context: Context) => {
      if (!context.user) throw AuthenticationError;
      if (input.clientId) {
        const client = await Client.findOne({ _id: input.clientId, assignedUserId: context.user._id });
        if (!client) throw new Error('Client not found or not authorized.');
      }
      const appointment = await Appointment.findOneAndUpdate({ _id }, { $set: input }, { new: true }).populate('clientId');
      if (!appointment) throw new Error('Appointment not found.');
      const clientId = input.clientId || appointment.clientId;
      const clientData = await Client.findById(clientId).populate('assignedUserId');
      return { ...appointment.toObject(), client: clientData };
    },
    removeAppointment: async (_: any, { _id }: RemoveAppointment, context: Context) => {
      if (!context.user) throw AuthenticationError;
      const appointment = await Appointment.findOneAndDelete({ _id }).populate('clientId');
      if (!appointment) throw new Error('Appointment not found.');
      return appointment;
    }
  }
};
