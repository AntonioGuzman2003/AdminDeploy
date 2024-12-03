import './App.css';
import Usuario from './components/Usuario';
import Principal from './components/Principal';
import Edit from './components/Edit';
import Create from './components/Create';
import Anuncio from './components/Anuncio';
import CreateAnuncio from './components/CreateAnuncio';
import EditAnuncio from './components/EditAnuncio';
import Login from './components/Login'; 
import Register from './components/Register';
import Reporte from './components/Reporte';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route 
            path='/Principal' 
            element={
              <PrivateRoute>
                <Principal />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/Usuario' 
            element={
              <PrivateRoute>
                <Usuario />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/Usuario/create' 
            element={
              <PrivateRoute>
                <Create />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/Usuario/edit/:userId' 
            element={
              <PrivateRoute>
                <Edit />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/Anuncio' 
            element={
              <PrivateRoute>
                <Anuncio />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/Anuncio/CreateAnuncio' 
            element={
              <PrivateRoute>
                <CreateAnuncio />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/Anuncio/EditAnuncio/:AnuncioId' 
            element={
              <PrivateRoute>
                <EditAnuncio />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/Reporte' 
            element={
              <PrivateRoute>
                <Reporte />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
