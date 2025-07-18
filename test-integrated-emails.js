import dotenv from 'dotenv';
dotenv.config();

async function sendMailerSendEmail(to, subject, html, text) {
  const mailersendApiKey = process.env.MAILERSEND_API_KEY;
  
  if (!mailersendApiKey) {
    console.log('❌ MAILERSEND_API_KEY manquante');
    return false;
  }

  const emailPayload = {
    from: {
      email: 'noreply@date-mature.com',
      name: 'Date Mature'
    },
    to: [{ email: to, name: 'Thomas' }],
    subject,
    html,
    text
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

    return response.status === 202;
  } catch (error) {
    console.error('Erreur MailerSend:', error.message);
    return false;
  }
}

async function testIntegratedEmails() {
  console.log('🧪 Test des emails Date Mature via MailerSend...\n');
  
  // Test 1: Email de bienvenue Premium
  console.log('📧 Test 1: Email de bienvenue Premium...');
  const welcomeResult = await sendMailerSendEmail(
    'contact@pulseagency.fr',
    '🎉 Bienvenue dans la communauté Premium Date Mature !',
    `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Bienvenue Premium</title></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%); color: white; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Date Mature Premium</h1>
      <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Votre abonnement est activé !</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #e11d48; margin-top: 0; font-size: 24px;">Félicitations Thomas !</h2>
      <p style="font-size: 18px; line-height: 1.6; margin: 20px 0; color: #333;">
        Votre abonnement <strong>Premium 6 mois</strong> est maintenant actif. Profitez de vos nouveaux avantages :
      </p>
      <ul style="font-size: 16px; line-height: 1.8; color: #333;">
        <li><strong>20 flashs par jour</strong> (au lieu de 3)</li>
        <li><strong>Voir qui vous a flashé</strong></li>
        <li><strong>Support prioritaire</strong></li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://date-mature.com/profiles" style="background: #e11d48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
          Commencer à flasher
        </a>
      </div>
    </div>
  </div>
</body>
</html>`,
    'Félicitations Thomas ! Votre abonnement Premium 6 mois est activé. Profitez de 20 flashs/jour et voir qui vous a flashé !'
  );
  console.log(`Résultat bienvenue: ${welcomeResult ? '✅' : '❌'}\n`);
  
  console.log('🎉 Test terminé !');
}

testIntegratedEmails().catch(console.error);