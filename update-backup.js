import fs from 'fs';
import http from 'http';

console.log('Mise à jour de la sauvegarde des profils...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/backup',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const backup = JSON.parse(data);
      const users = backup.data.users;
      
      console.log(`Nombre total de profils actuels: ${users.length}`);
      
      // Sauvegarder les profils
      fs.writeFileSync('backup-profiles-permanent.json', JSON.stringify(users, null, 2));
      console.log('✅ Sauvegarde mise à jour dans backup-profiles-permanent.json');
      
      // Compter par région pour statistiques
      const regions = {};
      users.forEach(user => {
        const city = user.city || 'Inconnu';
        regions[city] = (regions[city] || 0) + 1;
      });
      
      console.log('\nRépartition par ville (top 10):');
      Object.entries(regions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([city, count]) => {
          console.log(`  ${city}: ${count} profils`);
        });
        
    } catch (e) {
      console.error('Erreur parsing réponse API:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Erreur requête API:', error);
});

req.end();