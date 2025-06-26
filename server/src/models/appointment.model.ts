
// import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
// import { Client } from '../models/client.model.js';
import {Schema, model, type Document, Types} from 'mongoose';
import  { ClientAttributes } from './client.model.js';

export interface AppointmentAttributes extends Document {

  date: Date;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  time: string;
  clientId: Types.ObjectId;
  client?: ClientAttributes

}

const appointmentSchema = new Schema<AppointmentAttributes>(
  {
    date:{
      type: Date,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    time: {
      type: String,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    }
  },
  {
    toJSON: {
      virtuals: true,
    }
  }
);

appointmentSchema.virtual('client', {
  ref: 'Client',
  localField: 'clientId',
  foreignField: '_id',
  justOne:true
})
const Appointment = model<AppointmentAttributes>('Appointment', appointmentSchema);

export default Appointment;

// interface AppoinmentCreationAttributes extends Optional<AppointmentAttributes, 'id'>{}

// export class Appointment extends Model<AppointmentAttributes, AppoinmentCreationAttributes> implements AppointmentAttributes{
//   public id!: number;
//   public date!: Date;
//   public reason!: string;
//   public status!: 'pending' | 'confirmed' | 'cancelled';
//   public clientId?: number;

//   public readonly client?: Client

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }



// export function AppointmentFactory (sequelize: Sequelize): typeof Appointment {
//   Appointment.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       date: {
//         type: DataTypes.DATE,
//         allowNull: true
//       },
//       reason: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       status: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         defaultValue: 'pending'
//       },
//       clientId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'clients',
//           key: 'id'
//         }
//       }
//     },
//     {
//       tableName: 'appointments',
//       sequelize,
//     }
//   );
//   return Appointment;
// };
