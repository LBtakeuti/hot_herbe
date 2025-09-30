#!/bin/bash

# Stripe Live Mode Setup Script
# このスクリプトはStripeをライブモード（本番環境）に切り替えます

echo "==================================================="
echo "Stripe Live Mode Setup"
echo "==================================================="
echo ""
echo "現在、アプリはテストモードのStripe APIキーを使用していますが、"
echo "提供されたProduct IDはライブモード用です。"
echo ""
echo "エラー: No such product: 'prod_T8zMXxZWHbbkdX';"
echo "       a similar object exists in live mode,"
echo "       but a test mode key was used"
echo ""
echo "==================================================="
echo ""
echo "解決方法: Stripeダッシュボードからライブモードのキーを取得して設定してください"
echo ""
echo "1. https://dashboard.stripe.com/ にアクセス"
echo "2. 右上の「テストモード」トグルをOFFにして、ライブモードに切り替え"
echo "3. 「開発者」→「APIキー」を開く"
echo "4. 以下のキーをコピー:"
echo "   - 公開可能キー (pk_live_で始まる)"
echo "   - シークレットキー (sk_live_で始まる)"
echo ""
echo "==================================================="
echo ""

# Ask user for live keys
read -p "Stripe公開可能キー (pk_live_...): " PUBLISHABLE_KEY
read -p "Stripeシークレットキー (sk_live_...): " SECRET_KEY

# Validate key format
if [[ ! $PUBLISHABLE_KEY =~ ^pk_live_ ]]; then
  echo "エラー: 公開可能キーは 'pk_live_' で始まる必要があります"
  exit 1
fi

if [[ ! $SECRET_KEY =~ ^sk_live_ ]]; then
  echo "エラー: シークレットキーは 'sk_live_' で始まる必要があります"
  exit 1
fi

echo ""
echo "Vercelに環境変数を設定中..."
echo ""

# Remove old test keys
vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production -y
vercel env rm STRIPE_SECRET_KEY production -y

# Add live keys
printf "%s" "$PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
printf "%s" "$SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production

echo ""
echo "==================================================="
echo "✅ Stripeキーがライブモードに更新されました"
echo "==================================================="
echo ""
echo "次のステップ:"
echo "1. 'vercel --prod' でアプリを再デプロイ"
echo "2. 決済機能をテスト（実際のカードで課金されます）"
echo ""
echo "注意: ライブモードでは実際の決済が行われます！"
echo "==================================================="