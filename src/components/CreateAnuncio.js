import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push } from 'firebase/database';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Create = () => {
    const [categoria, setCategoria] = useState('');
    const [condicion, setCondicion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [direccion, setDireccion] = useState('');
    const [estado, setEstado] = useState('');
    const [marca, setMarca] = useState('');
    const [precio, setPrecio] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [titulo, setTitulo] = useState('');

    const navigate = useNavigate();
    const db = getDatabase();
    const anunciosRef = ref(db, 'Anuncios');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Datos del nuevo anuncio
        const newAnuncio = {
            categoria: categoria || null,
            condicion: condicion || null,
            descripcion: descripcion || null,
            direccion: direccion || null,
            estado: estado || null,
            marca: marca || null,
            precio: precio || null,
            tiempo: Date.now(),
            titulo: titulo || null,
        };

        try {
            await push(anunciosRef, newAnuncio);

            MySwal.fire({
                title: 'Anuncio creado!',
                text: 'El Anuncio se ha creado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate('/');
        } catch (error) {
            console.error('Error creando anuncio:', error);
        }
    };

    return (
        <div className="container">
            <h1>Crear Anuncio</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select 
                        className="form-select" 
                        value={categoria} 
                        onChange={(e) => setCategoria(e.target.value)} 
                        required
                    >
                        <option value="">Seleccione una categoría</option>
                        <option value="Todos">Todos</option>
                        <option value="Computo">Computo</option>
                        <option value="Electronica">Electrónica</option>
                        <option value="Moviles">Móviles</option>
                        <option value="Autos">Autos</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Condición</label>
                    <select 
                        className="form-select" 
                        value={condicion} 
                        onChange={(e) => setCondicion(e.target.value)} 
                        required
                    >
                        <option value="">Seleccione una condición</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Usado">Usado</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea 
                        className="form-control" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={direccion} 
                        onChange={(e) => setDireccion(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select 
                        className="form-select" 
                        value={estado} 
                        onChange={(e) => setEstado(e.target.value)} 
                        required
                    >
                        <option value="">Seleccione un estado</option>
                        <option value="Vendidos">Vendidos</option>
                        <option value="Disponible">Disponible</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Marca</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={marca} 
                        onChange={(e) => setMarca(e.target.value)} 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={precio} 
                        onChange={(e) => setPrecio(e.target.value)} 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Crear Anuncio</button>
            </form>
            
        </div>
        
    );
};

export default Create;
