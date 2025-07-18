import dotenv from 'dotenv';
dotenv.config();

async function testMatchEmail() {
  console.log('🧪 Test email de match via MailerSend...');
  
  const mailersendApiKey = process.env.MAILERSEND_API_KEY;
  
  if (!mailersendApiKey) {
    console.log('❌ MAILERSEND_API_KEY manquante');
    return;
  }

  // Template email de nouveau match
  const emailPayload = {
    from: {
      email: 'noreply@date-mature.com',
      name: 'Date Mature'
    },
    to: [
      {
        email: 't.walewski.pro@gmail.com',
        name: 'Thomas'
      }
    ],
    subject: '💝 Nouveau match avec Claire sur Date Mature !',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau match - Date Mature</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%); color: white; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">💝 Date Mature</h1>
      <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Rencontres sérieuses après 40 ans</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #e11d48; margin-top: 0; font-size: 24px;">Félicitations Thomas !</h2>
      <p style="font-size: 18px; line-height: 1.6; margin: 20px 0; color: #333;">
        <strong>C'est mutuel !</strong> Vous avez un nouveau match avec <strong>Claire</strong> (48 ans, Lyon). Vous vous êtes flashés tous les deux !
      </p>
      <div style="background: #fef2f2; border-left: 4px solid #e11d48; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; font-size: 16px; color: #7f1d1d;">
          💌 <strong>Prochaine étape</strong> : Commencez votre conversation maintenant. Les premiers échanges sont souvent les plus importants !
        </p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://date-mature.com/chat" style="background: #e11d48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
          Commencer la conversation
        </a>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
        L'équipe Date Mature vous souhaite de belles rencontres !
      </p>
    </div>
    <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0; color: #999; font-size: 12px;">© 2025 Date Mature - L'amour n'attend pas</p>
    </div>
  </div>
</body>
</html>`,
    text: `Félicitations Thomas !

C'est mutuel ! Vous avez un nouveau match avec Claire (48 ans, Lyon) sur Date Mature.

Commencez votre conversation : https://date-mature.com/chat

L'équipe Date Mature`
  };

  try {
    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailersendApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    console.log('📧 Email match status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email de match envoyé avec succès !');
      console.log('Message ID:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur envoi:', errorText);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testMatchEmail();