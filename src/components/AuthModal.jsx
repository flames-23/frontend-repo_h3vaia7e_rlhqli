import { useState } from 'react'

export default function AuthModal({ open, onClose, onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/signup'
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onAuthenticated(data.user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
          <h2 className="text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="text-white/90">Access your cart and checkout</p>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-semibold transition">
            {loading ? 'Please wait...' : (mode === 'login' ? 'Log in' : 'Sign up')}
          </button>
          <p className="text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>Don't have an account? <button type="button" onClick={()=>setMode('signup')} className="text-indigo-600 font-medium">Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={()=>setMode('login')} className="text-indigo-600 font-medium">Log in</button></>
            )}
          </p>
          <button type="button" onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg py-2 font-semibold">Cancel</button>
        </form>
      </div>
    </div>
  )
}
