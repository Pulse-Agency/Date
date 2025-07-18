import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

async function finalRestore() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    console.log('🗑️ Vidage de la table users...');
    await client.query('DELETE FROM users');
    
    console.log('📥 Lecture du backup...');
    const backupContent = JSON.parse(fs.readFileSync('backup-final-test.json', 'utf8'));
    const users = backupContent.data.users;
    
    console.log(`📊 ${users.length} utilisateurs à restaurer`);
    
    let restored = 0;
    let starProfiles = 0;
    
    for (const user of users) {
      try {
        const query = `
          INSERT INTO users (
            "firstName", gender, age, city, region, bio, interests, photos, 
            subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
            "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
            "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
            "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `;
        
        // Gérer les photos correctement
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
        
        if (user.firstName && user.firstName.startsWith('*')) {
          starProfiles++;
        }
        
        if (restored % 100 === 0) {
          console.log(`✅ ${restored} profils restaurés...`);
        }
        
      } catch (error) {
        console.error(`❌ Erreur profil ${user.firstName}:`, error.message);
      }
    }
    
    console.log(`🎉 Restauration terminée: ${restored} profils restaurés`);
    console.log(`⭐ ${starProfiles} profils avec * restaurés`);
    
    // Statistiques finales
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE "firstName" LIKE '*%') as star_profiles,
        COUNT(*) FILTER (WHERE subscription = 'premium') as premium,
        COUNT(*) FILTER (WHERE subscription = 'gold') as gold
      FROM users
    `);
    
    console.log('📊 Statistiques finales:', stats.rows[0]);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.end();
  }
}

finalRestore();