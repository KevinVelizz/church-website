import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Contacto from './pages/Contacto'
import Eventos from './pages/Eventos'
import Home from './pages/Home'
import NoEncontrada from './pages/NoEncontrada'
import Nosotros from './pages/Nosotros'
import Oracion from './pages/Oracion'
import Publicaciones from './pages/Publicaciones'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />

      <main className="app-principal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/publicaciones" element={<Publicaciones />} />
          <Route path="/oracion" element={<Oracion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
