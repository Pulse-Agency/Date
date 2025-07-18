import fs from 'fs';
import http from 'http';

// Compter profils dans le backup
if (fs.existsSync('backup-profiles-permanent.json')) {
  const backupProfiles = JSON.parse(fs.readFileSync('backup-profiles-permanent.json', 'utf8'));
  console.log(`Profils dans backup-profiles-permanent.json: ${backupProfiles.length}`);
}

// Vérifier les autres fichiers de backup
if (fs.existsSync('backup-marc-ferry-final.json')) {
  const marcFerryProfiles = JSON.parse(fs.readFileSync('backup-marc-ferry-final.json', 'utf8'));
  console.log(`Profils dans backup-marc-ferry-final.json: ${marcFerryProfiles.length}`);
}

// Appel API pour compter les profils actuels
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/stats',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const stats = JSON.parse(data);
      console.log(`Profils actuels selon l'API: ${stats.totalUsers}`);
    } catch (e) {
      console.log('Erreur parsing API response:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Erreur requête API:', error);
});

req.end();