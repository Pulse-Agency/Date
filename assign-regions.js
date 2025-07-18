import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';

// Map des villes vers leurs régions
const cityToRegion = {
  // Île-de-France
  'Paris': 'Île-de-France',
  'Versailles': 'Île-de-France',
  'Nanterre': 'Île-de-France',
  'Créteil': 'Île-de-France',
  'Melun': 'Île-de-France',
  'Pontoise': 'Île-de-France',
  'Évry': 'Île-de-France',
  'Bobigny': 'Île-de-France',
  'Saint-Denis': 'Île-de-France',
  'Meaux': 'Île-de-France',
  'Fontainebleau': 'Île-de-France',
  'Palaiseau': 'Île-de-France',
  
  // Normandie
  'Rouen': 'Normandie',
  'Caen': 'Normandie',
  'Le Havre': 'Normandie',
  'Cherbourg': 'Normandie',
  'Évreux': 'Normandie',
  'Alençon': 'Normandie',
  'Lisieux': 'Normandie',
  'Bayeux': 'Normandie',
  'Dieppe': 'Normandie',
  'Fécamp': 'Normandie',
  
  // Centre-Val de Loire
  'Orléans': 'Centre-Val de Loire',
  'Tours': 'Centre-Val de Loire',
  'Blois': 'Centre-Val de Loire',
  'Bourges': 'Centre-Val de Loire',
  'Chartres': 'Centre-Val de Loire',
  'Châteauroux': 'Centre-Val de Loire',
  'Chinon': 'Centre-Val de Loire',
  'Vendôme': 'Centre-Val de Loire',
  'Montargis': 'Centre-Val de Loire',
  'Amboise': 'Centre-Val de Loire',
  
  // Pays de la Loire
  'Nantes': 'Pays de la Loire',
  'Angers': 'Pays de la Loire',
  'Le Mans': 'Pays de la Loire',
  'Laval': 'Pays de la Loire',
  'La Roche-sur-Yon': 'Pays de la Loire',
  'Saint-Nazaire': 'Pays de la Loire',
  'Cholet': 'Pays de la Loire',
  'Saumur': 'Pays de la Loire',
  'Mayenne': 'Pays de la Loire',
  'Les Sables-d\'Olonne': 'Pays de la Loire',
  
  // Bretagne
  'Rennes': 'Bretagne',
  'Brest': 'Bretagne',
  'Quimper': 'Bretagne',
  'Vannes': 'Bretagne',
  'Saint-Malo': 'Bretagne',
  'Lorient': 'Bretagne',
  'Saint-Brieuc': 'Bretagne',
  'Fougères': 'Bretagne',
  'Lannion': 'Bretagne',
  'Morlaix': 'Bretagne',
  
  // Nouvelle-Aquitaine
  'Bordeaux': 'Nouvelle-Aquitaine',
  'Poitiers': 'Nouvelle-Aquitaine',
  'La Rochelle': 'Nouvelle-Aquitaine',
  'Limoges': 'Nouvelle-Aquitaine',
  'Pau': 'Nouvelle-Aquitaine',
  'Bayonne': 'Nouvelle-Aquitaine',
  'Angoulême': 'Nouvelle-Aquitaine',
  'Périgueux': 'Nouvelle-Aquitaine',
  'Niort': 'Nouvelle-Aquitaine',
  'Agen': 'Nouvelle-Aquitaine',
  'Mont-de-Marsan': 'Nouvelle-Aquitaine',
  'Cognac': 'Nouvelle-Aquitaine',
  
  // Occitanie
  'Toulouse': 'Occitanie',
  'Montpellier': 'Occitanie',
  'Nîmes': 'Occitanie',
  'Perpignan': 'Occitanie',
  'Béziers': 'Occitanie',
  'Carcassonne': 'Occitanie',
  'Albi': 'Occitanie',
  'Castres': 'Occitanie',
  'Cahors': 'Occitanie',
  'Tarbes': 'Occitanie',
  'Rodez': 'Occitanie',
  'Auch': 'Occitanie',
  'Millau': 'Occitanie',
  
  // Auvergne-Rhône-Alpes
  'Lyon': 'Auvergne-Rhône-Alpes',
  'Grenoble': 'Auvergne-Rhône-Alpes',
  'Saint-Étienne': 'Auvergne-Rhône-Alpes',
  'Clermont-Ferrand': 'Auvergne-Rhône-Alpes',
  'Annecy': 'Auvergne-Rhône-Alpes',
  'Valence': 'Auvergne-Rhône-Alpes',
  'Chambéry': 'Auvergne-Rhône-Alpes',
  'Roanne': 'Auvergne-Rhône-Alpes',
  'Montluçon': 'Auvergne-Rhône-Alpes',
  'Aurillac': 'Auvergne-Rhône-Alpes',
  'Le Puy-en-Velay': 'Auvergne-Rhône-Alpes',
  'Privas': 'Auvergne-Rhône-Alpes',
  'Villefranche-sur-Saône': 'Auvergne-Rhône-Alpes',
  
  // Provence-Alpes-Côte d'Azur
  'Marseille': 'Provence-Alpes-Côte d\'Azur',
  'Nice': 'Provence-Alpes-Côte d\'Azur',
  'Toulon': 'Provence-Alpes-Côte d\'Azur',
  'Aix-en-Provence': 'Provence-Alpes-Côte d\'Azur',
  'Cannes': 'Provence-Alpes-Côte d\'Azur',
  'Avignon': 'Provence-Alpes-Côte d\'Azur',
  'Antibes': 'Provence-Alpes-Côte d\'Azur',
  'Gap': 'Provence-Alpes-Côte d\'Azur',
  'Digne-les-Bains': 'Provence-Alpes-Côte d\'Azur',
  'Grasse': 'Provence-Alpes-Côte d\'Azur',
  'Fréjus': 'Provence-Alpes-Côte d\'Azur',
  'Hyères': 'Provence-Alpes-Côte d\'Azur',
  
  // Bourgogne-Franche-Comté
  'Dijon': 'Bourgogne-Franche-Comté',
  'Besançon': 'Bourgogne-Franche-Comté',
  'Chalon-sur-Saône': 'Bourgogne-Franche-Comté',
  'Auxerre': 'Bourgogne-Franche-Comté',
  'Mâcon': 'Bourgogne-Franche-Comté',
  'Nevers': 'Bourgogne-Franche-Comté',
  'Belfort': 'Bourgogne-Franche-Comté',
  'Montbéliard': 'Bourgogne-Franche-Comté',
  'Dole': 'Bourgogne-Franche-Comté',
  'Lons-le-Saunier': 'Bourgogne-Franche-Comté',
  'Vesoul': 'Bourgogne-Franche-Comté',
  'Sens': 'Bourgogne-Franche-Comté',
  'Beaune': 'Bourgogne-Franche-Comté',
  
  // Grand Est
  'Strasbourg': 'Grand Est',
  'Reims': 'Grand Est',
  'Metz': 'Grand Est',
  'Nancy': 'Grand Est',
  'Mulhouse': 'Grand Est',
  'Colmar': 'Grand Est',
  'Troyes': 'Grand Est',
  'Charleville-Mézières': 'Grand Est',
  'Épinal': 'Grand Est',
  'Châlons-en-Champagne': 'Grand Est',
  'Chaumont': 'Grand Est',
  'Bar-le-Duc': 'Grand Est',
  'Sedan': 'Grand Est',
  'Thionville': 'Grand Est',
  'Verdun': 'Grand Est',
  
  // Hauts-de-France
  'Lille': 'Hauts-de-France',
  'Amiens': 'Hauts-de-France',
  'Roubaix': 'Hauts-de-France',
  'Tourcoing': 'Hauts-de-France',
  'Calais': 'Hauts-de-France',
  'Dunkerque': 'Hauts-de-France',
  'Arras': 'Hauts-de-France',
  'Valenciennes': 'Hauts-de-France',
  'Douai': 'Hauts-de-France',
  'Cambrai': 'Hauts-de-France',
  'Beauvais': 'Hauts-de-France',
  'Compiègne': 'Hauts-de-France',
  'Saint-Quentin': 'Hauts-de-France',
  'Laon': 'Hauts-de-France',
  'Soissons': 'Hauts-de-France',
  
  // Corse
  'Ajaccio': 'Corse',
  'Bastia': 'Corse',
  'Porto-Vecchio': 'Corse',
  'Calvi': 'Corse',
  'Corte': 'Corse',
  'Propriano': 'Corse',
  'Bonifacio': 'Corse',
  'Ghisonaccia': 'Corse',
  'Sartène': 'Corse',
  'L\'Île-Rousse': 'Corse'
};

async function assignRegionsToProfiles() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL non défini');
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    console.log('🔄 Récupération des profils sans région...');
    const allUsers = await db.select().from(users);
    
    let updated = 0;
    let notFound = 0;
    
    for (const user of allUsers) {
      if (!user.region || user.region === null) {
        const region = cityToRegion[user.city];
        if (region) {
          await db.update(users)
            .set({ region })
            .where(eq(users.id, user.id));
          updated++;
          console.log(`✅ ${user.firstName} (${user.city}) → ${region}`);
        } else {
          notFound++;
          console.log(`❌ ${user.firstName} (${user.city}) → région non trouvée`);
        }
      }
    }
    
    console.log(`\n🎯 Résultats:`);
    console.log(`   - ${updated} profils mis à jour`);
    console.log(`   - ${notFound} villes non trouvées`);
    console.log(`   - ${allUsers.length - updated - notFound} profils déjà avec région`);
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await pool.end();
  }
}

assignRegionsToProfiles();