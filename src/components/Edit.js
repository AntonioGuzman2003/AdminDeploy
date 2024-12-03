import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, update, get } from 'firebase/database';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Edit = () => {
    const { userId } = useParams(); 
    const [codigoTelefono, setCodigoTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNac, setFechaNac] = useState('');
    const [nombres, setNombres] = useState('');
    const [telefono, setTelefono] = useState('');
    const [urlImagenPerfil, setUrlImagenPerfil] = useState('');
    const [online, setOnline] = useState(false);

    const navigate = useNavigate();
    const db = getDatabase();
    const userRef = ref(db, `Usuarios/${userId}`);

    useEffect(() => {
        console.log('User ID in Edit:', userId); 

        const fetchUserData = async () => {
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setCodigoTelefono(data.codigoTelefono || '');
                    setEmail(data.email || '');
                    setFechaNac(data.fecha_nac || '');
                    setNombres(data.nombres || '');
                    setTelefono(data.telefono || '');
                    setUrlImagenPerfil(data.urlImagenPerfil || '');
                    setOnline(data.online || false);
                } else {
                    console.log('No data available for this user.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            codigoTelefono: codigoTelefono || null,
            email: email,
            fecha_nac: fechaNac || null,
            nombres: nombres,
            online: online || false,
            proveedor: "Email",
            telefono: telefono || null,
            tiempo: Date.now(),
            uid: userId,
            urlImagenPerfil: urlImagenPerfil || null
        };

        try {
            await update(userRef, updatedUser);

            MySwal.fire({
                title: '¡Usuario actualizado!',
                text: 'El usuario se ha actualizado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate('/');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="container">
            <h1>Editar Usuario</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3" style={{ display: 'none' }}>
                    <label className="form-label">Código de Teléfono (Opcional)</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={codigoTelefono} 
                        onChange={(e) => setCodigoTelefono(e.target.value)} 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Nacimiento (Opcional)</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        value={fechaNac} 
                        onChange={(e) => setFechaNac(e.target.value)} 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombres</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={nombres} 
                        onChange={(e) => setNombres(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono (Opcional)</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={telefono} 
                        onChange={(e) => setTelefono(e.target.value)} 
                    />
                </div>
                <div className="mb-3" style={{ display: 'none' }}>
                    <label className="form-label">URL Imagen de Perfil (Opcional)</label>
                    <input 
                        type="url" 
                        className="form-control" 
                        value={urlImagenPerfil} 
                        onChange={(e) => setUrlImagenPerfil(e.target.value)} 
                    />
                </div>
                <div className="mb-3" style={{ display: 'none' }}>
                    <label className="form-label">¿Está en línea? (Opcional)</label>
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={online} 
                        onChange={(e) => setOnline(e.target.checked)} 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Usuario</button>
            </form>
        </div>
    );
};

export default Edit;
