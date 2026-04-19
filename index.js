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
    <div style={styles.pageWrapper}>
      {/* 1. TEXTURA DE FONDO GLOBAL (Profundidad) */}
      <div style={styles.backgroundTexture}></div>

      {/* --- 2. HERO SECTION INMERSIVO (Capa Superior) --- */}
      <header style={styles.hero}>
        {/* Imagen de fondo del Hero con superposición oscura */}
        <div style={styles.heroBgOverlay}></div>
        {/* Imagen de muestra de Doris o la tienda (Reemplaza con URL real) */}
        <img 
          src="https://images.unsplash.com/photo-1520004434532-6684164f378d?q=80&w=2070" 
          alt="La tienda de Doris" 
          style={styles.heroBgImage} 
        />
        
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Tesorería Pre-Amada</div>
          <h1 style={styles.heroTitle}>The<br/>Heritage<br/><i>Archive</i></h1>
          <div style={styles.heroDivider}></div>
          <p style={styles.heroSubtitle}>Una curaduría de ropa americana seleccionada pieza por pieza con alma y pasado.</p>
        </div>
      </header>

      {/* --- 3. NAVBAR STICKY CON EFECTO VIDRIO --- */}
      <nav style={styles.nav}>
        <div style={styles.logo}>DORIS.</div>
        <div style={styles.menu}>
          {categorias.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategoriaActual(cat)}
              style={{
                ...styles.navButton,
                opacity: categoriaActual === cat ? 1 : 0.5,
                borderBottom: categoriaActual === cat ? '1px solid #d46a4e' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* --- 4. SECCIÓN DESTACADA (Corta la monotonía) --- */}
      <section style={styles.featuredSection}>
        <div style={styles.featuredContent}>
          <span style={styles.featuredLabel}>Exclusividad</span>
          <h2 style={styles.featuredTitle}>Cada prenda tiene una historia única.</h2>
          <p style={styles.featuredText}>No traemos múltiples unidades. Solo lo mejor de la ropa americana, curada especialmente para ti.</p>
        </div>
        {/* Espacio para una imagen destacada o textura */}
        <div style={styles.featuredImagePlace}></div>
      </section>

      {/* --- 5. GRID DE PRODUCTOS (Estilo Galería) --- */}
      <main style={styles.main}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.categoryTitle}>{categoriaActual}</h2>
          <p style={styles.countText}>{productos.length} piezas encontradas</p>
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
                  marginTop: index % 2 !== 0 ? '80px' : '0px' // EFECTO ASIMÉTRICO
                }}
              >
                <div style={styles.imageWrapper}>
                  <img src={prod.imagen_url} alt={prod.nombre} style={styles.image} />
                  {/* Superposición sutil en hover */}
                  <div style={styles.imageOverlay}></div>
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

      {/* --- 6. FOOTER CON PROFUNDIDAD --- */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>GUÁPILES • LIMÓN • COSTA RICA</p>
        <p style={styles.footerSub}>Abierto de Lunes a Sábado</p>
        <div style={styles.footerDivider}></div>
        <small>© 2026 La Americana de Doris. Piezas con propósito.</small>
      </footer>
    </div>
  );
}

// --- ESTILOS INMERSIVOS (Capa sobre Capa) ---
const styles = {
  pageWrapper: {
    backgroundColor: '#faf9f6', // Crema ultra-suave
    minHeight: '100vh',
    fontFamily: '"Montserrat", sans-serif',
    color: '#000',
    position: 'relative' // Para texturas
  },
  backgroundTexture: {
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")', // Textura de papel
    opacity: 0.3,
    zIndex: 0,
    pointerEvents: 'none'
  },
  hero: {
    height: '100vh', // Ocupa toda la pantalla
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    zIndex: 1
  },
  heroBgImage: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    objectFit: 'cover',
    zIndex: -2
  },
  heroBgOverlay: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(212, 106, 78, 0.5)', // Terracota traslúcido
    zIndex: -1
  },
  heroContent: {
    maxWidth: '800px',
    padding: '0 40px',
    zIndex: 2
  },
  heroBadge: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '5px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '10px 20px',
    borderRadius: '30px',
    marginBottom: '30px',
    display: 'inline-block'
  },
  heroTitle: {
    fontSize: '6rem', // Gigante y editorial
    fontFamily: '"Playfair Display", serif',
    fontWeight: '400',
    lineHeight: '0.9',
    margin: 0
  },
  heroDivider: {
    width: '60px',
    height: '2px',
    backgroundColor: '#fff',
    margin: '40px auto'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    fontWeight: '300',
    marginTop: '20px',
    letterSpacing: '1px',
    lineHeight: '1.6',
    opacity: 0.8
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px',
    backgroundColor: 'rgba(250, 249, 246, 0.9)', // Efecto vidrio empañado
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: '400',
    letterSpacing: '5px',
    fontFamily: '"Playfair Display", serif'
  },
  menu: {
    display: 'flex',
    gap: '30px'
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
  featuredSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '150px 10%',
    backgroundColor: '#fff',
    gap: '60px',
    alignItems: 'center',
    zIndex: 1,
    position: 'relative'
  },
  featuredContent: {
    textAlign: 'left'
  },
  featuredLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '5px',
    color: '#d46a4e',
    marginBottom: '20px',
    display: 'block'
  },
  featuredTitle: {
    fontSize: '3rem',
    fontFamily: '"Playfair Display", serif',
    fontWeight: '400',
    lineHeight: '1.1',
    margin: 0
  },
  featuredText: {
    fontSize: '1rem',
    fontWeight: '300',
    color: '#666',
    marginTop: '30px',
    lineHeight: '1.8'
  },
  featuredImagePlace: {
    height: '500px',
    backgroundColor: '#d46a4e', // Terracota sólido o textura
    opacity: 0.1,
    border: '1px solid #d46a4e'
  },
  main: { 
    maxWidth: '1600px', 
    margin: '0 auto', 
    padding: '100px 60px 150px 60px',
    position: 'relative',
    zIndex: 1
  },
  sectionHeader: { 
    textAlign: 'left',
    marginBottom: '100px',
    borderLeft: '2px solid #d46a4e',
    paddingLeft: '20px'
  },
  categoryTitle: {
    fontSize: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '8px',
    fontWeight: '300',
    margin: 0
  },
  countText: {
    fontSize: '0.8rem',
    opacity: 0.5,
    marginTop: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Solo 2 columnas
    gap: '60px'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    transition: '0.5s ease',
    position: 'relative',
    zIndex: 1
  },
  imageWrapper: {
    aspectRatio: '2/3',
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #f0f0f0', // Borde sutil
    boxShadow: '0 10px 30px rgba(0,0,0,0.02)' // Sombra muy suave
  },
  image: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
    transition: 'transform 1s ease'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)', // Superposición sutil en hover
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  cardInfo: { 
    padding: '30px 0 0 0',
  },
  prodName: { 
    margin: '0 0 12px 0', 
    fontSize: '1.4rem', 
    fontFamily: '"Playfair Display", serif',
    fontWeight: '400'
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: { 
    fontSize: '1rem', 
    fontWeight: '300', 
    letterSpacing: '2px',
    color: '#d46a4e'
  },
  minimalAdd: {
    background: 'none',
    border: '1px solid #1a1a1a',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: '0.3s'
  },
  footer: { 
    padding: '120px 20px', 
    textAlign: 'center',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    zIndex: 1,
    position: 'relative'
  },
  footerText: { 
    fontSize: '0.8rem', 
    letterSpacing: '6px', 
    fontWeight: '600'
  },
  footerSub: {
    fontSize: '0.7rem',
    opacity: 0.5,
    marginTop: '10px'
  },
  footerDivider: {
    width: '40px',
    height: '1px',
    backgroundColor: '#d46a4e',
    margin: '40px auto'
  },
  loading: {
    textAlign: 'center',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    padding: '150px 0'
  }
};
