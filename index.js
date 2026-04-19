const { useState, useEffect } = React;

function App() {
    const [productos, setProductos] = useState([]);
    const [categoria, setCategoria] = useState('Todos');
    const [loading, setLoading] = useState(true);

    // Configuración de Supabase extraída de tus credenciales actuales
    const SUPABASE_URL = 'https://hvnpkljyoocqdzwdptgt.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bnBrbGp5b29jcWR6d2RwdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTAxMTQsImV4cCI6MjA5MjE4NjExNH0.-pq3iVzqJsJCyGNXkFPlHSIQeBTrr7i7ptsY6FYjJZ0';
    
    // Inicialización del cliente usando la librería global cargada en el HTML
    const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    useEffect(() => {
        fetchData();
    }, [categoria]);

    async function fetchData() {
        setLoading(true);
        try {
            // Consulta base: solo productos disponibles
            let q = _supabase
                .from('productos')
                .select('*')
                .eq('disponible', true);

            // Aplicar filtro si no es "Todos"
            if (categoria !== 'Todos') {
                q = q.eq('categoria', categoria);
            }
            
            // Ordenar por los más recientes
            const { data, error } = await q.order('created_at', { ascending: false });
            
            if (error) throw error;
            setProductos(data || []);
            
        } catch (err) {
            console.error("Error al conectar con Supabase:", err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Navegación Fija */}
            <nav className="nav-container">
                <a href="#" className="logo">DORIS</a>
                <div className="nav-links">
                    {['Todos', 'Bebé', 'Niño', 'Niña', 'Hombre', 'Mujer'].map(cat => (
                        <button 
                            key={cat} 
                            className={`filter-btn ${categoria === cat ? 'active' : ''}`}
                            onClick={() => setCategoria(cat)}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Cabecera Estilo Editorial */}
            <header className="hero">
                <div className="hero-content">
                    <span>EST. 2026</span>
                    <h1>Elegancia <br/><i>Reencontrada</i></h1>
                </div>
            </header>

            {/* Contenedor de Productos */}
            <main className="main-content">
                {loading ? (
                    <div style={{textAlign: 'center', padding: '100px 0'}}>
                        <p style={{letterSpacing: '5px', fontSize: '0.8rem', opacity: 0.6}}>
                            CURANDO SELECCIÓN...
                        </p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {productos.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5 }}>
                                No hay piezas disponibles en esta categoría por ahora.
                            </p>
                        ) : (
                            productos.map((p, i) => (
                                <article 
                                    key={p.id} 
                                    className="product-card" 
                                    /* El efecto asimétrico: las tarjetas impares se desplazan hacia abajo */
                                    style={{ transform: i % 2 !== 0 ? 'translateY(60px)' : 'none' }}
                                >
                                    <span className="category-tag">{p.categoria}</span>
                                    
                                    <div className="image-box">
                                        <img 
                                            src={p.imagen_url} 
                                            alt={p.nombre} 
                                            loading="lazy" 
                                        />
                                    </div>

                                    <div className="card-meta">
                                        <div>
                                            <h3>{p.nombre}</h3>
                                            <p>PIEZA ÚNICA</p>
                                        </div>
                                        <span className="card-price">
                                            ₡{p.precio ? p.precio.toLocaleString() : '0'}
                                        </span>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Pie de página elegante */}
            <footer className="footer">
                <h2>DORIS</h2>
                <p>GUÁPILES, COSTA RICA</p>
            </footer>
        </div>
    );
}

// Renderizado final para React 18 en el navegador
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
