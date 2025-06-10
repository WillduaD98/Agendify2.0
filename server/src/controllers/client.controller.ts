import { Request, Response } from 'express';
import { Client, User } from '../models/index.js';
import { AuthRequest } from '../utils/authMiddleware.js';

//CREAR UN CLIENTE por POST
export const createClient = async (req: AuthRequest, res: Response) => {
    const {name, phoneNumber} = req.body;
    console.log(`desde CreateClient controler: `, req.userId)
    const assignedUserId = req.userId

    if (!assignedUserId) {
        return res.status(401).json({message: 'Unauthorized: no userId in Request'})
    }
    try {
        console.log('📥 Body recibido:', req.body);
        const newClient = await Client.create({
            name, 
            phoneNumber,
            assignedUserId
        });
        return res.status(201).json(newClient)
    } catch (error) {
        console.error('❌ Error al crear cliente:', error); 
        return res.status(500).json(`error in creating client controller: ${error}`)
    }
}

//Obtener todos los clientes con GET
export const getAllClients = async (req: AuthRequest, res: Response) => {
    const userId = req.userId
    try {
        const clients = await Client.findAll({
            where: { assignedUserId: userId },
            include: [
                {
                    model: User,
                    as: 'assignedUser',
                    attributes: ['username']
                },
            ],
        });
        res.json(clients)
    } catch (error) {
        console.error('❌ Error al crear cliente:', error); 
        res.status(500).json(`error in getting All Clients controller: ${error}`)
    }
}
// Obtener un cliente por ID GET
export const getClientById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const client = await Client.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'assignedUser',
                    attributes: ['username'],
                },
            ],
        });
        if (client) {
            res.json(client)
        } else {
            res.status(404).json({message: `Ticket not found`})
        }
    } catch (error: any) {
        console.error('❌ Error al crear cliente:', error); 
        res.status(500).json({message: error.message})
    }
}
// Actualizar cliente PUT
export const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {name, phoneNumber, assignedUserId } = req.body;
    try {
        const client = await Client.findByPk(id);
        if (client) {
            client.name = name;
            client.phoneNumber = phoneNumber;
            client.assignedUserId = assignedUserId;
            await client.save();
            res.json(client)
        } else {
            res.status(404).json({message: `Client not found`})
        }
    } catch (error: any) {
        console.error('❌ Error al crear cliente:', error); 
        res.status(400).json({message: error.message})
    }
}
//Eliminar cliente DELETE
export const deleteClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const client = await Client.findByPk(id);
        if (client) {
            await client.destroy();
            res.json({message: `Client deleted`})
        } else{
            res.status(404).json({message: `Client not found`})
        }
    } catch (error: any) {
        console.error('❌ Error al crear cliente:', error); 
        res.status(400).json({message: error.message})
    }
}