import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  console.log(`CONECTING TO PRODUCTION DATABASE...`)
  sequelize = new Sequelize(process.env.DATABASE_URL)
  console.log(`PRODUCTION DATABASE CONECTED!`)
  // 🌐 Configuración para producción (ej. Render)
  // sequelize = new Sequelize(process.env.DATABASE_URL, {
  //   dialect: 'postgres',
  //   protocol: 'postgres',
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false, // <- depende de tu proveedor
  //     },
  //   },
  //   logging: false,
  // });
} else {
  // 🖥️ Configuración local
  console.log('CONECTING TO DEV DATABASE...')
  const DB_HOST = process.env.DB_HOST;
  const DB_NAME = process.env.DB_NAME;
  const DB_USER = process.env.DB_USER;
  const DB_PASSWORD = process.env.DB_PASSWORD;

  if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error('Faltan variables de entorno para la base de datos');
  }

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
    port: 5433 //CAMBIAR PUERTO A 5432, EL 5433 ES PARA MI
  });
  console.log('CONECTED TO DEV DATABASE!')
}

export default sequelize;