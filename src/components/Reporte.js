import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reporte.css';
import './fondo.css';
import fondoVideo from '../video/fondo.mp4';

const DenunciasTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  const irAPagina = () => {
    navigate('/Principal');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.sheetbest.com/sheets/d8c40cef-36fe-482f-9117-ff98b1378b3b');
        const result = await response.json();
        console.log('Datos obtenidos de la API:', result);
  
        if (Array.isArray(result)) {
          const normalizedData = result.map(item => {
            return {
              'Marca temporal': item['Marca temporal'],
              'Nombre del vendedor': item['Nombre del vendedor'],
              'Correo electrónico del vendedor': item['Correo electrónico del vendedor'],
              'Motivo de denuncia': item['Motivo de denuncia\n']?.trim(),
              'Subir captura de pantalla de la publicación como evidencia': item['Subir captura de pantalla de la publicación como evidencia\n']?.trim(),
              'Consentimiento del Usuario': item['Consentimiento del Usuario'],
            };
          });
  
          setData(normalizedData);
          setFilteredData(normalizedData); 
        } else {
          console.error('La respuesta no es un array:', result);
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('Error al cargar los datos');
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = data.filter(fila =>
      fila['Nombre del vendedor']?.toLowerCase().includes(term)
    );
    setFilteredData(filtered); 
  };

  return (
    <div className="table-responsive">
      <button onClick={irAPagina} className="btn-sesion btn-3 my-3" style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Volver a Principal
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Buscar por nombre del vendedor"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control mb-3"
          />

          <table className="table table-custom table-hover">
            <thead>
              <tr>
                <th>Marca temporal</th>
                <th>Nombre del vendedor</th>
                <th>Correo electrónico del vendedor</th>
                <th>Motivo de denuncia</th>
                <th>Captura de pantalla</th>
                <th>Consentimiento del usuario</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((fila, index) => {
                const motivoDenuncia = fila['Motivo de denuncia'];
                const imageUrl = fila['Subir captura de pantalla de la publicación como evidencia'];
                const directImageUrl = imageUrl ? imageUrl.replace('/open?id=', '/uc?id=') : '';

                return (
                  <tr key={index}>
                    <td>{fila['Marca temporal']}</td>
                    <td>{fila['Nombre del vendedor']}</td>
                    <td>{fila['Correo electrónico del vendedor']}</td>
                    <td>{motivoDenuncia}</td>
                    <td>
                      {directImageUrl ? (
                        <a href={directImageUrl} target="_blank" rel="noopener noreferrer">
                          Ver captura
                        </a>
                      ) : (
                        'No disponible'
                      )}
                    </td>
                    <td>{fila['Consentimiento del Usuario']}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
                   <video muted autoPlay loop className="background-video">
        <source src={fondoVideo} type="video/mp4" />
      </video>
      <div className="capa"></div>
    </div>
    
  );
};

export default DenunciasTable;
