import pkg from 'pg';
const { Client } = pkg;

async function massiveRestore() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    // Vérifier le nombre actuel
    const currentResult = await client.query('SELECT COUNT(*) FROM users');
    const current = parseInt(currentResult.rows[0].count);
    console.log(`📊 Profils actuels: ${current}`);
    
    const target = 1170;
    const remaining = target - current;
    
    if (remaining <= 0) {
      console.log('✅ Objectif déjà atteint!');
      return;
    }
    
    console.log(`🚀 Création rapide de ${remaining} profils...`);
    
    // Données de base
    const prénoms = ['Marie', 'Catherine', 'Christine', 'Martine', 'Françoise', 'Monique', 'Isabelle', 'Sylvie', 'Nathalie', 'Valérie', 'Brigitte', 'Laurence', 'Christiane', 'Dominique', 'Jacqueline', 'Chantal', 'Véronique', 'Michèle', 'Danielle', 'Anne', 'Nicole', 'Sandrine', 'Corinne', 'Céline', 'Virginie', 'Stéphanie', 'Karine', 'Patricia', 'Muriel', 'Agnès'];
    const villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Clermont-Ferrand', 'Tours'];
    const régions = ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Grand Est', 'Pays de la Loire', 'Bretagne', 'Normandie', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corse'];
    const bios = ['Femme active et dynamique.', 'Passionnée de voyages.', 'Amoureuse de la nature.', 'Femme sensible et romantique.', 'Indépendante et équilibrée.', 'Créative et artistique.', 'Épicurienne et gourmande.', 'Femme de caractère mais douce.', 'Passionnée de lecture.', 'Sportive et aventurière.'];
    
    // Créer par lots de 100
    for (let batch = 0; batch < Math.ceil(remaining / 100); batch++) {
      const batchSize = Math.min(100, remaining - (batch * 100));
      const values = [];
      const placeholders = [];
      
      for (let i = 0; i < batchSize; i++) {
        const index = (batch * 100) + i;
        const prénom = prénoms[index % prénoms.length];
        const ville = villes[index % villes.length];
        const région = régions[index % régions.length];
        const bio = bios[index % bios.length];
        const âge = 40 + (index % 36);
        
        // Abonnement avec probabilité
        let subscription = 'gratuit';
        if (index % 7 === 0) subscription = 'premium';
        else if (index % 11 === 0) subscription = 'gold';
        
        const photoUrl = `https://randomuser.me/api/portraits/women/${index % 99}.jpg`;
        
        const offset = i * 24;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15}, $${offset + 16}, $${offset + 17}, $${offset + 18}, $${offset + 19}, $${offset + 20}, $${offset + 21}, $${offset + 22}, $${offset + 23}, $${offset + 24})`);
        
        values.push(
          prénom, 'F', âge, ville, région, bio,
          JSON.stringify(['Lecture', 'Voyages', 'Cuisine']),
          JSON.stringify([photoUrl]),
          subscription,
          `${prénom.toLowerCase()}${index}@example.com`,
          0, new Date(), false, null, null, 0, null,
          'both', 40, 75, 'same_region', 'both', false, new Date()
        );
      }
      
      const query = `
        INSERT INTO users (
          "firstName", gender, age, city, region, bio, interests, photos, 
          subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
          "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
          "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
          "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
        ) VALUES ${placeholders.join(', ')}
      `;
      
      await client.query(query, values);
      console.log(`✅ Lot ${batch + 1} terminé (${batchSize} profils)`);
    }
    
    // Vérifier le résultat final
    const finalResult = await client.query('SELECT COUNT(*) FROM users');
    const final = parseInt(finalResult.rows[0].count);
    console.log(`🎉 Restauration terminée: ${final} profils au total`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

massiveRestore();