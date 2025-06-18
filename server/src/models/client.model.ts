// import { DataTypes, Sequelize, Model, Optional } from "sequelize";
// import { User } from './user.model.js'
import {Schema, model, type Document, Types} from 'mongoose';

export interface ClientAttributes extends Document {
    name: string;
    phoneNumber: string;
    assignedUserId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const clientSchema = new Schema<ClientAttributes>({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    assignedUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    },
    {
        timestamps: true
    }
);

const Client = model<ClientAttributes>('Client', clientSchema);
export default Client;
// Should we import usermodel?

// Define the interface for the client Class
// interface ClientAttributes {
//     id: number;
//     name: string;
//     phoneNumber: string;
//     assignedUserId?: number;
// }

// interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'>{}

// export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes{
//     public id!: number;
//     public name!: string;
//     public phoneNumber!: string;
//     public assignedUserId?: number;

//     // associated User model
//     public readonly assignedUser? : User;

//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;
// }

// export function ClientFactory(sequelize: Sequelize): typeof Client {
//     Client.init(
//         {
//             id: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             name: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             phoneNumber: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             assignedUserId: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 references: {
//                     model: 'users',
//                     key: 'id'
//                 }
//             }
//         },
//         {
//             tableName: 'clients',
//             sequelize,
//         }
//     );
//     return Client;
// }