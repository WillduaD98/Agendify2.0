// IMPORTS
import Appointment from '../models/appointment.model.js';
import Client from '../models/client.model.js';
import User, { UserAttributes } from '../models/user.model.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// (Resto del código sigue igual sin cambios)
export interface AddUser {
  input: {
    username: string;
    password: string;
  };
}
// ... (el resto de tus interfaces y resolvers va igual que antes con el try/catch)

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
      try {
        return await User.find();
      } catch (error) {
        throw new Error('Failed to retrieve users.');
      }
    },
    user: async (_: any, args: GetUserArgs, context: Context) => {
      try {
        const query: any = { $or: [] };
        if (args.userId) query.$or.push({ _id: args.userId });
        if (args.username) query.$or.push({ username: args.username });
        if (context.user) query.$or.push({ _id: context.user._id });
        if (query.$or.length === 0) throw new Error('No criteria provided to find user.');
        return await User.findOne(query);
      } catch (error) {
        throw new Error('Error retrieving user.');
      }
    },
    me: async (_: any, __: any, context: Context) => {
      try {
        if (!context.user) throw AuthenticationError;
        return await User.findById(context.user._id);
      } catch (error) {
        throw error;
      }
    },
    clients: async (_: any, __: any, context: Context) => {
      try {
        if (!context.user) throw AuthenticationError;
        return await Client.find({ assignedUserId: context.user._id }).populate('assignedUserId');
      } catch (error) {
        throw new Error('Failed to retrieve clients.');
      }
    },
    client: async (_: any, args: GetClientArgs, context: Context) => {
      try {
        if (!context.user) throw AuthenticationError;
        const filters: any = { assignedUserId: context.user._id };
        if (args.clientId) filters._id = args.clientId;
        if (args.name) filters.name = args.name;
        return await Client.findOne(filters).populate('assignedUserId');
      } catch (error) {
        throw new Error('Failed to retrieve client.');
      }
    },
    appointments: async (_: any, args: { date?: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Unauthorized');
    
      const filter: any = {
        // Esto permite filtrar por usuario
        // usando populate para acceder al assignedUserId del cliente
      };
    
      if (args.date) {
        const start = new Date(args.date);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        filter.date = { $gte: start, $lte: end };
      }
    
      const appointments = await Appointment.find(filter)
        .populate({
          path: 'clientId',
          match: { assignedUserId: context.user._id }
        });
    
      // Mapeamos para que el campo sea "client"
      return appointments.map(a => ({
        ...a.toObject(),
        client: a.clientId
      }));
    },
    appointment: async (_: any, args: { appointmentId: string }, context: Context) => {
      try {
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
      } catch (error) {
        throw new Error('Failed to retrieve appointment.');
      }
    }
  },

  Mutation: {
    addUser: async (_: any, { input }: AddUser) => {
      try {
        const user = await User.create({ ...input });
        const token = signToken(user.username, user._id);
        return { token, user };
      } catch (error) {
        throw new Error('Error creating user.');
      }
    },
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      console.log('🔍 Login resolver called'); // <- Asegúrate de que esto se imprima en la terminal
      try {
        console.log('🧪 Login attempt for:', username); // <- Esto debería verse en terminal
    
        const user = await User.findOne({ username });
    
        if (!user) {
          throw new AuthenticationError('No user found with that username');
        }
    
        const correctPw = await user.isCorrectPassword(password);
    
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
    
        const token = signToken(user.username, user._id);
    console.log ('✅ Login successful, token generated:', token); 

        return { token, user };
      } catch (error) {
        console.error('❌ Error in login resolver:', error); // <- Asegúrate de tener esto
        throw error;
      }
    },
    addClient: async (_: any, { input }: { input: AddClient['input'] }, context: Context) => {
      try {
        if (!context.user) throw AuthenticationError;
        const newClient = await Client.create({ ...input, assignedUserId: context.user._id });
        return await Client.findById(newClient._id).populate('assignedUserId');
      } catch (error) {
        throw new Error('Error creating client.');
      }
    },
    updateClient: async (_: any, { _id, input }: UpdateClient, context: Context) => {
      try {
        if (!context.user) throw AuthenticationError;
        const client = await Client.findByIdAndUpdate(_id, { $set: input }, { new: true }).populate('assignedUserId');
        if (!client) throw new Error('Client not found.');
        return client;
      } catch (error) {
        throw new Error('Error updating client.');
      }
    },
    removeClient: async (_: any, { _id }: RemoveClient, context: Context) => {
      try {
        if (!context.user) throw AuthenticationError;
        const client = await Client.findByIdAndDelete({ _id, assignedUserId: context.user._id }).populate('assignedUserId');
        if (!client) throw new Error('Client not found.');
        return client;
      } catch (error) {
        throw new Error('Error removing client.');
      }
    },
    addAppointment: async (_: any, { input }: AddAppointment, context: Context) => {
      if (!context.user) throw new AuthenticationError('Unauthorized');
    
      const client = await Client.findOne({
        _id: input.clientId,
        assignedUserId: context.user._id,
      });
    
      if (!client) {
        throw new Error('Client not found or not authorized');
      }
    
      const parsedInput = {
        ...input,
        date: isNaN(Date.parse(input.date)) ? new Date(parseInt(input.date)) : new Date(input.date),
      };
    
      const newAppointment = await Appointment.create(parsedInput);
      await newAppointment.populate('clientId');
      console.log('🧪 Fecha guardada:', newAppointment.date);

      return {
        ...newAppointment.toObject(),
        client: newAppointment.clientId,
      };
    },
    
    updateAppointment: async (_: any, { _id, input }: UpdateAppointment, context: Context) => {
      try {
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
      } catch (error) {
        throw new Error('Error updating appointment.');
      }
    },
    removeAppointment: async (_: any, { _id }: RemoveAppointment, context: Context) => {
      try {
        if (!context.user) throw AuthenticationError;
        const appointment = await Appointment.findOneAndDelete({ _id }).populate('clientId');
        if (!appointment) throw new Error('Appointment not found.');
        return appointment;
      } catch (error) {
        throw new Error('Error removing appointment.');
      }
    }
  }
};
