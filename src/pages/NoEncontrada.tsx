import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscás no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </>
  )
}

export default NoEncontrada
