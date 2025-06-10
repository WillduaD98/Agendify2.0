import express from 'express';
import { 
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
} from '../../controllers/client.controller.js'

const router = express.Router();

// Estructura

//GET /clients - Get all Clients
router.get('/', getAllClients);

//GET /clients/:id - Get a client by id
router.get('/id', getClientById);

// POST /clients - create a new client
router.post('/', createClient);

// PUT /clients/:id - Update a client by id
router.put('/:id', updateClient);

// DELETE /clients/:id - Delete a client by id
router.delete('/:id', deleteClient);

export {router as clientRouter };