

// import { Sequelize } from 'sequelize';
import  User  from './user.model.js';
import Client  from './client.model.js';
import Appointment  from './appointment.model.js';

export { User, Client, Appointment };

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

// const User = UserFactory(sequelize);
// const Client = ClientFactory(sequelize);
// const Appointment = AppointmentFactory(sequelize)


// User.hasMany(Client, {foreignKey: 'assignedUserId'});
// Client.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

// Client.hasMany(Appointment, {foreignKey: 'clientId'});
// Appointment.belongsTo(Client, {foreignKey: 'clientId', as : 'client'})

