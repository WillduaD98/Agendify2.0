// import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
// import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';
import {Schema, model, type  Document} from 'mongoose';


export interface UserAttributes extends Document {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isCorrectPassword(password: string): Promise<boolean>
};

const userSchema = new Schema<UserAttributes>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    // set clinets to be an array data that adheres to the client Schema
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Virtual field for realted clients
userSchema.virtual('clients', {
  ref: 'Client',
  localField: '_id',
  foreignField: 'assignedUserId',
  justOne: false
})
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});
//custom method to compare and validatre password for loggin in:
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

const User = model<UserAttributes>('User', userSchema)

export default User;

// // Definir los atributos que tendrá el modelo
// interface UserAttributes {
//   id: number;
//   username: string;
//   password: string;
// }

// // Para crear nuevos usuarios sin ID (autoincremental)
// interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
//   public id!: number;
//   public username!: string;
//   public password!: string;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   public async setPassword(password: string) {
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(password, saltRounds)
//   }
// }

// export function UserFactory (sequelize: Sequelize): typeof User {
//   User.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       username: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//     },
//     {
//       tableName: 'users',
//       sequelize,
//       hooks: {
//         beforeCreate: async (user: User) => {
//           await user.setPassword(user.password);
//         },
//         beforeUpdate: async (user: User) => {
//           await user.setPassword(user.password)
//         }
//       }
//     }
//   );
//   return User
// }



