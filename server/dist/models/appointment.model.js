import { DataTypes, Model } from 'sequelize';
export class Appointment extends Model {
}
export function AppointmentFactory(sequelize) {
    Appointment.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'pending'
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'clients',
                key: 'id'
            }
        }
    }, {
        tableName: 'appointments',
        sequelize,
    });
    return Appointment;
}
;
