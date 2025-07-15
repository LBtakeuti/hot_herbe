import Image from 'next/image'

interface IngredientCardProps {
  name: string
  image: string
  benefits: string[]
  onClick: () => void
}

export default function IngredientCard({ name, image, benefits, onClick }: IngredientCardProps) {
  return (
    <div 
      className="flex flex-col gap-3 pb-3 cursor-pointer group transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-hot-herbe-green px-3 py-1 rounded-full">
            詳細を見る
          </span>
        </div>
      </div>
      <p className="text-hot-herbe-dark text-base font-medium leading-normal group-hover:text-hot-herbe-green transition-colors">
        {name}
      </p>
    </div>
  )
}