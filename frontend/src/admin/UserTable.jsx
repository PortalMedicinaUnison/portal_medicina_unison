import React from 'react';
import { useState, useEffect } from 'react';
import api from '../api';
import { users } from '../../data';

function UserTable() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const response = await api.get("/users/");
            setUsers(response.data);
        } catch (error) {
            console.error("Edit failed", error);
        }
    };
    
    useEffect(() => {
        getUsers();
    }, []);
    
    
    const handleEditButton = (e) => {
        // getUsers();
        console.log(statusFilter);
    };
    
    const handleDeleteButton = (userId) => {
        const deleteUser = async () => {
            try {
                const response = await api.delete(`/users/${userId}`);
                await getUsers();
            } catch (error) {
                console.error("Delete failed", error);
            }
        };

        const userConfirmed = confirm('El estado de este usuario se establecerá como inactivo. ¿Deseas continuar?');
        if (userConfirmed) {
            deleteUser();
        }
    };

    return (
        <div className="center">
            <div className='search-filter'>
                <b>Filtrar por estatus: </b>
                <select id="status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="active" selected>Activo</option>
                    <option value="inactive">Inactivo</option>
                </select>
            </div>
            <input
                className='search-bar'
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Buscar usuario'
            />
            <table className='user-table'>
                <tr className='header-row'>
                    <td>Expediente</td>
                    <td>Nombre</td>
                    <td>Apellido(s)</td>
                    <td>Correo</td>
                    <td>Estatus</td>
                </tr>
                {users.filter((item) => {
                    return (search.toLowerCase() === '' 
                        || item.last_name.toLowerCase().includes(search.toLowerCase())
                        || item.second_last_name.toLowerCase().includes(search.toLowerCase())
                        || item.first_name.toLowerCase().includes(search.toLowerCase())
                        || String(item.academic_id).includes(search))
                        // && (statusFilter == 'all');
                        && (statusFilter == 'all' ? item : (statusFilter == 'active') ? item.is_active : !item.is_active);
                }).map((item) => (
                    <tr>
                        <td>{item.academic_id}</td>
                        <td>{item.first_name}</td>
                        <td>{item.last_name} {item.second_last_name}</td>
                        <td>{item.email}</td>
                        <td>{(item.is_active) ? 'Activo' : 'Inactivo'}</td>
                        <td><button className='user-table-button' onClick={e => handleEditButton(item.user_id)}>Editar</button></td>
                        {(statusFilter != 'inactive') && (<td><button className='user-table-button' onClick={e => handleDeleteButton(item.user_id)}>Borrar</button></td>)}
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default UserTable;
