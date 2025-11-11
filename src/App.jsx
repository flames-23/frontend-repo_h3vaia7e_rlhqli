import { useEffect, useMemo, useState } from 'react'
import AuthModal from './components/AuthModal'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
    fetchProducts()
    if (savedUser) fetchCart()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/products`)
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const res = await fetch(`${baseUrl}/api/cart`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setCart(await res.json())
    } catch (e) { console.error(e) }
  }

  const onAdd = async (product) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      })
      if (res.ok) {
        await fetchCart()
      }
    } catch (e) { console.error(e) }
  }

  const onAuthenticated = (u) => {
    setUser(u)
    fetchCart()
  }

  const onLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${baseUrl}/api/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCart([])
  }

  const total = useMemo(()=>cart.reduce((sum, item)=>sum + item.product.price * item.quantity, 0), [cart])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <Navbar onLoginClick={()=>setShowAuth(true)} onLogout={onLogout} user={user} onViewCart={()=>document.getElementById('cart-drawer').showModal()} />
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        <section className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">ElectroVibe Gadgets</h1>
          <p className="mt-3 text-gray-600">Discover curated electronics with a smooth shopping experience.</p>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="h-72 rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
          </div>
        )}
      </main>

      <dialog id="cart-drawer" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-xl mb-4">Your Cart</h3>
          {user ? (
            cart.length ? (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <img src={item.product.image} className="w-16 h-16 rounded object-cover" />
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-gray-600">Total</p>
                  <p className="text-xl font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Your cart is empty.</p>
            )
          ) : (
            <p className="text-gray-600">Please log in to view your cart.</p>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <AuthModal open={showAuth} onClose={()=>setShowAuth(false)} onAuthenticated={onAuthenticated} />
    </div>
  )
}

export default App
