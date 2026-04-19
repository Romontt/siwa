import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase'; // Ajusta la ruta según tu archivo

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
    <div style={{ backgroundColor: '#f9f7f2', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* --- NAVBAR --- */}
      <nav style={styles.nav}>
        <div style={styles.logo}>LA AMERICANA DE DORIS</div>
        <div style={styles.menu}>
          {categorias.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategoriaActual(cat)}
              style={{
                ...styles.navButton,
                borderBottom: categoriaActual === cat ? '2px solid #d46a4e' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Tesoros Pre-Amados</h1>
        <p style={styles.heroSubtitle}>Ropa americana seleccionada pieza por pieza para tu familia.</p>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main style={styles.main}>
        <div style={styles.sectionHeader}>
          <h2>{categoriaActual === 'Todos' ? 'Novedades de la semana' : `Ropa para ${categoriaActual}`}</h2>
          <p>{productos.length} piezas únicas encontradas</p>
        </div>

        {cargando ? (
          <p style={{ textAlign: 'center' }}>Buscando tesoros...</p>
        ) : (
          <div style={styles.grid}>
            {productos.map(prod => (
              <div key={prod.id} style={styles.card}>
                <div style={styles.imageContainer}>
                  <img src={prod.imagen_url} alt={prod.nombre} style={styles.image} />
                </div>
                <div style={styles.cardInfo}>
                  <span style={styles.categoryBadge}>{prod.categoria}</span>
                  <h3 style={styles.prodName}>{prod.nombre}</h3>
                  <p style={styles.price}>₡{prod.precio.toLocaleString()}</p>
                  <button style={styles.addButton}>Añadir al Carrito</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer style={styles.footer}>
        <p>Ubicados en Guápiles, Limón. Envíos a todo el país.</p>
      </footer>
    </div>
  );
}

// --- ESTILOS (Objetos JS para no usar archivos extra por ahora) ---
const styles = {
  nav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    color: '#d46a4e',
    marginBottom: '15px'
  },
  menu: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  navButton: {
    background: 'none',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#444',
    transition: '0.3s'
  },
  hero: {
    height: '40vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d46a4e',
    color: '#fff',
    textAlign: 'center',
    padding: '0 20px'
  },
  heroTitle: { fontSize: '2.5rem', margin: 0 },
  heroSubtitle: { fontSize: '1.1rem', opacity: 0.9 },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  sectionHeader: { marginBottom: '30px', borderLeft: '4px solid #d46a4e', paddingLeft: '15px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '30px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s'
  },
  imageContainer: { height: '320px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  cardInfo: { padding: '20px' },
  categoryBadge: { fontSize: '0.7rem', color: '#999', textTransform: 'uppercase' },
  prodName: { margin: '5px 0', fontSize: '1.1rem', color: '#333' },
  price: { fontSize: '1.2rem', fontWeight: 'bold', color: '#d46a4e' },
  addButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#2d3436',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  footer: { textAlign: 'center', padding: '40px', color: '#888', fontSize: '0.9rem' }
};
