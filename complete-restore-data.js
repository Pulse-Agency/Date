import pg from 'pg';
const { Pool } = pg;

async function fastRestore() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Générer rapidement 1000 profils pour avoir une base de travail
    const genders = ['H', 'F'];
    const names = {
      H: ['Pierre', 'Paul', 'Jacques', 'Michel', 'Jean', 'Philippe', 'Alain', 'Bernard', 'André', 'Claude'],
      F: ['Marie', 'Anne', 'Françoise', 'Catherine', 'Isabelle', 'Sylvie', 'Brigitte', 'Monique', 'Nathalie', 'Véronique']
    };
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
    
    console.log('Génération rapide de 1000 profils...');
    
    for (let i = 0; i < 1000; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const name = names[gender][Math.floor(Math.random() * names[gender].length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const age = Math.floor(Math.random() * 36) + 40;
      const subscription = Math.random() > 0.8 ? (Math.random() > 0.5 ? 'premium' : 'gold') : 'gratuit';
      
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
        name + (i > 200 ? i : ''),
        `${name.toLowerCase()}${i}@example.com`,
        gender,
        age,
        city,
        'Région',
        'Bio générée automatiquement',
        JSON.stringify(['Voyage', 'Lecture']),
        JSON.stringify([`https://randomuser.me/api/portraits/${gender === 'H' ? 'men' : 'women'}/50.jpg`]),
        subscription,
        0,
        new Date().toISOString(),
        true,
        'both',
        40,
        75,
        'same_region',
        'both',
        false,
        new Date().toISOString()
      ]);
      
      if (i % 100 === 0) console.log(`${i} profils générés...`);
    }
    
    const result = await pool.query('SELECT COUNT(*) as total FROM users');
    console.log(`✅ ${result.rows[0].total} profils en base`);
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await pool.end();
  }
}

fastRestore();