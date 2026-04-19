// Sacamos las funciones que ocupamos de las librerías globales
const { useState, useEffect } = React;

// CONFIGURACIÓN DE SUPABASE (Extraída de tu .env.local)
const SUPABASE_URL = 'https://hvnpkljyooqcdzwdptgt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc2MiOiJmcm9tLWJlbG93LXByb2R1Y3RzLSI1InJlZ3I1I2Imh2bnBkljyooqcdzwdptgt.eyJpZCI6Imh2bnBkljyooqcdzwdptgtLCJpYXQiOjE3M2E2MTM2MjA1MjE4LCJleHAiOjIxNDI3MTA1MjE4fQ.-pq3iVzqjsJCyGNXkFP1HSIQEBTtr7i7ptsY6FYjJZ0';

// Inicializamos el cliente
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function App() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('Todos');
  const [cargando, setCargando] = useState(true);

  const categorias = ['Todos', 'Bebé', 'Niño', 'Niña', 'Hombre', 'Mujer'];

  useEffect(() => {
    fetchProductos();
  }, [categoria]);

  async function fetchProductos() {
    setCargando(true);
    try {
      // Intento de conexión a tu tabla 'productos'
      let query = _supabase
        .from('productos')
        .select('*')
        .eq('disponible', true);

      if (categoria !== 'Todos') {
        query = query.eq('categoria', categoria);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setProductos(data || []);
      
    } catch (err) {
      console.error("Error al conectar con Supabase:", err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="boutique-wrapper">
      <nav className="nav-container">
        <div className="logo">DORIS.</div>
        <div className="nav-menu">
          {categorias.map(cat => (
            <button 
              key={cat} 
              className={`btn-cat ${categoria === cat ? 'active' : ''}`}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="hero-label">Curaduría Americana</p>
          <h1>Tesoros con <br/><i>Pasado</i></h1>
          <div className="hero-accent"></div>
        </div>
      </header>

      <main className="main-content">
        {cargando ? (
          <div className="loader">Buscando en el archivo...</div>
        ) : (
          <div className="product-grid">
            {productos.length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5 }}>
                No hay piezas disponibles en esta categoría por ahora.
              </p>
            ) : (
              productos.map((p, index) => (
                <article 
                  key={p.id} 
                  className="product-card" 
                  style={{ marginTop: index % 2 !== 0 ? '60px' : '0' }}
                >
                  <div className="image-wrapper">
                    <img src={p.imagen_url} alt={p.nombre} />
                    <span className="card-badge">{p.categoria}</span>
                  </div>
                  <div className="card-info">
                    <h3>{p.nombre}</h3>
                    <p className="price">₡{p.precio ? p.precio.toLocaleString() : '0'}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Renderizado final para navegador usando ReactDOM global
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
