import { useEffect, useState } from 'react'

export default function Navbar({ onLoginClick, onLogout, user, onViewCart }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition ${scrolled ? 'backdrop-blur bg-white/70 shadow' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">ElectroVibe</a>
        <nav className="flex items-center gap-3">
          <button onClick={onViewCart} className="px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200">Cart</button>
          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi, {user.name}</span>
              <button onClick={onLogout} className="px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700">Logout</button>
            </>
          ) : (
            <button onClick={onLoginClick} className="px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700">Login</button>
          )}
        </nav>
      </div>
    </header>
  )
}
