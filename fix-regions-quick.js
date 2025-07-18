// Script rapide pour corriger les régions via l'API
const users = [
  {id: 17, city: 'Chartres', region: 'Centre-Val de Loire'},
  {id: 18, city: 'Vendôme', region: 'Centre-Val de Loire'},
  {id: 19, city: 'Chinon', region: 'Centre-Val de Loire'},
  {id: 20, city: 'Le Havre', region: 'Normandie'},
  {id: 21, city: 'Blois', region: 'Centre-Val de Loire'},
  {id: 22, city: 'Tours', region: 'Centre-Val de Loire'},
  {id: 23, city: 'Chartres', region: 'Centre-Val de Loire'},
  {id: 24, city: 'Blois', region: 'Centre-Val de Loire'},
  {id: 25, city: 'Tours', region: 'Centre-Val de Loire'},
  {id: 26, city: 'Orléans', region: 'Centre-Val de Loire'}
];

async function updateRegions() {
  for (const user of users) {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: user.region })
      });
      
      if (response.ok) {
        console.log(`✅ ${user.id}: ${user.city} → ${user.region}`);
      } else {
        console.log(`❌ ${user.id}: Erreur`);
      }
    } catch (error) {
      console.log(`❌ ${user.id}: ${error.message}`);
    }
  }
}

updateRegions();