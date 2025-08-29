#!/bin/bash

# .env.localから環境変数を読み込む
set -a
source .env.local
set +a

echo "🔧 Vercelに環境変数を設定します..."

# 環境変数をVercelに設定
echo "$NEXT_PUBLIC_SUPABASE_URL" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "$SUPABASE_SERVICE_ROLE_KEY" | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" | npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
echo "$STRIPE_SECRET_KEY" | npx vercel env add STRIPE_SECRET_KEY production
echo "$STRIPE_WEBHOOK_SECRET" | npx vercel env add STRIPE_WEBHOOK_SECRET production

# NEXT_PUBLIC_APP_URLはプロダクションURLを設定
echo "https://hot-herbe.vercel.app" | npx vercel env add NEXT_PUBLIC_APP_URL production

echo "✅ 環境変数の設定が完了しました"