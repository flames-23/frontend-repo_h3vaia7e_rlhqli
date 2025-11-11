export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-white/60 backdrop-blur rounded-2xl shadow-sm border border-white/50 overflow-hidden hover:shadow-xl transition">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>
          <button onClick={()=>onAdd(product)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">Add</button>
        </div>
      </div>
    </div>
  )
}
