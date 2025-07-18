// Test simple de l'API MailerLite pour les emails transactionnels

async function testEmailAPI() {
  const apiKey = process.env.MAILERLITE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ MAILERLITE_API_KEY manquante');
    return;
  }

  console.log('🧪 Test API MailerLite...');

  // Test 1: Créer un subscriber
  try {
    const subscriberResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'walewski.th@gmail.com',
        fields: {
          name: 'Thomas'
        }
      })
    });

    console.log('📧 Subscriber creation:', subscriberResponse.status, subscriberResponse.ok ? '✅' : '❌');
    
    if (!subscriberResponse.ok) {
      const errorText = await subscriberResponse.text();
      console.log('Erreur subscriber:', errorText);
    }
  } catch (error) {
    console.error('Erreur subscriber:', error.message);
  }

  // Test 2: Envoyer un email transactionnel via MailerSend
  try {
    const mailersendApiKey = process.env.MAILERSEND_API_KEY;
    
    if (!mailersendApiKey) {
      console.log('❌ MAILERSEND_API_KEY manquante - test MailerSend ignoré');
      return;
    }

    const emailPayload = {
      from: {
        email: 'noreply@date-mature.com',
        name: 'Date Mature'
      },
      to: [
        {
          email: 'walewski.th@gmail.com',
          name: 'Thomas'
        }
      ],
      subject: '🧪 Test Email MailerSend - Date Mature',
      html: '<h1>Test Email MailerSend</h1><p>Ceci est un test depuis Date Mature via MailerSend.</p>',
      text: 'Test Email MailerSend - Ceci est un test depuis Date Mature via MailerSend.'
    };

    const emailResponse = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailersendApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    console.log('📧 MailerSend email:', emailResponse.status, emailResponse.ok ? '✅' : '❌');
    
    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.log('Erreur MailerSend:', errorText);
    } else {
      const result = await emailResponse.json();
      console.log('✅ Email MailerSend envoyé avec succès:', result);
    }
  } catch (error) {
    console.error('Erreur MailerSend:', error.message);
  }
}

testEmailAPI();