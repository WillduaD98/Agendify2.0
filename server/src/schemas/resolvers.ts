import Appointment, { AppointmentAttributes } from '../models/appointment.model.js';
import Client, { ClientAttributes } from '../models/client.model.js';
import User, { UserAttributes } from '../models/user.model.js';
import { signToken, AuthenticationError} from '../services/auth.js'


//****** User *********//
export interface AddUser {
    input: {
        username: string;
        password: string
    }
}
export interface GetUserArgs {
    userId?: string;
    username?: string;
}
//****** Client *********//
export interface AddClient {
    input: {
        name: string;
        phoneNumber: string;
    }
}
export interface UpdateClient {
    _id: string;
    input: {
        name?: string,
        phoneNumber?: string
    }
}
export interface GetClientArgs {
    clientId?: string;
    name?: string;
}
export interface RemoveClient { 
    _id: string
}
//****** Appointment *********//
export interface AddAppointment{
    input: {
        date: string;
        reason: string;
        status: string;
        clientId: string
    }
}
export interface UpdateAppointment { 
    _id: string;
    input: {
        date?: string;
        reason?: string;
        status?: string;
        clientId: string
    }
}
export interface RemoveAppointment {
    _id: string
}
//***** Context  ******/
export interface Context {
    user?: UserAttributes
}
//resolvers querys
export const resolvers = {
    Query: {
    /** USER Querys **/
        //Get Users 
        users: async(): Promise<UserAttributes[]> => {
            return await User.find()
        },
        //Get Specific User
        user: async (
            _parent: any, 
            args: GetUserArgs, 
            context: Context
            ): Promise<UserAttributes | null > => {
            const query: any = {
                $or: [] 
            };
            if (args.userId) query.$or.push({_id: args.userId})
            if (args.username) query.$or.push({ username: args.username})
            if (context.user) query.$or.push({_id: context.user._id})
            if(query.$or.length ===0) {
                throw new Error(`No user found with the provided criteria.`)
            }

            return await User.findOne(query)
        },
        //me info query
        me: async (
            _parent: any,
            _args: any,
            context: Context
        ): Promise<UserAttributes | null > => {
            if (context.user) {
                return await User.findOne({_id: context.user._id})
            }
            throw AuthenticationError;
        },
    //** CLIENT Querys **/
        clients: async(
            _parent: any,
            _args: any,
            context: Context
        ): Promise<ClientAttributes[]> => {
            if(!context.user) {
                throw AuthenticationError;
            }
            return await Client.find( {assignedUserId: context.user._id}).populate('assignedUserId')
        },
        client: async (
            _parent: any,
            args: GetClientArgs,
            context: Context
        ): Promise<ClientAttributes | null > => {
            if (!context.user) {
                throw AuthenticationError;
            }
            const filters: any = {
                assignedUserId: context.user._id
            }
            
            if (args.clientId) filters._id = args.clientId;
            if (args.name) filters.name = args.name;
            

            return await Client.findOne(filters).populate('assignedUserId')
        },
    //** APPOINTMENT Querys **/
        appointments: async (
            _parent: any,
            _args: any,
            context: Context
        ): Promise<AppointmentAttributes[]> => {
            if (!context.user) {
                throw AuthenticationError;
            }
            const clients = await Client.find({ assignedUseRId: context.user._id});
            const clientIds = clients.map(client => client._id);

            return await Appointment.find({ clientId: { $in: clientIds}}).populate('client');
        },
        appointment: async (
            _parent: any,
            args: { appointmentId: string },
            context: Context
        ): Promise<AppointmentAttributes | null> => {
            if (!context.user) {
                throw AuthenticationError;
            }
            const appointment = await Appointment.findById(args.appointmentId)
            .populate({
              path: 'clientId',
              populate: {
                path: 'assignedUserId'
              }
            });
            if (
                appointment &&
                appointment.clientId &&
                (appointment.clientId as any).assignedUserId.toString() === context.user._id.toString()
              ) {
                return appointment;
              }
            return null
        },
    },
    Mutation: {
        //** User Mutations **/
        addUser: async (_parent : any, { input }: AddUser): Promise< { token: string; user: UserAttributes}> => {
            try {
                console.log(`Input recived from backend: `, input)
                const user = await User.create({...input});
                const token = signToken(user.username, user._id);
                console.log(`ADDUSER resolver: User created with:`, input);

                return { token, user };
            } catch (error) {
                console.error(`Error in addUser resolver: `, error);
                throw new Error(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
        //** Login Mutations **/
        login: async (_parent: any, {username, password}: { username: string; password: string}): Promise<{ token: string; user: UserAttributes}> => {
            const user = await User.findOne({ username }); 
            if(!user || !await user.isCorrectPassword(password)) {
                throw AuthenticationError;
            }
            const token = signToken(user.username, user._id);
            return {token, user};
        },
        //** Client Mutations **/
        addClient: async(
            _parent: any,
            { input }: { input: AddClient['input']},
            context: Context
        ) => {
            if (!context.user)  throw new AuthenticationError('Unauthorized: No user found in context');
            console.log('📥 Body received in AddClient resolver:', input);

            const newClient = await Client.create({...input, assignedUserId: context.user._id})
            return Client.findById(newClient._id).populate('assignedUserId');
        },
        updateClient: async(
            _parent: any,
            {_id, input}: UpdateClient,
            context: Context
        ) => {
            if (!context.user) throw new AuthenticationError('Unauthorized: No user found in context');
            console.log('Body received in UpdateClient resolver:', input);
            const client = await Client.findByIdAndUpdate(
                _id,
                { $set: input},
                { new: true}
            ).populate('assignedUserId')
            if (!client) {
                throw new Error(`Client not found with ID: ${_id}`);
            }
            return client;
        },
        removeClient: async(
            _parent: any,
            {_id}: RemoveClient,
            context: Context
        ) => {
            if (!context.user) throw new AuthenticationError('Unauthorized: No user found in context');

            console.log('Body ID  received in RemoveClient resolver')

            const client = await Client.findByIdAndDelete({_id, assignedUserId: context.user._id}).populate('assignedUserId');
            if (!client) {
                throw new Error(`Cliuent not found with ID: ${_id}`);
            }
            return client;
        },
        //** Appointment Mutations **/
        addAppointment: async(
            _parent: any,
            {input}: AddAppointment,
            context: Context
        ) => {
            if(!context.user) throw new AuthenticationError('Unauthorized: No user found in context');
            console.log(`📥 Body received in AddAppointment resolver:`, input);
            //Validates if client belongs to User
            const client = await Client.findOne({
                _id: input.clientId,
                assignedUserId: context.user._id
            })
            if(!client) {
                throw new Error('Client not found or not authorized to add Appointment')
            }
            const newAppointment = await Appointment.create(input);
            const clientData = await Client.findById(input.clientId).populate('assignedUserId');
            const userData = await User.findById(context.user._id);
        
            return {...newAppointment.toObject(), client: clientData, user: userData};
        },
        updateAppointment: async(
            _parent: any,
            {_id, input}: UpdateAppointment,
            context: Context
        ) => {
            if (!context.user) throw new AuthenticationError('Unauthorized: No user found in context');
            console.log(`📥 Body received in UpdateAppointment resolver:`, input);
            //Validates if client belongs to User
            if (input.clientId) {
                const client = await Client.findOne({
                    _id: input.clientId,
                    assignedUserId: context.user._id
                })
                if(!client) {
                    throw new Error('Clkient not found or not authorized to update Appointment')
                }
            }
            
            const appointment = await Appointment.findOneAndUpdate(
                {_id},
                { $set: input },
                { new: true }
            ).populate('clientId');
            if (!appointment) {
                throw new  Error(`Appointment not found with ID: ${_id}`);
            }
            const clientId = input.clientId || appointment.clientId;
            const clientData = await Client.findById(clientId).populate('assignedUserId');
            return {...appointment.toObject(), client: clientData};
        },
        removeAppointment: async(
            _parent: any,
            {_id} : RemoveAppointment,
            context: Context
        ) => {
            if (!context.user) throw new AuthenticationError('Unauthorized: No user found in context');
            console.log(`📥 Body ID received in RemoveAppointment resolver:`, _id);
            const appointment = await Appointment.findOneAndDelete({_id }).populate('clientId');
            if(!appointment) {
                throw new Error(`Appointment not found with ID: ${_id}`);
            }
            return appointment;
        }
    }      
}
