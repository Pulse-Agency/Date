// Script simple pour ajouter les régions via l'API REST

const regions = {
  'Paris': 'Île-de-France', 'Versailles': 'Île-de-France', 'Nanterre': 'Île-de-France',
  'Rouen': 'Normandie', 'Caen': 'Normandie', 'Le Havre': 'Normandie', 'Cherbourg': 'Normandie',
  'Orléans': 'Centre-Val de Loire', 'Tours': 'Centre-Val de Loire', 'Blois': 'Centre-Val de Loire', 
  'Bourges': 'Centre-Val de Loire', 'Chartres': 'Centre-Val de Loire', 'Châteauroux': 'Centre-Val de Loire',
  'Chinon': 'Centre-Val de Loire', 'Vendôme': 'Centre-Val de Loire',
  'Nantes': 'Pays de la Loire', 'Angers': 'Pays de la Loire', 'Le Mans': 'Pays de la Loire',
  'Rennes': 'Bretagne', 'Brest': 'Bretagne', 'Quimper': 'Bretagne', 'Vannes': 'Bretagne',
  'Bordeaux': 'Nouvelle-Aquitaine', 'Poitiers': 'Nouvelle-Aquitaine', 'La Rochelle': 'Nouvelle-Aquitaine',
  'Toulouse': 'Occitanie', 'Montpellier': 'Occitanie', 'Nîmes': 'Occitanie', 'Perpignan': 'Occitanie',
  'Lyon': 'Auvergne-Rhône-Alpes', 'Grenoble': 'Auvergne-Rhône-Alpes', 'Saint-Étienne': 'Auvergne-Rhône-Alpes',
  'Marseille': 'Provence-Alpes-Côte d\'Azur', 'Nice': 'Provence-Alpes-Côte d\'Azur', 'Toulon': 'Provence-Alpes-Côte d\'Azur',
  'Dijon': 'Bourgogne-Franche-Comté', 'Besançon': 'Bourgogne-Franche-Comté',
  'Strasbourg': 'Grand Est', 'Reims': 'Grand Est', 'Metz': 'Grand Est', 'Nancy': 'Grand Est',
  'Lille': 'Hauts-de-France', 'Amiens': 'Hauts-de-France', 'Calais': 'Hauts-de-France'
};

async function addRegions() {
  try {
    console.log('Récupération des utilisateurs...');
    const response = await fetch('http://localhost:5000/api/admin/users');
    const users = await response.json();
    
    let updated = 0;
    let total = users.length;
    
    for (const user of users) {
      if (!user.region && regions[user.city]) {
        console.log(`Mise à jour ${user.firstName} (${user.city}) → ${regions[user.city]}`);
        
        const updateResponse = await fetch(`http://localhost:5000/api/admin/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ region: regions[user.city] })
        });
        
        if (updateResponse.ok) {
          updated++;
        } else {
          console.error(`Erreur pour ${user.firstName}:`, await updateResponse.text());
        }
      }
    }
    
    console.log(`\n✅ ${updated} profils mis à jour sur ${total}`);
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

addRegions();