import 'dotenv/config';

/**
 * Test d'envoi de différents types d'emails Date Mature
 * vers l'email admin pendant le plan Trial
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

  if (!response.ok) {
    const error = await response.json();
    console.log('Erreur API:', error);
    return false;
  }

  return true;
}

async function testVarietyAdminEmails() {
  console.log('🧪 Test de variété d\'emails Date Mature (admin)...\n');

  const adminEmail = 'contact@pulseagency.fr';

  // Test 1: Notification de flash reçu
  console.log('💫 Test 1: Notification de flash reçu...');
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
  
  const result1 = await sendMailerSendEmail(
    adminEmail,
    '💕 Marie s\'intéresse à vous - Date Mature',
    flashHtml,
    'Marie, 52 ans de Lyon a flashé sur votre profil ! Connectez-vous pour voir son profil complet.'
  );
  console.log(`Flash notification: ${result1 ? '✅' : '❌'}`);

  // Attendre 2 secondes entre les emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Nouveau match
  console.log('\n🎯 Test 2: Nouveau match...');
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
  
  const result2 = await sendMailerSendEmail(
    adminEmail,
    '🎉 Nouveau match avec Pierre - Date Mature',
    matchHtml,
    'Félicitations ! Vous et Pierre vous êtes mutuellement flashés. Commencez votre conversation maintenant.'
  );
  console.log(`Match notification: ${result2 ? '✅' : '❌'}`);

  // Attendre 2 secondes
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Profil qui pourrait vous plaire
  console.log('\n💝 Test 3: Profil qui pourrait vous plaire...');
  const suggestionHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d946ef; font-size: 28px; margin: 0;">💕 Date Mature</h1>
        <p style="color: #666; font-size: 18px; margin: 10px 0;">Rencontres sérieuses après 40 ans</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #0369a1; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
          💝 Ce profil pourrait vous plaire
        </h2>
        
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 20px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">
            <strong>Sophie, 47 ans de Bordeaux</strong>
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 18px; color: #555; margin: 0; line-height: 1.5;">
              "Professeure d'art passionnée de musique classique et de lecture. Recherche un homme cultivé pour partager des moments de complicité et découvrir ensemble les petits bonheurs de la vie."
            </p>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 16px; color: #059669; margin: 0; font-weight: bold;">
              Centres d'intérêt communs : Art, Culture, Voyages
            </p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://date-mature.com/profiles" style="background: #0369a1; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
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
  
  const result3 = await sendMailerSendEmail(
    adminEmail,
    '💝 Sophie pourrait vous plaire - Date Mature',
    suggestionHtml,
    'Sophie, 47 ans de Bordeaux pourrait vous plaire ! Découvrez son profil et flashez si elle vous intéresse.'
  );
  console.log(`Profile suggestion: ${result3 ? '✅' : '❌'}`);

  console.log('\n🎉 Test terminé !');
  console.log('\n📧 Pour éviter les Promotions Gmail :');
  console.log('1. Marquer les emails comme "Important" dans Gmail');
  console.log('2. Déplacer manuellement vers "Principal" quelques fois');
  console.log('3. Ajouter notifications@date-mature.com aux contacts');
  console.log('4. Créer un filtre Gmail pour "date-mature.com" → Principal');
  console.log('5. Utiliser des lignes d\'objet plus personnelles (moins marketing)');
}

testVarietyAdminEmails().catch(console.error);