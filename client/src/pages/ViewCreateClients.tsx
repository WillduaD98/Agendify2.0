// import React from 'react'
import _React, {useState, useEffect} from 'react';
import ClientForm from '../components/ClientForm.js'
import ClientList from '../components/ClientList.js';
import api from '../services/api.js';

const ViewCreateClient = () => {
    const [clients, setClients] = useState([]);

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data)
        } catch (error) {
            console.error('Error chargin clients: ', error)
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);



    return (
        <div>
            <ClientForm onSuccess={fetchClients} />
            <ClientList clients={clients}/>
        </div>
    )
}
export default ViewCreateClient