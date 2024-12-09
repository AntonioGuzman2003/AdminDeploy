import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Edit = () => {
    const { AnuncioId } = useParams(); 
    const navigate = useNavigate();
    const db = getDatabase();
    const anuncioRef = ref(db, `Anuncios/${AnuncioId}`);

    const [formData, setFormData] = useState({
        categoria: '',
        condicion: '',
        descripcion: '',
        direccion: '',
        estado: '',
        marca: '',
        precio: '',
        titulo: '',
    });

    useEffect(() => {
        const fetchAnuncio = async () => {
            try {
                const snapshot = await get(anuncioRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setFormData({
                        categoria: data.categoria || '',
                        condicion: data.condicion || '',
                        descripcion: data.descripcion || '',
                        direccion: data.direccion || '',
                        estado: data.estado || '',
                        marca: data.marca || '',
                        precio: data.precio || '',
                        titulo: data.titulo || '',
                    });
                } else {
                    console.log('Anuncio no encontrado');
                }
            } catch (error) {
                console.error('Error obteniendo anuncio:', error);
            }
        };

        fetchAnuncio();
    }, [AnuncioId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedAnuncio = {
            ...formData,
            tiempo: Date.now(), 
        };

        try {
            await update(anuncioRef, updatedAnuncio);

            MySwal.fire({
                title: 'Anuncio actualizado!',
                text: 'El anuncio se ha actualizado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate('/');
        } catch (error) {
            console.error('Error actualizando anuncio:', error);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '50px'}}>
            <h1>Editar Anuncio</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select 
                        className="form-select" 
                        name="categoria"
                        value={formData.categoria} 
                        onChange={handleChange} 
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
                        name="condicion"
                        value={formData.condicion} 
                        onChange={handleChange} 
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
                        name="descripcion"
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="direccion"
                        value={formData.direccion} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select 
                        className="form-select" 
                        name="estado"
                        value={formData.estado} 
                        onChange={handleChange} 
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
                        name="marca"
                        value={formData.marca} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        name="precio"
                        value={formData.precio} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="titulo"
                        value={formData.titulo} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Anuncio</button>
            </form>
        </div>
    );
};

export default Edit;
