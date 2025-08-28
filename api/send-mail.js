export default async function handler(req, res) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      ...headers 
    });
  }

  try {
    // Dynamic import of nodemailer
    const nodemailer = await import('nodemailer');
    
    // Get form data
    const { name, email, phone, inquiry_type, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: '必須項目が入力されていません',
        ...headers 
      });
    }

    // SMTP configuration
    const transporter = nodemailer.default.createTransporter({
      host: 'sv16435.xserver.jp',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'info@kizuna-houmon.jp',
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Check if password is set
    if (!process.env.SMTP_PASS) {
      console.error('SMTP_PASS environment variable is not set');
      return res.status(500).json({ 
        error: 'メール設定エラー: 環境変数が設定されていません',
        configError: 'SMTP_PASS not configured',
        ...headers 
      });
    }

    // Map inquiry types
    const inquiryTypes = {
      'service': 'サービスについて',
      'consultation': '介護相談',
      'recruitment': '採用について',
      'other': 'その他'
    };

    const inquiryTypeText = inquiryTypes[inquiry_type] || inquiry_type || 'お問い合わせ';

    // Email content
    const emailText = `
絆訪問介護サービスへ新しいお問い合わせが届きました。

━━━━━━━━━━━━━━━━━━━━━━
お客様情報
━━━━━━━━━━━━━━━━━━━━━━

お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone || '未入力'}
お問い合わせ種別: ${inquiryTypeText}

━━━━━━━━━━━━━━━━━━━━━━
お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━
送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
`;

    // Send email to admin
    const adminMail = await transporter.sendMail({
      from: '"絆訪問介護 お問い合わせ" <info@kizuna-houmon.jp>',
      to: 'info@kizuna-houmon.jp',
      replyTo: email,
      subject: `【お問い合わせ】${inquiryTypeText} - ${name}様`,
      text: emailText
    });

    console.log('Email sent:', adminMail.messageId);

    // Auto-reply to customer
    const autoReplyText = `
${name} 様

この度は絆訪問介護サービスへお問い合わせいただき、
誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。
━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━

担当者より1営業日以内にご連絡させていただきます。
お急ぎの場合は、お電話（03-6820-5308）まで
ご連絡ください。

絆訪問介護サービス
合同会社K&Kサービス
`;

    await transporter.sendMail({
      from: '"絆訪問介護サービス" <info@kizuna-houmon.jp>',
      to: email,
      subject: '【絆訪問介護】お問い合わせを受け付けました',
      text: autoReplyText
    });

    return res.status(200).json({ 
      success: true,
      message: 'メールを送信しました',
      ...headers 
    });

  } catch (error) {
    console.error('Email error:', error);
    
    return res.status(500).json({ 
      error: 'メール送信に失敗しました',
      details: error.message,
      ...headers 
    });
  }
}