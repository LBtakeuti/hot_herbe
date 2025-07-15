'use client'
import { useState } from 'react'
import ShoppingCartIcon from './icons/ShoppingCartIcon'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <div className="flex items-center bg-white p-4 pb-2 justify-between">
      <h2 className="text-hot-herbe-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
        HOT HERBE
      </h2>
      <div className="flex w-12 items-center justify-end">
        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-hot-herbe-dark gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 relative">
          <ShoppingCartIcon />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-hot-herbe-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}