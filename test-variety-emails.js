import 'dotenv/config';

/**
 * Test d'envoi de différents types d'emails Date Mature
 * pour tester la variété des notifications
 */

async function sendMailerSendEmail(to, subject, html, text) {
  const response = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: {
        email: 'notifications@date-mature.com',
        name: 'Date Mature'
      },
      to: [{ email: to }],
      subject: subject,
      html: html,
      text: text
    })
  });

  return response.ok;
}

async function testVarietyEmails() {
  console.log('🧪 Test de variété d\'emails Date Mature...\n');

  const emails = [
    'jadywaves@gmail.com',
    't.walewski.pro@gmail.com'
  ];

  // Test 1: Notification de flash reçu
  console.log('💫 Test 1: Notification de flash reçu...');
  for (const email of emails) {
    const flashHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d946ef; font-size: 28px; margin: 0;">💕 Date Mature</h1>
          <p style="color: #666; font-size: 18px; margin: 10px 0;">Rencontres sérieuses après 40 ans</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="color: #be185d; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
            ✨ Quelqu'un s'intéresse à vous !
          </h2>
          
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 20px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">
              <strong>Marie, 52 ans de Lyon</strong> a flashé sur votre profil !
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p style="font-size: 18px; color: #555; margin: 0; line-height: 1.5;">
                "Votre sourire authentique et votre passion pour la randonnée m'ont séduite. J'aimerais beaucoup apprendre à vous connaître !"
              </p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://date-mature.com/profiles" style="background: #d946ef; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
            Voir son profil
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 16px; margin: 0;">
            Date Mature - Trouvez l'amour après 40 ans
          </p>
        </div>
      </div>
    `;
    
    const result = await sendMailerSendEmail(
      email,
      '💕 Marie s\'intéresse à vous - Date Mature',
      flashHtml,
      'Marie, 52 ans de Lyon a flashé sur votre profil ! Connectez-vous pour voir son profil complet.'
    );
    console.log(`${email}: ${result ? '✅' : '❌'}`);
  }

  // Test 2: Nouveau match
  console.log('\n🎯 Test 2: Nouveau match...');
  for (const email of emails) {
    const matchHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d946ef; font-size: 28px; margin: 0;">💕 Date Mature</h1>
          <p style="color: #666; font-size: 18px; margin: 10px 0;">Rencontres sérieuses après 40 ans</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="color: #059669; font-size: 26px; margin: 0 0 20px 0; text-align: center;">
            🎉 C'est un match !
          </h2>
          
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 20px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">
              Vous et <strong>Pierre, 58 ans de Marseille</strong> vous êtes mutuellement flashés !
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p style="font-size: 18px; color: #555; margin: 0; line-height: 1.5;">
                Pierre : "Pharmacien à la retraite, passionné de cuisine et de voyages. Recherche une compagne pour partager de beaux moments."
              </p>
            </div>
            
            <p style="font-size: 18px; color: #059669; margin: 20px 0 0 0; font-weight: bold;">
              Vous pouvez maintenant vous envoyer des messages !
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://date-mature.com/chat" style="background: #059669; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
            Commencer la conversation
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 16px; margin: 0;">
            Date Mature - Trouvez l'amour après 40 ans
          </p>
        </div>
      </div>
    `;
    
    const result = await sendMailerSendEmail(
      email,
      '🎉 Nouveau match avec Pierre - Date Mature',
      matchHtml,
      'Félicitations ! Vous et Pierre vous êtes mutuellement flashés. Commencez votre conversation maintenant.'
    );
    console.log(`${email}: ${result ? '✅' : '❌'}`);
  }

  // Test 3: Confirmation abonnement Premium
  console.log('\n💎 Test 3: Confirmation abonnement Premium...');
  for (const email of emails) {
    const premiumHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d946ef; font-size: 28px; margin: 0;">💕 Date Mature</h1>
          <p style="color: #666; font-size: 18px; margin: 10px 0;">Rencontres sérieuses après 40 ans</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="color: #d97706; font-size: 26px; margin: 0 0 20px 0; text-align: center;">
            🌟 Bienvenue dans Premium !
          </h2>
          
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 20px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">
              Votre abonnement Premium est maintenant actif !
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #d97706; font-size: 18px; margin: 0 0 15px 0;">Vos nouveaux avantages :</h3>
              <ul style="color: #555; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>20 flashs par jour (au lieu de 3)</li>
                <li>Voir qui vous a flashé</li>
                <li>Support prioritaire</li>
                <li>Profil mis en avant</li>
              </ul>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p style="font-size: 16px; color: #059669; margin: 0; line-height: 1.5;">
                <strong>Conseil :</strong> Complétez votre profil avec plusieurs photos et une description détaillée pour maximiser vos chances de match !
              </p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://date-mature.com/profiles" style="background: #d97706; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
            Découvrir les profils
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 16px; margin: 0;">
            Date Mature - Trouvez l'amour après 40 ans
          </p>
        </div>
      </div>
    `;
    
    const result = await sendMailerSendEmail(
      email,
      '🌟 Votre abonnement Premium est actif - Date Mature',
      premiumHtml,
      'Votre abonnement Premium est maintenant actif ! Profitez de 20 flashs par jour et de tous vos nouveaux avantages.'
    );
    console.log(`${email}: ${result ? '✅' : '❌'}`);
  }

  console.log('\n🎉 Test terminé !');
  console.log('\n📧 Conseil pour éviter les Promotions Gmail :');
  console.log('1. Marquer les emails comme "Important" dans Gmail');
  console.log('2. Déplacer manuellement vers "Principal" quelques fois');
  console.log('3. Ajouter notifications@date-mature.com aux contacts');
  console.log('4. Créer un filtre Gmail pour "date-mature.com" → Principal');
}

testVarietyEmails().catch(console.error);