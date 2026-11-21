import { Adicionales } from './componentes/Adicionales';
import { Paquetes } from './componentes/Paquetes';
import { BASE_API } from './servicios/villaPenas';

export default function App() {
  return (
    <div id="inicio">
      <header className="cabecera">
        <div className="contenedor cabecera-interior">
          <a className="marca" href="#inicio">Villa Peñas</a>
          <nav aria-label="Navegación principal">
            <a href="#paquetes">Paquetes</a>
            <a href="#adicionales">Adicionales</a>
          </nav>
        </div>
      </header>
      <main className="contenedor">
        <section className="portada" aria-labelledby="titulo">
          <h1 id="titulo">Paquetes para<br className="salto-portada" /> tu evento</h1>
          <p>Consultá precios, servicios incluidos y productos adicionales de Villa Peñas.</p>
        </section>
        <Paquetes />
        <Adicionales />
      </main>
      <footer className="contenedor pie">
        <a href={BASE_API + '/api/docs'} target="_blank" rel="noreferrer">
          Documentación de la API <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </div>
  );
}
