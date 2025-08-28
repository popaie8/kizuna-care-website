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
  2. Xserverのメールアカウント設定を確認
  3. SMTPポートを465（SSL）に変更して試す

- **認証エラーの場合**
  1. パスワードに特殊文字が含まれている場合は、ダブルクォートで囲む
  2. Xserverのメールアカウント設定でSMTP認証が有効になっているか確認