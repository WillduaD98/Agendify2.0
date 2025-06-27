import db from '../config/db.js';
import User from '../models/user.model.js';

const seedInitialUsers = async () => {
  try {
    await db();
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      await User.create({
        username: 'admin',
        email: 'admin@email.com',
        password: 'admin123', // Será hasheado por tu pre('save')
      });
      console.log('🧪 Usuario admin creado');
    } else {
      console.log('ℹ️ El usuario admin ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
  } finally {
    process.exit();
  }
};

seedInitialUsers();

