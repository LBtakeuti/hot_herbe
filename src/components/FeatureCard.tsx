import Image from 'next/image'

interface FeatureCardProps {
  title: string
  description: string
  image: string
}

export default function FeatureCard({ title, description, image }: FeatureCardProps) {
  return (
    <div className="p-4">
      <div className="flex items-stretch justify-between gap-4 rounded-lg">
        <div className="flex flex-col gap-1 flex-[2_2_0px]">
          <p className="text-hot-herbe-dark text-base font-bold leading-tight">{title}</p>
          <p className="text-hot-herbe-light-green text-sm font-normal leading-normal">{description}</p>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden flex-1">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 40vw, 25vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}