'use client'
import Link from 'next/link'

interface PricingCardProps {
  title: string
  price: string
  save: string | null
  index: number
}

export default function PricingCard({ title, price, save, index }: PricingCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg border border-solid border-hot-herbe-border bg-white p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-hot-herbe-dark text-base font-bold leading-tight">{title}</h1>
          {save && (
            <p className="text-white text-xs font-medium leading-normal tracking-[0.015em] rounded-lg bg-hot-herbe-green px-3 py-[3px] text-center">
              {save}
            </p>
          )}
        </div>
        <span className="text-hot-herbe-dark text-4xl font-black leading-tight tracking-[-0.033em]">{price}</span>
      </div>
      <Link
        href={`/purchase?plan=${index}`}
        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-hot-herbe-bg text-hot-herbe-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-hot-herbe-green hover:text-white transition-colors"
      >
        <span className="truncate">購入する</span>
      </Link>
    </div>
  )
}