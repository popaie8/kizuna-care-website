export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Test if environment variables are set
  const config = {
    host: process.env.SMTP_HOST || 'sv16435.xserver.jp',
    user: process.env.SMTP_USER || 'info@kizuna-houmon.jp',
    passSet: !!process.env.SMTP_PASS,
    port: process.env.SMTP_PORT || '587'
  };

  // If password not set, return error immediately
  if (!config.passSet) {
    return res.status(500).json({
      error: 'SMTP設定エラー',
      message: 'SMTP_PASS環境変数が設定されていません',
      config: config
    });
  }

  try {
    // Try to load nodemailer
    const nodemailer = await import('nodemailer');
    
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: '必須項目を入力してください' 
      });
    }

    // Create transporter with minimal config
    const transporter = nodemailer.default.createTransporter({
      host: config.host,
      port: parseInt(config.port),
      secure: false,
      auth: {
        user: config.user,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Simple test email
    await transporter.sendMail({
      from: config.user,
      to: config.user,
      subject: `テスト: ${name}様からのお問い合わせ`,
      text: `
名前: ${name}
メール: ${email}

内容:
${message}
      `
    });

    return res.status(200).json({ 
      success: true,
      message: 'メール送信成功' 
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'メール送信エラー',
      message: error.message,
      stack: error.stack
    });
  }
}