import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, get, remove } from 'firebase/database';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { db } from '../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import './Anuncio.css';
import './fondo.css';
import fondoVideo from '../video/fondo.mp4';
import basuraIcon from '../assets/basura.png';
import editarIcon from '../assets/editar.png';
const MySwal = withReactContent(Swal);

const Show = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const anunciosRef = ref(db, 'Anuncios');

    // Función obtener
    const getAnuncios = async () => {
        try {
            const snapshot = await get(anunciosRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const anunciosList = Object.keys(data).map((key) => ({
                    ...data[key],
                    id: key
                }));
                setAnuncios(anunciosList);
            } else {
                console.log('No hay datos disponibles');
            }
        } catch (error) {
            console.error('Error obteniendo anuncios:', error);
        }
    };

    // Función  eliminar 
    const deleteAnuncio = async (id) => {
        try {
            const anuncioRef = ref(db, `Anuncios/${id}`);
            await remove(anuncioRef);
            getAnuncios(); 
        } catch (error) {
            console.error('Error eliminando anuncio:', error);
        }
    };

    const confirmDelete = (id) => {
        MySwal.fire({
            title: '¿Eliminar el Anuncio?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡elimínalo!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAnuncio(id);
                MySwal.fire(
                    'Eliminado!',
                    'El anuncio ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    useEffect(() => {
        getAnuncios();
    }, []);

    const navigate = useNavigate();
    const irAPagina = () => {
        navigate('/Principal');
    };

    // search
    const filteredAnuncios = anuncios.filter((anuncio) => 
        anuncio.titulo && anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAnuncio = currentPage * rowsPerPage;
    const indexOfFirstAnuncio = indexOfLastAnuncio - rowsPerPage;
    const currentAnuncios = filteredAnuncios.slice(indexOfFirstAnuncio, indexOfLastAnuncio);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col  d-flex justify-content-start'>
                    <button onClick={irAPagina} className="btn-sesion btn-3 my-3" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        Volver a Principal
                    </button>
                </div>
                    <div className='d-grid gap-2'>
                        <Link to="/Anuncio/createAnuncio" className="btn btn-primary my-3">Crear</Link>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-control mb-3"
                    />
                    <div className="table-responsive">
                        <table className="table table-custom table-hover">
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Condición</th>
                                    <th>Titulo</th>
                                    <th>Dirección</th>
                                    <th>Estado</th>
                                    <th>Marca</th>
                                    <th>Precio</th>
                                    <th>Tiempo</th>
                                    <th>descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAnuncios.map((anuncio) => (
                                    <tr key={anuncio.id}>
                                        <td>{anuncio.categoria}</td>
                                        <td>{anuncio.condicion}</td>
                                        <td>{anuncio.titulo}</td>
                                        <td>{anuncio.direccion}</td>
                                        <td>{anuncio.estado}</td>
                                        <td>{anuncio.marca}</td>
                                        <td>{anuncio.precio}</td>
                                        <td>{anuncio.tiempo}</td>
                                        <td>{anuncio.descripcion}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/Anuncio/EditAnuncio/${anuncio.id}`} className="btn btn-sm">
                                                    <img src={editarIcon} alt="Editar" style={{ width: '20px', height: '20px' }} />
                                                </Link>
                                                <button 
                                                    onClick={() => confirmDelete(anuncio.id)} 
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
                        <span>Mostrando {currentAnuncios.length} de {filteredAnuncios.length} anuncios</span>
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(filteredAnuncios.length / rowsPerPage) }, (_, i) => (
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
