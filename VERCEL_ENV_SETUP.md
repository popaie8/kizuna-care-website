# Vercel環境変数設定ガイド

## 設定手順

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - 絆介護HPのプロジェクトを選択

2. **環境変数の設定**
   - Settings → Environment Variables に移動
   - 以下の変数を追加：

   | 変数名 | 値 |
   |--------|-----|
   | SMTP_HOST | sv16435.xserver.jp |
   | SMTP_PORT | 587 |
   | SMTP_USER | info@kizuna-houmon.jp |
   | SMTP_PASS | NUgj#ttR]hO4 |

3. **環境変数の適用**
   - Production, Preview, Development すべての環境にチェック
   - 「Save」をクリック

4. **デプロイ**
   - 環境変数を追加した後、再デプロイが必要です
   - Deployments → 最新のデプロイ → 「...」メニュー → Redeploy

## ローカルテスト用

ローカルでテストする場合は、`.env.local`ファイルを作成：

```
SMTP_HOST=sv16435.xserver.jp
SMTP_PORT=587
SMTP_USER=info@kizuna-houmon.jp
SMTP_PASS=NUgj#ttR]hO4
```

**注意**: `.env.local`は絶対にGitにコミットしないでください。

## テスト方法

1. Vercelに再デプロイ後
2. https://kizuna-houmon.jp/contact にアクセス
3. フォームに入力して送信
4. info@kizuna-houmon.jp にメールが届くことを確認

## トラブルシューティング

- **メールが届かない場合**
  1. Vercelの環境変数が正しく設定されているか確認
     - Functionsタブでログを確認
     - ブラウザのコンソールでエラー詳細を確認
  2. Xserverのメールアカウント設定を確認
     - メールアカウントが有効か
     - パスワードが正しいか
  3. SMTPポートを変更して試す
     - ポート587（STARTTLS）が失敗する場合は465（SSL）を試す
     - `/api/send-email-465`エンドポイントも用意しています

- **認証エラーの場合**
  1. パスワードに特殊文字が含まれている場合
     - Vercelの環境変数で値をダブルクォート""で囲む
     - 例: "NUgj#ttR]hO4"
  2. Xserverのメールアカウント設定でSMTP認証が有効になっているか確認
  3. メールアドレスとパスワードが正確に入力されているか確認

- **環境変数の確認方法**
  1. Vercelダッシュボード → Settings → Environment Variables
  2. 各変数の値が正しく設定されているか確認
  3. 特に`SMTP_PASS`の値に注意（特殊文字のエスケープ）

## デバッグ用エンドポイント

- `/api/send-email` - ポート587（STARTTLS）版
- `/api/send-email-465` - ポート465（SSL）版

ブラウザの開発者ツールのコンソールでエラーの詳細を確認できます。