import FeatureCard from '@/components/FeatureCard'
import { Feature } from '@/types'

interface FeaturesSectionProps {
  features: Feature[]
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">FEATURES</p>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            HOT HERBEの3つの特徴
          </h2>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            韓国の温活文化から生まれた特別な温感体験
          </p>
        </div>
      </div>
      <div className="space-y-0">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>
    </section>
  )
}