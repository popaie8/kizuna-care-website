# EmailJS設定手順

## 1. アカウント作成
1. https://www.emailjs.com/ にアクセス
2. 「Sign Up Free」をクリック
3. メールアドレスとパスワードを設定

## 2. サービス設定
1. ダッシュボードで「Email Services」をクリック
2. 「Add New Service」をクリック
3. 「Gmail」を選択（または他のメールサービス）
4. 接続したいGmailアカウントでログイン
5. Service IDをメモする（例：service_abc123）

## 3. メールテンプレート作成
1. 「Email Templates」をクリック
2. 「Create New Template」をクリック
3. 以下の内容で設定：

**Subject（件名）**: 
```
絆訪問介護サービス - お問い合わせ {{from_name}}様より
```

**Content（本文）**:
```
お問い合わせを受信しました。

【お客様情報】
お名前: {{from_name}}
メールアドレス: {{from_email}}
電話番号: {{phone}}
お問い合わせ種別: {{inquiry_type}}

【お問い合わせ内容】
{{message}}

---
送信元: {{source}}
```

4. 「To Email」に受信したいメールアドレスを設定
5. 「Reply To」に `{{reply_to}}` を設定
6. Template IDをメモする（例：template_xyz789）

## 4. APIキー取得
1. 「Account」→「API Keys」
2. Public Keyをコピー

## 5. コードに反映
以下の3つの値を実際の値に置き換えてください：

**contact.html と index.html の両方で：**
```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE"); // 実際のPublic Keyに置換
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
// YOUR_SERVICE_ID → 実際のService ID
// YOUR_TEMPLATE_ID → 実際のTemplate ID
```

## 6. テスト
1. フォームから送信
2. 設定したメールアドレスにメールが届くことを確認

## 無料プランの制限
- 月200通まで無料
- それ以上は有料プラン（月$9〜）

## トラブルシューティング
- メールが届かない場合は、迷惑メールフォルダを確認
- EmailJSダッシュボードで送信履歴を確認
- ブラウザのコンソールでエラーを確認