import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const firstNames = {
  F: ['Marie', 'Isabelle', 'Catherine', 'Sylvie', 'Martine', 'Nathalie', 'Françoise', 'Brigitte', 'Monique', 'Valérie', 'Patricia', 'Corinne', 'Véronique', 'Dominique', 'Chantal', 'Jacqueline', 'Christine', 'Michèle', 'Nicole', 'Annie', 'Danielle', 'Pascale', 'Joëlle', 'Laurence', 'Béatrice', 'Sabine', 'Sandrine', 'Céline', 'Nadine', 'Carole'],
  H: ['Pierre', 'Michel', 'Jean', 'Philippe', 'Alain', 'Bernard', 'Gérard', 'André', 'Claude', 'Daniel', 'Francis', 'Patrick', 'Henri', 'Christian', 'Robert', 'Pascal', 'Thierry', 'Didier', 'Laurent', 'Olivier', 'Serge', 'Bruno', 'Frédéric', 'Stéphane', 'Denis', 'Marc', 'Christophe', 'Jacques', 'Éric', 'Dominique']
};

const cities = [
  { name: 'Paris', region: 'Île-de-France' },
  { name: 'Lyon', region: 'Auvergne-Rhône-Alpes' },
  { name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Toulouse', region: 'Occitanie' },
  { name: 'Nice', region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Nantes', region: 'Pays de la Loire' },
  { name: 'Strasbourg', region: 'Grand Est' },
  { name: 'Montpellier', region: 'Occitanie' },
  { name: 'Bordeaux', region: 'Nouvelle-Aquitaine' },
  { name: 'Lille', region: 'Hauts-de-France' },
  { name: 'Rennes', region: 'Bretagne' },
  { name: 'Reims', region: 'Grand Est' },
  { name: 'Tours', region: 'Centre-Val de Loire' },
  { name: 'Angers', region: 'Pays de la Loire' },
  { name: 'Dijon', region: 'Bourgogne-Franche-Comté' }
];

const interests = ['Voyages', 'Lecture', 'Cuisine', 'Jardinage', 'Randonnée', 'Cinéma', 'Danse', 'Natation', 'Photographie', 'Musique', 'Tricot', 'Bricolage', 'Yoga', 'Pêche', 'Cyclisme', 'Histoire', 'Bénévolat'];

const bios = [
  'Cherche compagnon pour partager les plaisirs de la vie',
  'Amoureuse de la vie, cherche relation sérieuse',
  'Homme passionné de nature, cherche compagne pour aventures',
  'Femme dynamique, aime voyager et découvrir',
  'Cherche l\'âme sœur pour relation durable',
  'Passionné de culture, cherche compagne cultivée',
  'Femme sensible, aime les balades et la tranquillité',
  'Homme généreux, cherche femme pour partage',
  'Aime la simplicité et les moments authentiques',
  'Cherche compagnon pour profiter de la retraite'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInterests() {
  const count = Math.floor(Math.random() * 4) + 2;
  const selected = [];
  while (selected.length < count) {
    const interest = getRandomElement(interests);
    if (!selected.includes(interest)) {
      selected.push(interest);
    }
  }
  return selected;
}

async function generateProfiles() {
  try {
    console.log('🔄 Génération de profils...');
    
    // Générer 1000 profils
    const profiles = [];
    for (let i = 0; i < 1000; i++) {
      const gender = Math.random() > 0.3 ? 'F' : 'H';
      const firstName = getRandomElement(firstNames[gender]);
      const city = getRandomElement(cities);
      const age = Math.floor(Math.random() * 36) + 40; // 40-75
      const subscription = Math.random() > 0.85 ? (Math.random() > 0.7 ? 'gold' : 'premium') : 'gratuit';
      const photoId = Math.floor(Math.random() * 90) + 10;
      const photo = `https://randomuser.me/api/portraits/${gender === 'H' ? 'men' : 'women'}/${photoId}.jpg`;
      
      profiles.push({
        firstName,
        email: `${firstName.toLowerCase()}${i}@example.com`,
        gender,
        age,
        city: city.name,
        region: city.region,
        bio: getRandomElement(bios),
        interests: getRandomInterests(),
        photos: [photo],
        subscription
      });
    }
    
    // Insérer en base
    let inserted = 0;
    for (const profile of profiles) {
      try {
        await pool.query(`
          INSERT INTO users (
            "firstName", email, gender, age, city, region, bio, 
            interests, photos, subscription, "dailyFlashesUsed", "lastFlashReset",
            "isTestProfile", "lookingForGender", "lookingForAgeMin", 
            "lookingForAgeMax", "lookingForDistance", "lookingForRelationType",
            "preferencesCompleted", "createdAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
            $15, $16, $17, $18, $19, $20
          )
        `, [
          profile.firstName,
          profile.email,
          profile.gender,
          profile.age,
          profile.city,
          profile.region,
          profile.bio,
          JSON.stringify(profile.interests),
          JSON.stringify(profile.photos),
          profile.subscription,
          0,
          new Date().toISOString(),
          false,
          'both',
          40,
          75,
          'same_region',
          'both',
          false,
          new Date().toISOString()
        ]);
        inserted++;
      } catch (error) {
        console.error(`❌ Erreur profil ${profile.firstName}:`, error.message);
      }
    }
    
    // Vérifier les résultats
    const result = await pool.query('SELECT COUNT(*) as total FROM users');
    const premium = await pool.query('SELECT COUNT(*) as premium FROM users WHERE subscription = \'premium\'');
    const gold = await pool.query('SELECT COUNT(*) as gold FROM users WHERE subscription = \'gold\'');
    
    console.log('\n✅ GÉNÉRATION TERMINÉE:');
    console.log(`📊 Total profils: ${result.rows[0].total}`);
    console.log(`👑 Premium: ${premium.rows[0].premium}`);
    console.log(`💎 Gold: ${gold.rows[0].gold}`);
    console.log(`✅ Profils générés: ${inserted}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
  } finally {
    await pool.end();
  }
}

generateProfiles();