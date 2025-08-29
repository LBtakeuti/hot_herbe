# セットアップ手順

## 1. Supabaseデータベースの初期化

Supabaseダッシュボードにログインして、SQL Editorで以下のSQLを実行してください：

### ステップ1: テーブル作成（001_create_tables.sql）
`supabase/migrations/001_create_tables.sql`の内容をSQL Editorで実行

### ステップ2: 関数作成（002_create_functions.sql）
`supabase/migrations/002_create_functions.sql`の内容をSQL Editorで実行

## 2. Stripe Webhookの設定

### 開発環境（ローカル）

Stripe CLIを使用してローカル環境でWebhookをテスト：

```bash
# Stripe CLIのインストール（未インストールの場合）
brew install stripe/stripe-cli/stripe

# Stripeにログイン
stripe login

# Webhookをローカルにフォワード
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

表示されるWebhook signing secretを`.env.local`の`STRIPE_WEBHOOK_SECRET`に設定

### 本番環境

1. Stripeダッシュボード > 開発者 > Webhooks
2. 「エンドポイントを追加」をクリック
3. エンドポイントURL: `https://あなたのドメイン.com/api/webhook/stripe`
4. 以下のイベントを選択:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. 作成後、Signing secretを`.env.local`の`STRIPE_WEBHOOK_SECRET`に設定

## 3. テスト実行

```bash
# 開発サーバーを起動
npm run dev
```

1. http://localhost:3000 にアクセス
2. 商品を選択して購入ボタンをクリック
3. フォームに情報を入力
4. Stripeテスト用カード番号を使用:
   - カード番号: 4242 4242 4242 4242
   - 有効期限: 任意の未来の日付（例: 12/34）
   - CVC: 任意の3桁（例: 123）
   - 郵便番号: 任意の5桁（例: 12345）

## 4. 管理画面の確認

以下のAPIエンドポイントで注文・顧客データを確認可能：

- 注文一覧: `GET http://localhost:3000/api/admin/orders`
- 顧客一覧: `GET http://localhost:3000/api/admin/customers`
- 統計情報: `GET http://localhost:3000/api/admin/stats`

## トラブルシューティング

### データベースエラーが発生する場合
- Supabaseダッシュボードで全てのSQLが正常に実行されたか確認
- Table EditorでテーブルとProductsテーブルにデータが存在するか確認

### 決済エラーが発生する場合
- Stripe APIキーが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認
- Stripe CLIが起動しているか確認（ローカル環境の場合）

### Webhookが動作しない場合
- Stripe CLIでイベントが受信されているか確認
- `.env.local`のWebhook signing secretが正しいか確認