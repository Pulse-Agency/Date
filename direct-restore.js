import fs from 'fs';
import http from 'http';

async function restoreProfiles() {
  try {
    console.log('🔄 Restauration directe des profils...');
    
    // Lire le backup permanent
    if (!fs.existsSync('backup-profiles-permanent.json')) {
      console.log('❌ Fichier backup introuvable');
      return;
    }
    
    const profiles = JSON.parse(fs.readFileSync('backup-profiles-permanent.json', 'utf8'));
    console.log(`📄 ${profiles.length} profils trouvés dans le backup`);
    
    let restored = 0;
    
    // Restaurer chaque profil via l'API
    for (const profile of profiles) {
      try {
        const postData = JSON.stringify({
          firstName: profile.firstName,
          gender: profile.gender || 'F',
          age: profile.age,
          city: profile.city,
          bio: profile.bio,
          interests: profile.interests || [],
          photo: profile.photo,
          subscription: profile.subscription || 'gratuit',
          email: profile.email || `${profile.firstName.toLowerCase()}${profile.age}@date-mature.test`
        });

        const options = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/users',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        await new Promise((resolve, reject) => {
          const req = http.request(options, (res) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
              restored++;
              if (restored % 100 === 0) {
                console.log(`✅ ${restored} profils restaurés...`);
              }
              resolve(true);
            } else {
              reject(new Error(`Status: ${res.statusCode}`));
            }
          });
          req.on('error', reject);
          req.write(postData);
          req.end();
        });
        
      } catch (error) {
        console.error(`❌ Erreur profil ${profile.firstName}:`, error.message);
      }
    }
    
    console.log(`🎉 Restauration terminée: ${restored} profils restaurés`);
    
    // Vérifier le résultat
    const stats = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/stats',
        method: 'GET'
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({totalUsers: 0});
          }
        });
      });
      req.on('error', () => resolve({totalUsers: 0}));
      req.end();
    });
    
    console.log(`📊 Vérification: ${stats.totalUsers} utilisateurs en base`);
    
  } catch (error) {
    console.error('❌ Erreur restauration:', error);
  }
}

restoreProfiles();