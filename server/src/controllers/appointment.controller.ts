import { Request, Response } from 'express';
import { Client, Appointment, User } from '../models/index.js';
import { Op } from 'sequelize';
import { AuthRequest } from '../utils/authMiddleware.js';
import { WhatsAppService } from '../services/whatsapp.service.js';

// import { User } from '../models/user.model';

// funciones para manejar las citas y conectarse a la base de datos
// controlan el CRUD de las citas

//CREAT UN APPOINTMENT por POST
export const createAppointment = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  try {
    const {date, clientId, status, reason} = req.body;
    const user = await User.findByPk(userId)
    const userName = user?.username
    // Checked if client exist:
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({message: 'Client not found'});
    }

    const newAppointment = await Appointment.create({
      date, 
      clientId, 
      reason,
      status: status
    });
    if (status === 'confirmed') {
      const phoneNumber = client?.phoneNumber;
      const clientName = client?.name;
      const appointmentDate = date;
      if (phoneNumber && clientName && appointmentDate) {
        console.log(`📲 Enviando mensaje de confirmación a: ${phoneNumber}`);
        // Aquí después conectarías con API real de WhatsApp
        await WhatsAppService.sendConfirmationMessage(phoneNumber, clientName, appointmentDate, userName)
        return Promise.resolve();
      }
    }

    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error(`Error al crear la cita: `, error)
    return res.status(500).json({ message: 'Error al crear la cita', error });
  }
};

//Obtener todos los Appointments con GET por fecha
export const getAppointmentsByDateAndUser = async (req: AuthRequest, res: Response) => {
  const { date } = req.query
  const userId = req.userId
  console.log('User ID en el request:', userId)
  if (!userId || !date) {
    return res.status(400).json({message: `user Id and Date are required. `})
  }
  try {
    const start= new Date(date as string);
    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.findAll({
      where: {
        date: {
          [Op.between]: [start, end]
        },
        '$client.assignedUserId$': userId},
      include: [
        {
          model: Client,
          as: 'client',
          where: {
            assignedUserId: userId
          },
          attributes: ['id', 'name', 'phoneNumber']
        }
      ],
      order: [['date', 'ASC']]
    })
    return res.status(200).json(appointments);
  } catch (error: any) {
    console.error('❌ Error al obtener citas:', error); 
    return res.status(500).json({message: error.message})
  }
};
//Find Appointment by ID  - GET
export const getAppointmentById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['name']
        }
      ]
    });
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' });
    return res.status(200).json(appointment);
  } catch (error: any) {
    console.error('❌ Error al crear cliente:', error); 
    return res.status(500).json({message: error.message})
  }
};

//Actualizar Appointment PUT

export const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params
  const {date, status, reason} = req.body
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.date = date || appointment.date;
    appointment.status = status || appointment.status
    appointment.reason = reason || appointment.reason
    
    await appointment.save();




    return res.status(200).json(`Appointment updated ${appointment}`);
  } catch (error: any) {
    console.error('❌ Error al crear cliente:', error); 
    return res.status(500).json({message: error.message})
  }
};

//Deletear Appointment DELETE
export const deleteAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' });

    await appointment.destroy();
    return res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar cita', error });
  }
};
