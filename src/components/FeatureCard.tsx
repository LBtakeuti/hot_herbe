import Image from 'next/image'

interface FeatureCardProps {
  title: string
  description: string
  image: string
  index: number
}

export default function FeatureCard({ title, description, image, index }: FeatureCardProps) {
  const isEven = index % 2 === 0

  return (
    <div className={`relative overflow-hidden ${isEven ? 'bg-gradient-to-r from-stone-50 via-white to-stone-50' : 'bg-gradient-to-l from-amber-50/30 via-white to-amber-50/30'}`}>
      <div className={`flex flex-col md:flex-row items-center gap-8 p-12 max-w-7xl mx-auto ${!isEven ? 'md:flex-row-reverse' : ''}`}>
        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`h-px flex-1 ${isEven ? 'bg-gradient-to-r from-transparent via-green-600/20 to-green-600/40' : 'bg-gradient-to-r from-transparent via-amber-600/20 to-amber-600/40'}`}></div>
              <span className={`text-xs font-semibold tracking-[0.3em] uppercase ${isEven ? 'text-green-700' : 'text-amber-700'}`}>
                Feature {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className={`text-3xl md:text-4xl font-bold leading-tight ${isEven ? 'text-green-900' : 'text-amber-900'}`}>
              {title}
            </h3>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed tracking-wide">
            {description}
          </p>
          <div className="pt-4">
            <button className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              isEven ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-amber-600 to-amber-700'
            }`}>
              詳しく見る
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
          </div>
          {/* Premium accent */}
          <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl ${
            isEven ? 'bg-green-400/30' : 'bg-amber-400/30'
          }`}></div>
        </div>
      </div>

      {/* Premium geometric decoration */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-0' : 'left-0'} w-96 h-96 opacity-5`}>
        <div className={`w-full h-full rotate-45 ${isEven ? 'bg-green-800' : 'bg-amber-800'}`}></div>
      </div>
    </div>
  )
}