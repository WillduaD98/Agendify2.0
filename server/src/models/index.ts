import dotenv from 'dotenv';
dotenv.config();
// import { Sequelize } from 'sequelize';
import { UserFactory } from './user.model.js';
import { ClientFactory } from './client.model.js';
import { AppointmentFactory } from './appointment.model.js';
import sequelize from '../config/db.js';


// const sequelize = process.env.DATABASE_URL
//   ? new Sequelize(process.env.DATABASE_URL)
//   : new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD, {
//     host: 'localhost',
//     dialect: 'postgres',
//     port: 5433,   //CAMBIAR EL PUERTO A 5432 para correrlo, para WILLIAM el puerto es el 5433
//     dialectOptions: {
//       decimalNumbers: true,
//     },
//   });

const User = UserFactory(sequelize);
const Client = ClientFactory(sequelize);
const Appointment = AppointmentFactory(sequelize)


User.hasMany(Client, {foreignKey: 'assignedUserId'});
Client.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

Client.hasMany(Appointment, {foreignKey: 'clientId'});
Appointment.belongsTo(Client, {foreignKey: 'clientId', as : 'client'})

export { User, Client, Appointment };