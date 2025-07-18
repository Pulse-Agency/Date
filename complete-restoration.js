import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

// Fonction pour générer des profils supplémentaires directement en base
async function generateMassiveProfiles() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    // Vérifier le nombre actuel
    const currentCount = await client.query('SELECT COUNT(*) FROM users');
    const current = parseInt(currentCount.rows[0].count);
    
    console.log(`📊 Profils actuels: ${current}`);
    
    if (current >= 1000) {
      console.log('✅ Objectif atteint!');
      return;
    }
    
    const target = 1170;
    const toCreate = target - current;
    
    console.log(`🎯 Création de ${toCreate} profils supplémentaires...`);
    
    const prénoms = [
      'Marie', 'Catherine', 'Christine', 'Martine', 'Françoise', 'Monique', 'Isabelle', 
      'Sylvie', 'Nathalie', 'Valérie', 'Brigitte', 'Laurence', 'Christiane', 'Dominique',
      'Jacqueline', 'Chantal', 'Véronique', 'Michèle', 'Danielle', 'Anne', 'Nicole',
      'Sandrine', 'Corinne', 'Céline', 'Virginie', 'Stéphanie', 'Karine', 'Patricia',
      'Muriel', 'Agnès', 'Joëlle', 'Mireille', 'Hélène', 'Josette', 'Colette'
    ];
    
    const villes = [
      'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
      'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon',
      'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Clermont-Ferrand', 'Le Mans',
      'Aix-en-Provence', 'Brest', 'Tours', 'Amiens', 'Limoges', 'Annecy', 'Perpignan',
      'Besançon', 'Metz', 'Orléans', 'Mulhouse', 'Rouen', 'Caen', 'Nancy'
    ];
    
    const régions = [
      'Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine',
      'Occitanie', 'Hauts-de-France', 'Grand Est', 'Pays de la Loire', 'Bretagne', 'Normandie',
      'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corse'
    ];
    
    const bios = [
      'Femme active et dynamique, j\'aime la vie et les nouvelles rencontres.',
      'Passionnée de voyages et de culture, je cherche quelqu\'un de sincère.',
      'Sportive et aventurière, j\'apprécie les moments simples de la vie.',
      'Amoureuse de la nature et des balades, je recherche une relation sérieuse.',
      'Femme sensible et romantique, j\'aime les sorties culturelles.',
      'Indépendante et équilibrée, je souhaite partager de beaux moments.',
      'Créative et artistique, je cherche l\'âme sœur pour une belle histoire.',
      'Épicurienne et gourmande, j\'apprécie les plaisirs de la table.',
      'Femme de caractère mais douce, je crois encore en l\'amour.',
      'Passionnée de lecture et de cinéma, je recherche un complice.'
    ];
    
    const intérêts = [
      ['Voyage', 'Lecture', 'Cuisine'],
      ['Sport', 'Nature', 'Musique'],
      ['Culture', 'Théâtre', 'Art'],
      ['Jardinage', 'Bricolage', 'Décoration'],
      ['Danse', 'Yoga', 'Bien-être'],
      ['Photographie', 'Randonnée', 'Vélo'],
      ['Cinéma', 'Restaurants', 'Sorties'],
      ['Tricot', 'Couture', 'Artisanat'],
      ['Bénévolat', 'Animaux', 'Solidarité'],
      ['Jeux', 'Puzzles', 'Mots croisés']
    ];
    
    // Créer les profils par lots
    for (let i = 0; i < toCreate; i += 50) {
      const batchSize = Math.min(50, toCreate - i);
      const promises = [];
      
      for (let j = 0; j < batchSize; j++) {
        const profileIndex = i + j;
        
        const prénom = prénoms[Math.floor(Math.random() * prénoms.length)];
        const ville = villes[Math.floor(Math.random() * villes.length)];
        const région = régions[Math.floor(Math.random() * régions.length)];
        const bio = bios[Math.floor(Math.random() * bios.length)];
        const interests = intérêts[Math.floor(Math.random() * intérêts.length)];
        const âge = Math.floor(Math.random() * 36) + 40; // 40-75 ans
        
        // Probabilité d'abonnement
        let subscription = 'gratuit';
        const rand = Math.random();
        if (rand < 0.15) subscription = 'premium';
        else if (rand < 0.25) subscription = 'gold';
        
        const photoUrl = `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 99)}.jpg`;
        
        const query = `
          INSERT INTO users (
            "firstName", gender, age, city, region, bio, interests, photos, 
            subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
            "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
            "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
            "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `;
        
        promises.push(client.query(query, [
          prénom, 'F', âge, ville, région, bio,
          JSON.stringify(interests), JSON.stringify([photoUrl]),
          subscription, `${prénom.toLowerCase()}${profileIndex}@example.com`,
          0, new Date(), false, null, null, 0, null,
          'both', 40, 75, 'same_region', 'both', false, new Date()
        ]));
      }
      
      await Promise.all(promises);
      console.log(`✅ Lot ${Math.floor(i/50) + 1} terminé (${i + batchSize} profils créés)`);
    }
    
    // Vérifier le résultat final
    const finalCount = await client.query('SELECT COUNT(*) FROM users');
    const final = parseInt(finalCount.rows[0].count);
    
    console.log(`🎉 Restauration terminée: ${final} profils au total`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.end();
  }
}

generateMassiveProfiles();