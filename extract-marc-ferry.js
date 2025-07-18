const XLSX = require('xlsx');
const fs = require('fs');

console.log('📊 Lecture du fichier Excel pour retrouver les données de Marc Ferry...');

try {
  // Lire le fichier Excel
  const workbook = XLSX.readFile('attached_assets/profils_date_mature_1751526991551.xlsx');
  
  // Obtenir la première feuille
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convertir en JSON
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`📋 ${data.length} profils trouvés dans le fichier Excel`);
  
  // Chercher Marc Ferry (vérifier différentes variantes)
  const marcProfiles = data.filter(profile => {
    const name = (profile.Prénom || profile.Nom || profile.firstName || profile.name || '').toString().toLowerCase();
    return name.includes('marc');
  });
  
  if (marcProfiles.length > 0) {
    console.log('🎯 Profil(s) Marc trouvé(s):');
    marcProfiles.forEach((profile, index) => {
      console.log(`\n--- Marc Ferry ${index + 1} ---`);
      console.log(JSON.stringify(profile, null, 2));
    });
    
    // Sauvegarder les résultats
    fs.writeFileSync('marc-ferry-original.json', JSON.stringify(marcProfiles, null, 2));
    console.log('\n💾 Données sauvegardées dans marc-ferry-original.json');
  } else {
    console.log('❌ Aucun profil Marc trouvé dans le fichier Excel');
    console.log('\n📋 Aperçu des colonnes disponibles:');
    if (data.length > 0) {
      console.log(Object.keys(data[0]));
    }
    
    console.log('\n📋 Premier profil pour référence:');
    if (data.length > 0) {
      console.log(JSON.stringify(data[0], null, 2));
    }
  }
  
} catch (error) {
  console.error('❌ Erreur lors de la lecture du fichier Excel:', error.message);
}