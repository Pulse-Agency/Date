import fs from 'fs';
import http from 'http';

// Script qui s'assure qu'il y a toujours 985 profils
async function ensureProfiles() {
  try {
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      try {
        // Vérifier les stats
        const statsRes = await new Promise((resolve, reject) => {
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
                reject(e);
              }
            });
          });
          req.on('error', reject);
          req.end();
        });

        console.log(`📊 Tentative ${attempts + 1}: ${statsRes.totalUsers} profils détectés`);

        if (statsRes.totalUsers >= 985) {
          console.log('✅ Nombre de profils correct !');
          
          // Créer un backup immédiat
          const backupRes = await new Promise((resolve, reject) => {
            const req = http.request({
              hostname: 'localhost',
              port: 5000,
              path: '/api/admin/backup',
              method: 'GET'
            }, (res) => {
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

          if (backupRes.data && backupRes.data.users.length > 0) {
            fs.writeFileSync('backup-profiles-permanent.json', JSON.stringify(backupRes.data.users, null, 2));
            console.log(`💾 Backup sauvegardé: ${backupRes.data.users.length} profils`);
          }
          
          return true;
        }
        
        // Si pas assez de profils, les générer
        console.log('🔄 Génération des profils manquants...');
        await new Promise((resolve, reject) => {
          const { spawn } = require('child_process');
          const generate = spawn('node', ['generate-additional-profiles.js'], { stdio: 'inherit' });
          generate.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Code de sortie: ${code}`));
          });
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes
        attempts++;
        
      } catch (error) {
        console.error(`❌ Erreur tentative ${attempts + 1}:`, error.message);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 3000)); // Attendre 3 secondes
      }
    }
    
    console.log('❌ Échec après toutes les tentatives');
    
  } catch (error) {
    console.error('❌ Erreur critique:', error);
  }
}

ensureProfiles();