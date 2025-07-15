import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
        <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
          <Link 
            className="text-hot-herbe-light-green text-base font-normal leading-normal min-w-40 hover:text-hot-herbe-green transition-colors" 
            href="/privacy"
          >
            プライバシーポリシー
          </Link>
          <Link 
            className="text-hot-herbe-light-green text-base font-normal leading-normal min-w-40 hover:text-hot-herbe-green transition-colors" 
            href="/terms"
          >
            利用規約
          </Link>
        </div>
        <p className="text-hot-herbe-light-green text-base font-normal leading-normal">
          © 2024 HOT HERBE株式会社 All rights reserved.
        </p>
      </footer>
      <div className="h-5 bg-white"></div>
    </>
  )
}