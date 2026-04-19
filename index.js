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
    <div style={styles.pageWrapper}>
      
      {/* --- NAV MINIMALISTA --- */}
      <nav style={styles.nav}>
        <div style={styles.logo}>DORIS.</div>
        <div style={styles.menu}>
          {categorias.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategoriaActual(cat)}
              style={{
                ...styles.navButton,
                opacity: categoriaActual === cat ? 1 : 0.4,
                borderBottom: categoriaActual === cat ? '1px solid #1a1a1a' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* --- HERO EDITORIAL --- */}
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroLabel}>Edición Limitada</span>
          <h1 style={styles.heroTitle}>The Heritage <br/><i>Collection</i></h1>
          <p style={styles.heroSubtitle}>Curaduría de ropa americana con alma y pasado.</p>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main style={styles.main}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.categoryTitle}>{categoriaActual}</h2>
          <p style={styles.countText}>{productos.length} piezas seleccionadas</p>
        </div>

        {cargando ? (
          <p style={styles.loading}>Explorando archivo...</p>
        ) : (
          <div style={styles.grid}>
            {productos.map((prod, index) => (
              <div 
                key={prod.id} 
                style={{
                  ...styles.card,
                  marginTop: index % 2 !== 0 ? '80px' : '0px' // ESTO CREA EL EFECTO ASIMÉTRICO
                }}
              >
                <div style={styles.imageWrapper}>
                  <img src={prod.imagen_url} alt={prod.nombre} style={styles.image} />
                </div>
                <div style={styles.cardInfo}>
                  <h3 style={styles.prodName}>{prod.nombre}</h3>
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>₡{prod.precio.toLocaleString()}</span>
                    <button style={styles.minimalAdd}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>GUÁPILES • COSTA RICA</p>
      </footer>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#1a1a1a',
    fontFamily: '"Montserrat", sans-serif'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '2rem',
    fontWeight: '400',
    letterSpacing: '8px',
    marginBottom: '30px',
    fontFamily: '"Playfair Display", serif'
  },
  menu: {
    display: 'flex',
    gap: '40px',
    justifyContent: 'center'
  },
  navButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    padding: '10px 0',
    transition: '0.4s'
  },
  hero: {
    padding: '100px 20px',
    textAlign: 'center',
    maxWidth: '900px',
    margin: '0 auto'
  },
  heroLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '5px',
    color: '#d46a4e',
    marginBottom: '20px',
    display: 'block'
  },
  heroTitle: {
    fontSize: '5rem',
    fontFamily: '"Playfair Display", serif',
    fontWeight: '400',
    lineHeight: '0.9',
    margin: 0
  },
  heroSubtitle: {
    fontSize: '1rem',
    fontWeight: '300',
    marginTop: '30px',
    letterSpacing: '1px',
    opacity: 0.6
  },
  main: { 
    maxWidth: '1400px', 
    margin: '0 auto', 
    padding: '0 60px 150px 60px' 
  },
  sectionHeader: { 
    textAlign: 'center',
    marginBottom: '80px'
  },
  categoryTitle: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '10px',
    fontWeight: '300'
  },
  countText: {
    fontSize: '0.7rem',
    opacity: 0.4,
    marginTop: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // SOLO 2 COLUMNAS PARA MÁS EXCLUSIVIDAD
    gap: '40px'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    transition: '0.5s ease'
  },
  imageWrapper: {
    aspectRatio: '2/3',
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
    position: 'relative'
  },
  image: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  cardInfo: { 
    padding: '25px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  prodName: { 
    margin: '0 0 10px 0', 
    fontSize: '1.2rem', 
    fontFamily: '"Playfair Display", serif',
    fontWeight: '400'
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: { 
    fontSize: '0.85rem', 
    fontWeight: '300', 
    letterSpacing: '2px' 
  },
  minimalAdd: {
    background: 'none',
    border: '1px solid #1a1a1a',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: { 
    padding: '100px 20px', 
    textAlign: 'center',
    borderTop: '1px solid #f0f0f0'
  },
  footerText: { 
    fontSize: '0.7rem', 
    letterSpacing: '6px', 
    opacity: 0.5 
  },
  loading: {
    textAlign: 'center',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    padding: '100px 0'
  }
};
