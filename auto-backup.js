import fs from 'fs';
import http from 'http';

// Sauvegarde automatique toutes les 30 secondes
async function createAutoBackup() {
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/stats',
      method: 'GET'
    };

    const statsRes = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    console.log(`📊 Vérification: ${statsRes.totalUsers} profils en mémoire`);

    if (statsRes.totalUsers > 0) {
      // Créer backup depuis l'API
      const backupOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/users?limit=2000', // Récupérer tous les profils
        method: 'GET'
      };

      const usersRes = await new Promise((resolve, reject) => {
        const req = http.request(backupOptions, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });
        req.on('error', reject);
        req.end();
      });

      if (usersRes.users && usersRes.users.length > 0) {
        const backup = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          data: {
            users: usersRes.users
          }
        };

        // Sauvegarder dans un fichier persistant
        const filename = `auto-backup-${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
        
        // Mettre à jour le backup permanent
        fs.writeFileSync('backup-profiles-permanent.json', JSON.stringify(usersRes.users, null, 2));
        
        console.log(`✅ Backup automatique créé: ${filename} (${usersRes.users.length} profils)`);
      }
    } else {
      console.log('⚠️ Aucun profil en mémoire, restauration nécessaire');
      // Relancer la restauration
      const { spawn } = await import('child_process');
      const restore = spawn('node', ['generate-additional-profiles.js'], { stdio: 'inherit' });
    }

  } catch (error) {
    console.error('❌ Erreur backup automatique:', error.message);
  }
}

// Lancer le backup périodique
console.log('🔄 Démarrage du système de backup automatique...');
setInterval(createAutoBackup, 30000); // Toutes les 30 secondes
createAutoBackup(); // Premier backup immédiat