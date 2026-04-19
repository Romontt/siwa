const { useState, useEffect } = React;

function App() {
    const [productos, setProductos] = useState([]);
    const [categoria, setCategoria] = useState('Todos');
    const [loading, setLoading] = useState(true);

    const _supabase = supabase.createClient(
        'https://hvnpkljyoocqdzwdptgt.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bnBrbGp5b29jcWR6d2RwdGd0Iiwicm9sZSI6Imh2bnBrbGp5b29jcWR6d2RwdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTAxMTQsImV4cCI6MjA5MjE4NjExNH0.-pq3iVzqJsJCyGNXkFPlHSIQeBTrr7i7ptsY6FYjJZ0'
    );

    useEffect(() => { fetchData(); }, [categoria]);

    async function fetchData() {
        setLoading(true);
        let q = _supabase.from('productos').select('*').eq('disponible', true);
        if (categoria !== 'Todos') q = q.eq('categoria', categoria);
        const { data } = await q.order('created_at', { ascending: false });
        setProductos(data || []);
        setLoading(false);
    }

    return (
        <div>
            {/* Nav Lateral Estilo Boutique Europa */}
            <nav className="nav-container">
                <div className="logo-vertical">Doris Boutique</div>
                <div style={{fontSize: '0.6rem', opacity: 0.5}}>© 2026</div>
            </nav>

            {/* Filtros en la parte superior derecha */}
            <div className="filters">
                {['Todos', 'Bebé', 'Niño', 'Niña', 'Hombre', 'Mujer'].map(cat => (
                    <button 
                        key={cat} 
                        className={`filter-item ${categoria === cat ? 'active' : ''}`}
                        onClick={() => setCategoria(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <main className="main-wrapper">
                {loading ? (
                    <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <p style={{letterSpacing: '10px'}}>CARGANDO EXPERIENCIA...</p>
                    </div>
                ) : (
                    productos.map((p, index) => (
                        <section 
                            key={p.id} 
                            className="product-section"
                            style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
                        >
                            <div className="image-half">
                                <img src={p.imagen_url} alt={p.nombre} />
                            </div>
                            <div className="content-half">
                                <span className="cat-label">{p.categoria}</span>
                                <h2 className="product-title">{p.nombre}</h2>
                                <div className="price-box">
                                    ₡{p.precio.toLocaleString()}
                                </div>
                                <button style={{
                                    marginTop: '50px', 
                                    padding: '15px 30px', 
                                    background: 'var(--verde-boutique)', 
                                    color: 'white', 
                                    border: 'none',
                                    letterSpacing: '3px',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    width: 'fit-content'
                                }}>
                                    CONSULTAR PIEZA
                                </button>
                            </div>
                        </section>
                    ))
                )}
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
