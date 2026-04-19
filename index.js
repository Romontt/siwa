const { useState, useEffect } = React;

function App() {
    const [productos, setProductos] = useState([]);
    const [categoria, setCategoria] = useState('Todos');
    const [loading, setLoading] = useState(true);

    const _supabase = supabase.createClient(
        'https://hvnpkljyoocqdzwdptgt.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bnBrbGp5b29jcWR6d2RwdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTAxMTQsImV4cCI6MjA5MjE4NjExNH0.-pq3iVzqJsJCyGNXkFPlHSIQeBTrr7i7ptsY6FYjJZ0'
    );

    useEffect(() => {
        fetchData();
    }, [categoria]);

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
            <nav className="nav-container">
                <div className="logo">Doris</div>
                <div style={{fontSize: '0.7rem', letterSpacing: '3px'}}>COSTA RICA</div>
            </nav>

            <header className="hero">
                <div style={{overflow: 'hidden'}}>
                    <p style={{letterSpacing: '10px', fontSize: '0.6rem', marginBottom: '20px', color: '#0d211a'}}>NEW COLLECTION</p>
                    <h1>Boutique <i>Moderne</i></h1>
                </div>
            </header>

            <div className="filter-bar">
                {['Todos', 'Bebé', 'Niño', 'Niña', 'Hombre', 'Mujer'].map(cat => (
                    <button 
                        key={cat} 
                        className={`filter-btn ${categoria === cat ? 'active' : ''}`}
                        onClick={() => setCategoria(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <main className="main-content">
                {loading ? (
                    <p style={{textAlign: 'center', letterSpacing: '10px', marginTop: '100px'}}>ESPERE...</p>
                ) : (
                    <div className="product-grid">
                        {productos.map((p, index) => (
                            <article 
                                key={p.id} 
                                className="product-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="image-container">
                                    <img src={p.imagen_url} alt={p.nombre} />
                                </div>
                                <div className="product-info">
                                    <p style={{fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.5}}>{p.categoria.toUpperCase()}</p>
                                    <h3>{p.nombre}</h3>
                                    <div className="price">₡{p.precio.toLocaleString()}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <footer style={{padding: '150px 8% 50px', textAlign: 'center', borderTop: '1px solid #eee'}}>
                <div className="logo" style={{fontSize: '1.2rem', marginBottom: '30px'}}>Doris</div>
                <p style={{fontSize: '0.6rem', letterSpacing: '5px', opacity: 0.4}}>PRIVACIDAD / TÉRMINOS / 2026</p>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
