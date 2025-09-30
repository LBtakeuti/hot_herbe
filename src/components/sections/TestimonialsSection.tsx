import StarIcon from '@/components/icons/StarIcon'

interface Testimonial {
  rating: number
  text: string
  author: string
}

const testimonials: Testimonial[] = [
  {
    rating: 5,
    text: '「運動前に使用すると、体がすぐに温まってパフォーマンスが上がります。韓国の友人に勧められて購入しましたが、期待以上でした！」',
    author: '30代 男性 / スポーツトレーナー'
  },
  {
    rating: 5,
    text: '「デスクワークで肩こりがひどかったのですが、これを使い始めてから楽になりました。じんわり温かくて気持ちいいです。」',
    author: '40代 女性 / 会社員'
  },
  {
    rating: 5,
    text: '「冷え性で悩んでいましたが、これを塗ると本当に体の芯から温まる感じがします。韓国コスメ好きの私のお気に入りです。」',
    author: '50代 女性 / 主婦'
  }
]

export default function TestimonialsSection() {
  return (
    <section id="recommended-for" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">TESTIMONIALS</p>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            ご愛用者様の声
          </h2>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            韓国で大好評の温感クリーム
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="text-gray-700 mb-3">
                {testimonial.text}
              </p>
              <p className="text-sm text-gray-500">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}