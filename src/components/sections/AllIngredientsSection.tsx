export default function AllIngredientsSection() {
  return (
    <section id="all-ingredients" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">INGREDIENTS</p>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            全成分
          </h2>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 leading-relaxed">
            甘草、ターメリック、ヨモギ、白椿、カンフル、苦参、唐辛子、<br/>
            川芎、当帰、生姜、梔子、ハッカ、丹参<br/>
            その他天然成分配合
          </p>
        </div>
      </div>
    </section>
  )
}