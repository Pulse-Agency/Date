import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

async function finalCompleteRestore() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    // Vider complètement la base
    console.log('🗑️ Suppression complète...');
    await client.query('DELETE FROM users');
    
    // Restaurer les 23 profils avec * d'abord
    console.log('⭐ Restauration des profils avec *...');
    await client.query(`
      INSERT INTO users (
        "firstName", gender, age, city, region, bio, interests, photos, 
        subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
        "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
        "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
        "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
      ) VALUES 
      ('*Florence', 'F', 61, 'Bourges', 'Centre-Val de Loire', 'Bientôt retraitée, j''aimerai rencontrer un homme sincère', '["Cuisine","Jardinage"]', '["/uploads/photos/photo-1752222038574-51364542.jpg"]', 'gratuit', 'florence@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Anna', 'F', 44, 'Paris', 'Île-de-France', 'Plein de choses à découvrir en moi. Mais je ne sais pas me livrer facilement.', '["Voyages","Lecture"]', '["/uploads/photos/photo-1752221500498-724215295.jpg"]', 'gratuit', 'anna@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('* Anne Lise', 'F', 41, 'Paris', 'Île-de-France', 'Simple, coquette, amoureuse de la vie et des plaisirs simples', '["Danse","Voyages"]', '["/uploads/photos/photo-1752221601456-97779292.jpg"]', 'gratuit', 'anne.lise@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Barbara', 'F', 44, 'Paris', 'Île-de-France', 'Femme douce et fragile qui aimerait rencontre un homme attentionné et sincère', '["Culture","Lecture"]', '[]', 'gratuit', 'barbara@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Marjolaine', 'F', 54, 'Paris', 'Île-de-France', 'Passionnée de culture, j''aimerai pouvoir rencontrer quelqu''un pour sortir et peut être un peu plus', '["Culture","Voyages"]', '["/uploads/photos/photo-1752224583920-542568176.jpg"]', 'gratuit', 'marjolaine@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Astrid', 'F', 49, 'Saint-Étienne', 'Auvergne-Rhône-Alpes', 'Assez conventionnelle en amour mais suite à mon divorce je me dis que je peux changer', '["Sport","Voyages"]', '["/uploads/photos/photo-1752224296887-426460396.jpg"]', 'gratuit', 'astrid@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Aurélia', 'F', 43, 'Toulon', 'Provence-Alpes-Côte d''Azur', 'Femme dynamique qui aime la vie et les plaisirs simples', '["Cuisine","Lecture"]', '["/uploads/photos/photo-1752226502871-201100382.jpg"]', 'gratuit', 'aurelia@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Isadora', 'F', 40, 'Boulogne-Billancourt', 'Île-de-France', 'Pas envie de vieillir seule. oui, les hommes me "draguent" mais ce n''est pas forcément ce que je recherche', '["Danse","Culture"]', '[]', 'gratuit', 'isadora@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Annie', 'F', 60, 'Auch', 'Occitanie', 'On dit que je ne fais pas mon âge. Qu''en penses tu ?', '["Jardinage","Lecture"]', '["/uploads/photos/photo-1752221671140-305301883.jpg"]', 'gratuit', 'annie1@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Béatrice', 'F', 42, 'Carnon', 'Occitanie', 'Artiste amateur, je peins et dessine pour exprimer mes émotions', '["Art","Culture"]', '["/uploads/photos/photo-1752225986999-163484564.jpg"]', 'gratuit', 'beatrice@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Annie 2', 'F', 53, 'Colombes', 'Île-de-France', 'Epicurienne, sensuelle et romantique. J''aime les approches en douceur', '["Cuisine","Voyages"]', '["https://randomuser.me/api/portraits/women/25.jpg"]', 'gratuit', 'annie2@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Thalia', 'F', 45, 'Bayonne', 'Nouvelle-Aquitaine', 'J''ai l''air rêveuse sur cette photo. peut être que je le suis...', '["Lecture","Voyages"]', '["/uploads/photos/photo-1752229732661-65173068.jpg"]', 'gratuit', 'thalia@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Gaby', 'F', 63, 'Mont-de-Marsan', 'Nouvelle-Aquitaine', 'Trop seule depuis trop longtemps. Est-ce ma dernière chance ?', '["Lecture","Jardinage"]', '["/uploads/photos/photo-1752226725491-442633202.jpg"]', 'gratuit', 'gaby@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Philippine', 'F', 43, 'Rennes', 'Bretagne', 'Arrivée depuis peu dans la région, j''aimerai rencontrer quelqu''un de bien', '["Voyages","Sport"]', '["https://randomuser.me/api/portraits/women/36.jpg"]', 'gratuit', 'philippine@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Maude', 'F', 62, 'Montbéliard', 'Bourgogne-Franche-Comté', 'Amatrice de belles ballades et de soirées au coin du feu', '["Nature","Lecture"]', '[]', 'gratuit', 'maude@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Lucie', 'F', 43, 'Montbéliard', 'Bourgogne-Franche-Comté', 'Sportive, aventurière. Mais je pense que la plus belle aventure c''est l''amour', '["Sport","Voyages"]', '["/uploads/photos/photo-1752229814649-449484596.jpg"]', 'gratuit', 'lucie@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Annie 3', 'F', 45, 'Corte', 'Corse', 'J''aime les voyages, la cuisine, la lecture... et j''attends d''un homme du respect et du romantisme', '["Cuisine","Voyages"]', '["/uploads/photos/photo-1752221748695-64755712.jpg"]', 'gratuit', 'annie3@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Frédérique', 'F', 46, 'Calvi', 'Corse', 'On me dit souriante mais parfois je me dis que j''ai peut être trop donné', '["Culture","Lecture"]', '["https://randomuser.me/api/portraits/women/14.jpg"]', 'gratuit', 'frederique@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('* Anne', 'F', 45, 'Bordeaux', 'Nouvelle-Aquitaine', 'J''aime la vie et cherche LA bonne personne. mais ne sait pas si elle existe vraiment', '["Lecture","Cuisine"]', '["/uploads/photos/photo-1752221558577-525032751.jpg"]', 'gratuit', 'anne@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Stellina', 'F', 49, 'Saint-Étienne', 'Auvergne-Rhône-Alpes', 'Si tu sais être patient, attentionné et romantique, alors peut être que...', '["Lecture","Voyages"]', '["https://randomuser.me/api/portraits/women/58.jpg"]', 'gratuit', 'stellina@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Christina', 'F', 50, 'Marignane', 'Provence-Alpes-Côte d''Azur', 'J''aime sortir, les restaurants, les voyages et les hommes qui savent réfléchir posément', '["Voyages","Cuisine"]', '["https://randomuser.me/api/portraits/women/22.jpg"]', 'gratuit', 'christina@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Annie 4', 'F', 40, 'Boulogne-Billancourt', 'Île-de-France', 'On me dit rigolotte, mais je pense que j''ai d''autres qualités.', '["Danse","Lecture"]', '["https://randomuser.me/api/portraits/women/7.jpg"]', 'gratuit', 'annie4@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),
      ('*Christelle', 'F', 41, 'Haguenau', 'Grand Est', 'Romantique, marre des relations qui ne sont basées que sur le physique', '["Lecture","Culture"]', '["https://randomuser.me/api/portraits/women/68.jpg"]', 'gratuit', 'christelle@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW());
    `);
    
    // Lire et restaurer le backup complet
    console.log('📥 Restauration du backup complet...');
    const backupContent = JSON.parse(fs.readFileSync('backup-final-test.json', 'utf8'));
    const users = backupContent.data.users;
    
    console.log(`📊 ${users.length} profils à restaurer depuis backup`);
    
    let restored = 0;
    for (const user of users) {
      try {
        // Éviter les doublons avec les profils * déjà insérés
        if (user.firstName && user.firstName.startsWith('*')) {
          continue;
        }
        
        const query = `
          INSERT INTO users (
            "firstName", gender, age, city, region, bio, interests, photos, 
            subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
            "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
            "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
            "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `;
        
        // Gérer les photos
        let photos = [];
        if (user.photo) {
          photos = [user.photo];
        } else if (user.photos && Array.isArray(user.photos)) {
          photos = user.photos;
        }
        
        await client.query(query, [
          user.firstName || 'User',
          user.gender || 'F',
          user.age || 45,
          user.city || 'Paris',
          user.region || 'Île-de-France',
          user.bio || 'Profil utilisateur',
          JSON.stringify(user.interests || []),
          JSON.stringify(photos),
          user.subscription || 'gratuit',
          user.email || `user${restored}@example.com`,
          user.dailyFlashesUsed || 0,
          new Date(user.lastFlashReset || Date.now()),
          user.isTestProfile || false,
          user.referralCode || null,
          user.referredById || null,
          user.bonusFlashes || 0,
          user.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null,
          user.lookingForGender || 'both',
          user.lookingForAgeMin || 40,
          user.lookingForAgeMax || 75,
          user.lookingForDistance || 'same_region',
          user.lookingForRelationType || 'both',
          user.preferencesCompleted || false,
          new Date(user.createdAt || Date.now())
        ]);
        
        restored++;
        
        if (restored % 50 === 0) {
          console.log(`✅ ${restored} profils ajoutés...`);
        }
        
      } catch (error) {
        console.error(`❌ Erreur ${user.firstName}:`, error.message);
      }
    }
    
    // Génération rapide pour compléter à 1000+ profils
    console.log('🚀 Génération rapide pour compléter...');
    
    const currentCount = await client.query('SELECT COUNT(*) FROM users');
    const current = parseInt(currentCount.rows[0].count);
    const target = 1000;
    
    if (current < target) {
      const remaining = target - current;
      console.log(`➕ Ajout de ${remaining} profils supplémentaires...`);
      
      const prénoms = ['Marie', 'Catherine', 'Christine', 'Martine', 'Françoise', 'Monique', 'Isabelle', 'Sylvie', 'Nathalie', 'Valérie'];
      const villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
      const régions = ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie'];
      
      for (let i = 0; i < remaining; i++) {
        const prénom = prénoms[i % prénoms.length];
        const ville = villes[i % villes.length];
        const région = régions[i % régions.length];
        const âge = 40 + (i % 36);
        
        let subscription = 'gratuit';
        if (i % 8 === 0) subscription = 'premium';
        else if (i % 12 === 0) subscription = 'gold';
        
        await client.query(`
          INSERT INTO users (
            "firstName", gender, age, city, region, bio, interests, photos, 
            subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
            "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
            "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
            "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `, [
          prénom, 'F', âge, ville, région, 'Profil généré automatiquement',
          JSON.stringify(['Lecture', 'Voyages']),
          JSON.stringify([`https://randomuser.me/api/portraits/women/${i % 99}.jpg`]),
          subscription,
          `${prénom.toLowerCase()}${i}@example.com`,
          0, new Date(), false, null, null, 0, null,
          'both', 40, 75, 'same_region', 'both', false, new Date()
        ]);
      }
    }
    
    // Statistiques finales
    const finalStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE "firstName" LIKE '*%') as star_profiles,
        COUNT(*) FILTER (WHERE subscription = 'premium') as premium,
        COUNT(*) FILTER (WHERE subscription = 'gold') as gold,
        COUNT(*) FILTER (WHERE photos != '[]' AND photos IS NOT NULL) as with_photos
      FROM users
    `);
    
    console.log('🎉 RESTAURATION TERMINÉE');
    console.log('📊 Statistiques finales:', finalStats.rows[0]);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.end();
  }
}

finalCompleteRestore();