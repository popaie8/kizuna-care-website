const nodemailer = require('nodemailer');

// メール送信設定（ポート465 SSL版）
const smtpConfig = {
  host: process.env.SMTP_HOST || 'sv16435.xserver.jp',
  port: 465,
  secure: true, // SSL使用
  auth: {
    user: process.env.SMTP_USER || 'info@kizuna-houmon.jp',
    pass: process.env.SMTP_PASS || ''
  },
  tls: {
    rejectUnauthorized: false // 自己署名証明書を許可
  }
};

console.log('SMTP Config (SSL 465):', {
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

    // お問い合わせ種別のマッピング
    const inquiryTypeMap = {
      'service': 'サービスについて',
      'consultation': '介護相談',
      'recruitment': '採用について',
      'other': 'その他'
    };

    const inquiryTypeText = inquiryTypeMap[inquiry_type] || inquiry_type;

    // シンプルなテストメール
    const testMailOptions = {
      from: 'info@kizuna-houmon.jp',
      to: 'info@kizuna-houmon.jp',
      subject: `【テスト】お問い合わせ - ${name}様`,
      text: `
お問い合わせがありました。

お名前: ${name}
メール: ${email}
電話: ${phone || '未入力'}
種別: ${inquiryTypeText}

内容:
${message}
      `
    };

    // メール送信
    const info = await transporter.sendMail(testMailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({ 
      success: true,
      message: 'メールを送信しました',
      messageId: info.messageId,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    const errorResponse = {
      error: 'メール送信に失敗しました',
      details: error.message,
      code: error.code,
      headers: corsHeaders
    };
    
    if (!process.env.SMTP_PASS) {
      errorResponse.configError = 'SMTP_PASS not set';
    }
    
    res.status(500).json(errorResponse);
  }
};