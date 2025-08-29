# HOT HERBE - Stripe & Supabase セットアップガイド

## 必要な環境変数

`.env.local`ファイルに以下の環境変数を設定してください：

```env
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripeの設定

### 1. Stripeアカウントの作成
1. [Stripe](https://stripe.com/jp)でアカウントを作成
2. ダッシュボードから開発者セクションへアクセス

### 2. APIキーの取得
1. 開発者 > APIキー から公開可能キーとシークレットキーを取得
2. `.env.local`に設定

### 3. Webhookエンドポイントの設定
1. 開発者 > Webhooks から新しいエンドポイントを追加
2. エンドポイントURL: `https://your-domain.com/api/webhook/stripe`
3. 以下のイベントを選択:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Webhook署名シークレットを`.env.local`に設定

## Supabaseの設定

### 1. Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com)でアカウントを作成
2. 新しいプロジェクトを作成

### 2. APIキーの取得
1. プロジェクトの設定 > API から以下を取得:
   - Project URL
   - anon public key
   - service_role key
2. `.env.local`に設定

### 3. データベースの初期化
1. Supabase SQL Editorで`/supabase/migrations/001_create_tables.sql`を実行
2. 続けて`/supabase/migrations/002_create_functions.sql`を実行

## ローカル開発の開始

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 管理画面API

以下のエンドポイントが利用可能です：

### 注文管理
- `GET /api/admin/orders` - 注文一覧取得
- `PATCH /api/admin/orders` - 注文ステータス更新

### 顧客管理
- `GET /api/admin/customers` - 顧客一覧取得
- `GET /api/admin/customers?customerId=xxx` - 顧客の注文履歴取得

### 統計情報
- `GET /api/admin/stats` - 売上・注文統計取得

## テスト用カード番号

Stripeテストモードでは以下のカード番号が利用可能：

- **成功する支払い**: 4242 4242 4242 4242
- **支払い失敗**: 4000 0000 0000 9995
- **認証が必要**: 4000 0025 0000 3155

有効期限: 任意の未来の日付
CVV: 任意の3桁の数字

## トラブルシューティング

### Stripe Webhookが動作しない
- Webhook署名シークレットが正しく設定されているか確認
- ローカル開発では[Stripe CLI](https://stripe.com/docs/stripe-cli)を使用してWebhookをフォワード

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### Supabaseへの接続エラー
- APIキーが正しく設定されているか確認
- Supabaseプロジェクトのステータスを確認
- Row Level Security (RLS)が適切に設定されているか確認

## 本番環境へのデプロイ

1. 環境変数を本番環境に設定
2. `NEXT_PUBLIC_APP_URL`を本番URLに更新
3. StripeのWebhookエンドポイントを本番URLに更新
4. Stripeを本番モードに切り替え（本番用のAPIキーを使用）