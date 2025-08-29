'use client'

import Link from 'next/link'

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* ページタイトル */}
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          会社概要
        </h1>

        {/* 会社情報テーブル */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                  会社名
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  LandBridge株式会社
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                  代表者
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  代表取締役 三森 一輝
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                  設立
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  2024年12月
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                  所在地
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  〒343-0856<br />
                  埼玉県越谷市川柳町二丁目401
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                  事業内容
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  1. 健康・美容関連商品の企画・開発・販売<br />
                  2. HOT HERBE ブランドの運営・管理<br />
                  3. EC サイトの運営及びオンライン販売事業<br />
                  4. デジタルマーケティング・コンサルティング事業<br />
                  5. 前各号に附帯する一切の業務
                </td>
              </tr>
            </tbody>
          </table>
        </div>



        {/* ホームに戻るボタン */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-hot-herbe-green hover:bg-green-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}