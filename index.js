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
                <div className="logo">LA TIENDITA DE DORIS</div>
            </nav>

            <header className="hero">
                <div style={{maxWidth: '600px', margin: '0 auto'}}>
                    <h1 style={{fontSize: '3rem', margin: '0'}}>Selección Premium</h1>
                    <p style={{opacity: 0.9}}>Moda americana curada con elegancia en Guápiles.</p>
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
                    <p style={{textAlign: 'center'}}>Cargando galería...</p>
                ) : (
                    <div className="product-grid">
                        {productos.map(p => (
                            <article key={p.id} className="product-card">
                                <div className="image-container">
                                    <img src={p.imagen_url} alt={p.nombre} />
                                    <div className="badge-cat">{p.categoria}</div>
                                </div>
                                <div className="card-content">
                                    <h3>{p.nombre}</h3>
                                    <div className="price-tag">₡{p.precio.toLocaleString()}</div>
                                    <button className="btn-detalles">Ver más información</button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <footer style={{padding: '50px', background: '#0a192f', color: 'white', textAlign: 'center'}}>
                <p>La Tiendita de Doris © 2026</p>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
