import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, get, remove } from 'firebase/database';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { db } from '../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import './Usuario.css';
import './fondo.css';
import basuraIcon from '../assets/basura.png';
import editarIcon from '../assets/editar.png';
import fondoVideo from '../video/fondo.mp4';
const MySwal = withReactContent(Swal);

const Show = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const usersRef = ref(db, 'Usuarios');

    // Función obtener
    const getUsers = async () => {
        try {
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const usersList = Object.keys(data).map((key) => ({
                    ...data[key],
                    id: key
                }));
                setUsers(usersList);
            } else {
                console.log('No hay datos disponibles');
            }
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
        }
    };

    // Función Eliminar
    const deleteUser = async (id) => {
        try {
            const userRef = ref(db, `Usuarios/${id}`);
            await remove(userRef);
            getUsers(); 
        } catch (error) {
            console.error('Error eliminando usuario:', error);
        }
    };


    const confirmDelete = (id) => {
        MySwal.fire({
            title: '¿Eliminar el usuario?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡elimínalo!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(id);
                MySwal.fire(
                    'Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const navigate = useNavigate();
    const irAPagina = () => {
        navigate('/Principal');
    };

    // Search
const filteredUsers = users.filter((user) => 
    (user.nombres && user.nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.telefono && user.telefono.includes(searchTerm))
);


    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='row '>
                <div className='button-container  d-flex justify-content-start'>
                    <button onClick={irAPagina} className="btn-sesion btn-3 my-3" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        Volver a Principal
                    </button>  
                </div>             
                    <div className='d-grid gap-2'>
                        <Link to="/Usuario/create" className="btn btn-primary my-3">+ Añadir Nuevo</Link>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-control mb-3"
                    />
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover" >
                            <thead className="table-light">
                                <tr>
                                    <th>No.</th>
                                    <th>Codigo Teléfono</th>
                                    <th>Email</th>
                                    <th>Fecha de Nacimiento</th>
                                    <th>Nombres</th>
                                    <th>Proveedor</th>
                                    <th>Teléfono</th>
                                    <th>Tiempo</th>
                                    <th>Imagen de Perfil</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{indexOfFirstUser + index + 1}</td>
                                        <td>{user.codigoTelefono}</td>
                                        <td>{user.email}</td>
                                        <td>{user.fecha_nac}</td>
                                        <td>{user.nombres}</td>
                                        <td>{user.proveedor}</td>
                                        <td>{user.telefono}</td>
                                        <td>{user.tiempo}</td>
                                        <td>
                                            {user.urlImagenPerfil ? (
                                                <img src={user.urlImagenPerfil} alt="Perfil" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                            ) : 'No disponible'}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/Usuario/edit/${user.id}`} className="btn btn-sm">
                                                    <img src={editarIcon} alt="Editar" style={{ width: '20px', height: '20px' }} />
                                                </Link>
                                                <button 
                                                    onClick={() => confirmDelete(user.id)} 
                                                    className="btn btn-sm"
                                                    style={{ background: 'none', border: 'none', padding: 0 }}
                                                >
                                                    <img src={basuraIcon} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mt-2'>
                        <span>Mostrando {currentUsers.length} de {filteredUsers.length} usuarios</span>
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(filteredUsers.length / rowsPerPage) }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                        <button onClick={() => paginate(i + 1)} className="page-link">
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
                <video muted autoPlay loop className="background-video">
        <source src={fondoVideo} type="video/mp4" />
      </video>
      <div className="capa"></div>
            </div>
    );
};

export default Show;
