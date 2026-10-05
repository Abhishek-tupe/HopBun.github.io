'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ChefHat, Check, Clock3, Coffee, Minus, Plus, ReceiptText, ShoppingBag, Sparkles, UtensilsCrossed, X } from 'lucide-react'

type Category = 'Coffee & Beverages' | 'Bakery & Pastry' | 'Hot Meals' | 'Desserts'
type MenuItem = { id: string; name: string; description: string; price: number; category: Category; image: string }
type CartItem = MenuItem & { quantity: number }
type Order = { id: string; table: string; items: CartItem[]; total: number; createdAt: number; status: 'pending' | 'preparing' | 'ready' | 'paid' }

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`
const menu: MenuItem[] = [
  { id: 'espresso', name: 'House Espresso', description: 'Double shot, rich crema, roasted daily.', price: 3.5, category: 'Coffee & Beverages', image: '/house-espresso.png' },
  { id: 'latte', name: 'Velvet Latte', description: 'Silky steamed milk with house espresso.', price: 5.25, category: 'Coffee & Beverages', image: image('photo-1541167760496-1628856ab772') },
  { id: 'matcha', name: 'Ceremonial Matcha', description: 'Bright, smooth matcha whisked with oat milk.', price: 5.75, category: 'Coffee & Beverages', image: image('photo-1536256263959-770b48d82b0a') },
  { id: 'chai', name: 'Spiced Chai', description: 'Black tea, warming spices, and steamed milk.', price: 4.95, category: 'Coffee & Beverages', image: image('photo-1571934811356-5cc061b6821f') },
  { id: 'coldbrew', name: 'Vanilla Cold Brew', description: 'Slow-steeped coffee with vanilla cloud.', price: 5.5, category: 'Coffee & Beverages', image: image('photo-1517701604599-bb29b565090c') },
  { id: 'lemonade', name: 'Garden Lemonade', description: 'Fresh lemon, mint, and a touch of honey.', price: 4.25, category: 'Coffee & Beverages', image: image('photo-1621263764928-df1444c5e859') },
  { id: 'tea', name: 'Jasmine Green Tea', description: 'Fragrant whole leaf tea, served warm.', price: 3.95, category: 'Coffee & Beverages', image: image('photo-1544787219-7f47ccb76574') },
  { id: 'croissant', name: 'Butter Croissant', description: 'Classic French layers, baked until golden.', price: 4.25, category: 'Bakery & Pastry', image: image('photo-1555507036-ab1f4038808a') },
  { id: 'cinnamon', name: 'Cinnamon Morning Bun', description: 'Flaky pastry with cinnamon sugar swirl.', price: 4.75, category: 'Bakery & Pastry', image: image('photo-1509440159596-0249088772ff') },
  { id: 'scone', name: 'Berry Cream Scone', description: 'Buttery scone with seasonal berries.', price: 4.5, category: 'Bakery & Pastry', image: image('photo-1519869325930-281384150729') },
  { id: 'banana', name: 'Banana Walnut Loaf', description: 'Moist banana bread, toasted walnuts.', price: 4.95, category: 'Bakery & Pastry', image: '/banana-walnut-loaf.png' },
  { id: 'almond', name: 'Almond Financier', description: 'Tender almond cake with brown butter.', price: 3.95, category: 'Bakery & Pastry', image: '/almond-financier.png' },
  { id: 'muffin', name: 'Blueberry Muffin', description: 'Plump blueberries, crunchy sugar top.', price: 4.25, category: 'Bakery & Pastry', image: image('photo-1607958996333-41aef7caefaa') },
  { id: 'danish', name: 'Apple Cardamom Danish', description: 'Roasted apple, cardamom, and vanilla glaze.', price: 5.25, category: 'Bakery & Pastry', image: image('photo-1623334044303-241021148842') },
  { id: 'toast', name: 'Avocado Garden Toast', description: 'Sourdough, smashed avocado, herbs, chili.', price: 10.5, category: 'Hot Meals', image: image('photo-1541519227354-08fa5d50c44d') },
  { id: 'shakshuka', name: 'Morning Shakshuka', description: 'Baked eggs, tomato, peppers, warm pita.', price: 13.5, category: 'Hot Meals', image: image('photo-1590412200988-a436970781fa') },
  { id: 'sandwich', name: 'Roast Chicken Melt', description: 'Herb chicken, fontina, greens, sourdough.', price: 14.25, category: 'Hot Meals', image: image('photo-1528735602780-2552fd46c7af') },
  { id: 'pasta', name: 'Wild Mushroom Pasta', description: 'Creamy parmesan sauce and garden herbs.', price: 15.5, category: 'Hot Meals', image: image('photo-1473093295043-cdd812d0e601') },
  { id: 'grain', name: 'Golden Grain Bowl', description: 'Roasted vegetables, grains, tahini, greens.', price: 13.75, category: 'Hot Meals', image: image('photo-1512621776951-a57141f2eefd') },
  { id: 'soup', name: 'Tomato Basil Soup', description: 'Slow simmered tomatoes, basil oil, toast.', price: 9.25, category: 'Hot Meals', image: image('photo-1547592180-85f173990554') },
  { id: 'quiche', name: 'Market Vegetable Quiche', description: 'Flaky crust, roasted vegetables, gruyere.', price: 12.5, category: 'Hot Meals', image: image('photo-1601050690597-df0568f70950') },
  { id: 'tiramisu', name: 'Cloud Tiramisu', description: 'Espresso-soaked sponge, mascarpone cream.', price: 7.5, category: 'Desserts', image: image('photo-1571877227200-a0d98ea607e9') },
  { id: 'cake', name: 'Lemon Olive Oil Cake', description: 'Bright citrus cake with whipped cream.', price: 6.75, category: 'Desserts', image: image('photo-1519915028121-7d3463d20b13') },
  { id: 'choc', name: 'Dark Chocolate Tart', description: 'Silky dark chocolate in a crisp shell.', price: 7.25, category: 'Desserts', image: image('photo-1571115177098-24ec42ed204d') },
  { id: 'panna', name: 'Vanilla Panna Cotta', description: 'Soft vanilla custard with berry compote.', price: 6.95, category: 'Desserts', image: image('photo-1488477181946-6428a0291777') },
  { id: 'cookie', name: 'Sea Salt Cookie', description: 'Warm brown butter cookie, flaky salt.', price: 3.75, category: 'Desserts', image: image('photo-1499636136210-6f4ee915583e') },
  { id: 'affogato', name: 'Espresso Affogato', description: 'Vanilla gelato drowned in espresso.', price: 6.5, category: 'Desserts', image: image('photo-1579954115545-a95591f28bfc') },
  { id: 'parfait', name: 'Berry Yogurt Parfait', description: 'Greek yogurt, berries, honey granola.', price: 6.25, category: 'Desserts', image: image('photo-1488477181946-6428a0291777') },
]
const categories: Category[] = ['Coffee & Beverages', 'Bakery & Pastry', 'Hot Meals', 'Desserts']
const money = (value: number) => `$${value.toFixed(2)}`

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}><div className="logo-orbit"><img src="/bunny-logo.png" alt="Fluffy bunny holding a carrot" /></div><div><strong>HOP &amp; BUN</strong><span>cafe &amp; kitchen</span></div></div>
}

export default function Page() {
  const [view, setView] = useState<'menu' | 'operator'>('menu')
  const [activeCategory, setActiveCategory] = useState<Category>('Coffee & Beverages')
  const [cart, setCart] = useState<CartItem[]>([])
  const [table, setTable] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [showCart, setShowCart] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const sync = () => { try { setOrders(JSON.parse(localStorage.getItem('hopbun-orders') || '[]')) } catch {} }
    sync(); window.addEventListener('storage', sync); const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => { window.removeEventListener('storage', sync); window.clearInterval(interval) }
  }, [])
  useEffect(() => { if (view === 'operator') { try { setOrders(JSON.parse(localStorage.getItem('hopbun-orders') || '[]')) } catch {} } }, [view])
  const filtered = useMemo(() => menu.filter(item => item.category === activeCategory), [activeCategory])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const add = (item: MenuItem) => setCart(current => current.some(x => x.id === item.id) ? current.map(x => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x) : [...current, { ...item, quantity: 1 }])
  const change = (id: string, amount: number) => setCart(current => current.flatMap(item => item.id === id ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item]))
  const placeOrder = () => { if (!table || !cart.length) return; const order: Order = { id: crypto.randomUUID(), table, items: cart, total, createdAt: Date.now(), status: 'pending' }; const next = [order, ...orders]; setOrders(next); localStorage.setItem('hopbun-orders', JSON.stringify(next)); setCart([]); setTable(''); setPlaced(true); setShowCart(false) }
  const updateOrder = (id: string, status: Order['status']) => { const next = orders.map(order => order.id === id ? { ...order, status } : order); setOrders(next); localStorage.setItem('hopbun-orders', JSON.stringify(next)) }
  const elapsed = (date: number) => { const seconds = Math.max(0, Math.floor((now - date) / 1000)); return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` }
  const urgency = (date: number) => (now - date > 600000 ? 'critical' : now - date > 300000 ? 'delayed' : 'fresh')

  return <div className="site-shell">
    <header className="topbar"><Logo /><nav className="main-nav" aria-label="Main navigation"><button className={view === 'menu' ? 'active' : ''} onClick={() => setView('menu')}><UtensilsCrossed size={16} /> Menu</button><button className={view === 'operator' ? 'active' : ''} onClick={() => setView('operator')}><ChefHat size={16} /> Kitchen dashboard <span className="live-dot" /></button></nav><div className="header-actions"><span className="open-pill"><span className="green-dot" /> Open today · 7am–9pm</span>{view === 'menu' && <button className="header-cart" onClick={() => setShowCart(true)}><ShoppingBag size={18} /> <span>{cartCount}</span></button>}</div></header>
    {view === 'menu' ? <main className="menu-page"><section className="hero"><div><p className="eyebrow"><Sparkles size={15} /> made fresh, made happy</p><h1>A little <em>hop</em> of joy<br />in every bite.</h1><p className="hero-copy">Thoughtfully crafted coffee, comforting plates, and sweet moments — made for slow mornings and good company.</p><button className="scroll-button" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>Explore the menu <ArrowRight size={17} /></button></div><div className="hero-art"><div className="sunburst" /><img src="/bunny-logo.png" alt="White bunny mascot with a carrot" /><span className="art-note note-one">freshly<br />baked</span><span className="art-note note-two">always<br />warm</span></div></section><section className="menu-section" id="menu"><div className="section-heading"><div><p className="eyebrow">what are you craving?</p><h2>Find your favorite.</h2></div><p className="section-note">Everything is prepared to order.<br />Take your time, we&apos;ll be here.</p></div><div className="category-tabs" role="tablist">{categories.map(category => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="menu-grid">{filtered.map(item => <article className="menu-card" key={item.id}><div className="item-image"><img src={item.image} alt={item.name} loading="lazy" /><span className="image-tag">{item.category === 'Coffee & Beverages' ? 'bar favorite' : item.category === 'Desserts' ? 'sweet thing' : 'house made'}</span></div><div className="item-body"><div><h3>{item.name}</h3><p>{item.description}</p></div><div className="item-footer"><strong>{money(item.price)}</strong><button aria-label={`Add ${item.name} to cart`} onClick={() => add(item)}><Plus size={18} /></button></div></div></article>)}</div></section></main> : <main className="operator-page"><div className="operator-heading"><div><p className="eyebrow"><ChefHat size={15} /> front of house</p><h1>Kitchen dashboard</h1><p>Keep the good stuff moving.</p></div><div className="operator-stats"><div><strong>{orders.filter(o => o.status !== 'paid').length}</strong><span>active orders</span></div><div><strong>{orders.filter(o => o.status === 'ready').length}</strong><span>ready to serve</span></div></div></div><div className="status-key"><span><i className="key-fresh" /> Fresh</span><span><i className="key-delayed" /> Delayed</span><span><i className="key-critical" /> Overdue</span></div>{orders.length === 0 ? <div className="empty-state"><ReceiptText size={42} /><h2>No orders yet</h2><p>Orders placed from the menu will appear here in real time.</p><button onClick={() => setView('menu')}>View customer menu</button></div> : <div className="orders-grid">{orders.map(order => <article key={order.id} className={`order-card ${order.status === 'paid' ? 'paid' : urgency(order.createdAt)}`}><div className="order-top"><div><span className="table-label">{order.table}</span><span className={`status-badge ${order.status}`}>{order.status === 'pending' ? 'New order' : order.status}</span></div><div className="timer"><Clock3 size={15} /> {order.status === 'paid' ? 'cleared' : elapsed(order.createdAt)}</div></div><div className="order-items">{order.items.map(item => <div key={item.id}><span><b>{item.quantity}×</b> {item.name}</span><span>{money(item.price * item.quantity)}</span></div>)}</div><div className="order-bottom"><strong>{money(order.total)}</strong>{order.status !== 'paid' && <div className="order-actions">{order.status === 'pending' && <button onClick={() => updateOrder(order.id, 'preparing')}>Mark preparing</button>}{order.status === 'preparing' && <button onClick={() => updateOrder(order.id, 'ready')}>Mark ready</button>}<button className="clear-button" onClick={() => updateOrder(order.id, 'paid')}><Check size={14} /> Pay &amp; clear</button></div>}</div></article>)}</div>}</main>}
    <footer className="footer"><Logo compact /><span>© 2026 Hop &amp; Bun Cafe</span><span>Scan. Order. Enjoy.</span></footer>
    {cartCount > 0 && view === 'menu' && <button className="floating-cart" onClick={() => setShowCart(true)}><span><ShoppingBag size={18} /> {cartCount} {cartCount === 1 ? 'item' : 'items'}</span><strong>{money(total)}</strong><ArrowRight size={18} /></button>}
    {showCart && <div className="modal-backdrop" onClick={() => setShowCart(false)}><aside className="cart-drawer" onClick={event => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">your order</p><h2>Ready when you are.</h2></div><button className="close-button" onClick={() => setShowCart(false)}><X size={20} /></button></div>{cart.length === 0 ? <p>Your cart is waiting for something delicious.</p> : <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{money(item.price)}</span><div className="quantity"><button onClick={() => change(item.id, -1)}><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => change(item.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><label className="table-label-input">Table number<input value={table} onChange={event => setTable(event.target.value)} placeholder="e.g. Table 4" /></label><div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="place-button" disabled={!table} onClick={placeOrder}>Place order <ArrowRight size={17} /></button></>}</aside></div>}
    {placed && <div className="modal-backdrop" onClick={() => setPlaced(false)}><div className="success-modal" onClick={event => event.stopPropagation()}><div className="success-icon"><Check size={28} /></div><p className="eyebrow">you&apos;re all set</p><h2>Order placed successfully!</h2><p>Kitchen is preparing your food. Keep an eye out — we&apos;ll bring the good stuff to your table.</p><button onClick={() => setPlaced(false)}>Back to menu</button></div></div>}
  </div>
}
