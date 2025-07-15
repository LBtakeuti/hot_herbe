'use client'
import { useState } from 'react'
import CaretDownIcon from './icons/CaretDownIcon'

interface FAQItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export default function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <details 
      className="flex flex-col rounded-lg border border-hot-herbe-border bg-white px-[15px] py-[7px] group"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-2 list-none">
        <p className="text-hot-herbe-dark text-sm font-medium leading-normal">{question}</p>
        <CaretDownIcon />
      </summary>
      <p className="text-hot-herbe-light-green text-sm font-normal leading-normal pb-2">
        {answer}
      </p>
    </details>
  )
}