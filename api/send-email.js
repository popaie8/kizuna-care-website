const nodemailer = require('nodemailer');

// メール送信設定
const smtpConfig = {
  host: process.env.SMTP_HOST || 'sv16435.xserver.jp',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'info@kizuna-houmon.jp',
    pass: process.env.SMTP_PASS || ''
  },
  tls: {
    rejectUnauthorized: false, // 自己署名証明書を許可
    ciphers: 'SSLv3'
  },
  debug: true, // デバッグ情報を出力
  logger: true // ログを出力
};

console.log('SMTP Config (without password):', {
  ...smtpConfig,
  auth: { ...smtpConfig.auth, pass: '***' }
});

const transporter = nodemailer.createTransporter(smtpConfig);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async (req, res) => {
  // CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).json({ body: 'OK', headers: corsHeaders });
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ 
      error: 'Method not allowed',
      headers: corsHeaders 
    });
    return;
  }

  try {
    const { name, email, phone, inquiry_type, message } = req.body;

    // 入力値の検証
    if (!name || !email || !inquiry_type || !message) {
      res.status(400).json({ 
        error: '必須項目が入力されていません',
        headers: corsHeaders 
      });
      return;
    }

    // メールアドレスの検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        error: '正しいメールアドレスを入力してください',
        headers: corsHeaders 
      });
      return;
    }

    // お問い合わせ種別のマッピング
    const inquiryTypeMap = {
      'service': 'サービスについて',
      'consultation': '介護相談',
      'recruitment': '採用について',
      'other': 'その他'
    };

    const inquiryTypeText = inquiryTypeMap[inquiry_type] || inquiry_type;

    // メール本文の作成
    const mailContent = `
絆訪問介護サービスへ新しいお問い合わせが届きました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone || '未入力'}
お問い合わせ種別: ${inquiryTypeText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは絆訪問介護サービスのウェブサイトのお問い合わせフォームから自動送信されました。
送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
    `;

    // 自動返信メールの本文
    const autoReplyContent = `
${name} 様

この度は絆訪問介護サービスへお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

お問い合わせ種別: ${inquiryTypeText}

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

担当者より1営業日以内にご連絡させていただきます。
お急ぎの場合は、お電話（03-6820-5308）までご連絡ください。

今後ともよろしくお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
絆訪問介護サービス
合同会社K&Kサービス

〒287-0003
千葉県香取市府馬4858

TEL: 03-6820-5308
Email: info@kizuna-houmon.jp
受付時間: 午前9時〜午後6時
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

※このメールは自動返信です。このメールへの返信はできません。
    `;

    // 管理者へのメール送信
    const adminMailOptions = {
      from: '"絆訪問介護サービス お問い合わせフォーム" <info@kizuna-houmon.jp>',
      to: 'info@kizuna-houmon.jp',
      replyTo: email,
      subject: `【お問い合わせ】${inquiryTypeText} - ${name}様より`,
      text: mailContent,
    };

    // お客様への自動返信メール
    const customerMailOptions = {
      from: '"絆訪問介護サービス" <info@kizuna-houmon.jp>',
      to: email,
      subject: '【絆訪問介護サービス】お問い合わせを受け付けました',
      text: autoReplyContent,
    };

    // メール送信
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.status(200).json({ 
      success: true,
      message: 'メールを送信しました',
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error stack:', error.stack);
    
    // より詳細なエラー情報を返す（本番環境では制限する必要あり）
    const errorResponse = {
      error: 'メール送信に失敗しました。お電話でお問い合わせください。',
      details: error.message,
      code: error.code,
      command: error.command,
      headers: corsHeaders
    };
    
    // 環境変数が設定されているか確認
    if (!process.env.SMTP_PASS) {
      errorResponse.configError = 'SMTP_PASS environment variable is not set';
      console.error('SMTP_PASS is not configured in environment variables');
    }
    
    res.status(500).json(errorResponse);
  }
};