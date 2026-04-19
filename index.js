import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function LandingPage() {
  const [productos, setProductos] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState('Todos');
  const [cargando, setCargando] = useState(true);

  const categorias = ['Todos', 'Bebé', 'Niño', 'Niña', 'Hombre', 'Mujer'];

  useEffect(() => {
    fetchProductos();
  }, [categoriaActual]);

  async function fetchProductos() {
    setCargando(true);
    let query = supabase
      .from('productos')
      .select('*')
      .eq('disponible', true)
      .order('created_at', { ascending: false });

    if (categoriaActual !== 'Todos') {
      query = query.eq('categoria', categoriaActual);
    }

    const { data, error } = await query;
    if (!error) setProductos(data);
    setCargando(false);
  }

  return (
    <div className="boutique-wrapper">
      
      {/* --- BLOQUE AZUL: NAVBAR --- */}
      <nav className="nav-boutique">
        <div className="logo">DORIS.</div>
        <div className="nav-links">
          {categorias.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategoriaActual(cat)}
              className={categoriaActual === cat ? 'active' : ''}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* --- BLOQUE VERDE: HERO --- */}
      <header className="hero-container">
        <div className="hero-text">
          <p className="hero-location">Guápiles, Costa Rica</p>
          <h1 className="hero-title">Tesoros con <br/><i>Pasado.</i></h1>
          <div className="hero-divider"></div>
          <p className="hero-description">
            Curaduría exclusiva de ropa americana. Piezas seleccionadas una a una, 
            rescatando la calidad y el estilo que trasciende el tiempo.
          </p>
          <button className="btn-primary">Explorar Archivo</button>
        </div>
        <div className="hero-visual">
          <div className="hero-frame">
             {/* Imagen decorativa de la boutique */}
            <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974" alt="Boutique Doris" />
          </div>
        </div>
      </header>

      {/* --- BLOQUE HUESO: PRODUCTOS --- */}
      <main className="main-content">
        <div className="section-intro">
          <span className="label">Colección Actual</span>
          <h2 className="display-title">
            {categoriaActual === 'Todos' ? 'Piezas Únicas' : `Selección ${categoriaActual}`}
          </h2>
          <div className="accent-line"></div>
        </div>

        {cargando ? (
          <div className="loader-container">
            <div className="loader-text">Buscando en el archivo...</div>
          </div>
        ) : (
          <div className="grid-boutique">
            {productos.map((prod, index) => (
              <article 
                key={prod.id} 
                className="product-card"
                style={{ 
                  // Asimetría dinámica: los productos pares bajan 60px
                  marginTop: index % 2 !== 0 ? '60px' : '0px' 
                }}
              >
                <div className="image-holder">
                  <img src={prod.imagen_url} alt={prod.nombre} />
                  <div className="category-badge">{prod.categoria}</div>
                </div>
                <div className="product-info">
                  <h3>{prod.nombre}</h3>
                  <p className="product-price">₡{prod.precio.toLocaleString()}</p>
                  <button className="btn-minimal">Añadir al Carrito</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* --- BLOQUE OSCURO: FOOTER --- */}
      <footer className="footer-boutique">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">DORIS.</div>
            <p>Moda con propósito y alma.</p>
          </div>
          <div className="footer-contact">
            <p><strong>Ubicación</strong><br/>Costado Norte del Parque, Guápiles.</p>
            <p><strong>Envíos</strong><br/>A todo el país por Correos de CR.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© 2026 La Americana de Doris — Curaduría de Excelencia</small>
        </div>
      </footer>

    </div>
  );
}
