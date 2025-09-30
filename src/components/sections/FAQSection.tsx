import FAQItem from '@/components/FAQItem'
import { FAQ } from '@/types'

interface FAQSectionProps {
  faqs: FAQ[]
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">FAQ</p>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            よくある質問
          </h2>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} defaultOpen={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}