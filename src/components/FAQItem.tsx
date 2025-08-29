'use client'
import { useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export default function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div 
      className={`relative rounded-2xl border transition-all duration-300 ${
        isOpen 
          ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-lg' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left group"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-1 h-6 rounded-full transition-all duration-300 ${
            isOpen ? 'bg-gradient-to-b from-amber-500 to-orange-500' : 'bg-gray-300 group-hover:bg-gray-400'
          }`}></div>
          <p className={`text-base font-semibold leading-relaxed transition-colors duration-300 ${
            isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
          }`}>
            {question}
          </p>
        </div>
        
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-gray-100 group-hover:bg-gray-200'
        }`}>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${
              isOpen ? 'text-amber-700' : 'text-gray-600'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-500 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-5 pl-14">
          <p className="text-gray-600 text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}