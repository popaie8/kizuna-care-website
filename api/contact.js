export default async function handler(req, res) {
  // CORS対応
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS リクエスト処理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // リクエストボディを取得
    const { name, email, phone, inquiry_type, message } = req.body;

    // 必須項目チェック
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: '必須項目が入力されていません' 
      });
    }

    // 環境変数チェック
    if (!process.env.SMTP_PASS) {
      console.log('Warning: SMTP_PASS not set, using test mode');
      
      // テストモード：ログに出力してOKを返す
      console.log('Contact form submission:', {
        name,
        email,
        phone,
        inquiry_type,
        message,
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({
        success: true,
        message: 'テストモード：メール送信をシミュレートしました',
        testMode: true
      });
    }

    // Nodemailerを動的インポート
    const nodemailer = (await import('nodemailer')).default;

    // SMTP設定
    const transporter = nodemailer.createTransporter({
      host: 'sv16435.xserver.jp',
      port: 587,
      secure: false,
      auth: {
        user: 'info@kizuna-houmon.jp',
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // メールテキスト
    const mailText = `
お問い合わせを受け付けました。

【お客様情報】
お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone || '未入力'}
お問い合わせ種別: ${inquiry_type || 'その他'}

【お問い合わせ内容】
${message}

---
送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
`;

    // メール送信
    await transporter.sendMail({
      from: 'info@kizuna-houmon.jp',
      to: 'info@kizuna-houmon.jp',
      replyTo: email,
      subject: `お問い合わせ: ${name}様`,
      text: mailText
    });

    // 自動返信
    const replyText = `
${name} 様

お問い合わせありがとうございます。
以下の内容で受け付けました。

${message}

1営業日以内にご連絡いたします。

絆訪問介護サービス
`;

    await transporter.sendMail({
      from: 'info@kizuna-houmon.jp',
      to: email,
      subject: 'お問い合わせを受け付けました - 絆訪問介護',
      text: replyText
    });

    return res.status(200).json({
      success: true,
      message: 'メールを送信しました'
    });

  } catch (error) {
    console.error('Error in contact API:', error);
    return res.status(500).json({
      error: 'メール送信に失敗しました',
      details: error.message
    });
  }
}