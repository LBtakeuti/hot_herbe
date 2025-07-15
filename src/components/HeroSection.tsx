import HeroSlider from './HeroSlider'
import { heroSlides } from '@/data/heroSlides'

export default function HeroSection() {
  return <HeroSlider slides={heroSlides} autoSlideInterval={8000} />
}