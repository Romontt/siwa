const { useState, useEffect } = React;

function App() {
    const [items, setItems] = useState([]);
    const [cat, setCat] = useState('Todos');

    const _supabase = supabase.createClient(
        'https://hvnpkljyoocqdzwdptgt.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bnBrbGp5b29jcWR6d2RwdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTAxMTQsImV4cCI6MjA5MjE4NjExNH0.-pq3iVzqJsJCyGNXkFPlHSIQeBTrr7i7ptsY6FYjJZ0'
    );

    useEffect(() => {
        const loadData = async () => {
            let q = _supabase.from('productos').select('*').eq('disponible', true);
            if (cat !== 'Todos') {
                q = q.eq('categoria', cat);
            } else {
                q = q.in('categoria', ['Bebé', 'Niño', 'Niña']);
            }
            const { data } = await q.order('created_at', { ascending: false });
            setItems(data || []);
        };
        loadData();
    }, [cat]);

    return (
        <div className={`app-container tema-${cat}`}>
            <nav className="nav-bar">
                <div className="sua-logo">SUA</div>
                <div className="nav-links">
                    {['Todos', 'Bebé', 'Niño', 'Niña'].map(c => (
                        <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>
                            {c}
                        </button>
                    ))}
                </div>
            </nav>

            <header className="hero">
                <small style={{letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.6}}>Est. 2026</small>
                <h1>{cat === 'Todos' ? 'Tesoro Infantil' : cat}</h1>
                <p style={{maxWidth: '500px', margin: '20px auto', opacity: 0.7}}>
                    Selección exclusiva de prendas importadas con la calidad que tu familia merece.
                </p>
            </header>

            <main className="grid">
                {items.map(item => (
                    <article key={item.id} className="card">
                        <img src={item.imagen_url} className="card-img" alt={item.nombre} />
                        <div className="card-info">
                            <h3>{item.nombre}</h3>
                            <div className="price-tag">₡{item.precio?.toLocaleString()}</div>
                            <button style={{
                                width: '100%', marginTop: '20px', padding: '12px',
                                background: 'var(--verde-sua)', color: 'white',
                                border: 'none', borderRadius: '30px', cursor: 'pointer'
                            }}>Consultar WhatsApp</button>
                        </div>
                    </article>
                ))}
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
