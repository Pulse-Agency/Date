import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function restoreComplete() {
  try {
    console.log('🔄 Restauration complète 1170 profils...');
    
    // Charger la vraie sauvegarde avec 1170 profils
    const backupContent = JSON.parse(fs.readFileSync('backup_avant_restauration_20250711_151750.json', 'utf8'));
    const backupData = backupContent.data?.users || backupContent.users || backupContent;
    console.log(`📁 Sauvegarde chargée: ${backupData.length} profils`);
    
    // Vider la table actuelle
    await pool.query('DELETE FROM users');
    console.log('🧹 Table vidée');
    
    // Restaurer tous les profils
    let inserted = 0;
    let errors = 0;
    
    for (const profile of backupData) {
      try {
        // Nettoyer les données
        const cleanProfile = {
          firstName: profile.firstName || 'Inconnu',
          email: profile.email || `user${inserted}@example.com`,
          gender: profile.gender || 'F',
          age: profile.age || 50,
          city: profile.city || 'Paris',
          region: profile.region || 'Île-de-France',
          bio: profile.bio || '',
          interests: Array.isArray(profile.interests) ? profile.interests : [],
          photos: Array.isArray(profile.photos) ? profile.photos : [],
          subscription: profile.subscription || 'gratuit',
          dailyFlashesUsed: profile.dailyFlashesUsed || 0,
          lastFlashReset: profile.lastFlashReset || new Date().toISOString(),
          isTestProfile: profile.isTestProfile || false,
          referralCode: profile.referralCode || null,
          referredById: profile.referredById || null,
          bonusFlashes: profile.bonusFlashes || 0,
          subscriptionEndDate: profile.subscriptionEndDate || null,
          lookingForGender: profile.lookingForGender || 'both',
          lookingForAgeMin: profile.lookingForAgeMin || 40,
          lookingForAgeMax: profile.lookingForAgeMax || 75,
          lookingForDistance: profile.lookingForDistance || 'same_region',
          lookingForRelationType: profile.lookingForRelationType || 'both',
          preferencesCompleted: profile.preferencesCompleted || false,
          createdAt: profile.createdAt || new Date().toISOString()
        };
        
        await pool.query(`
          INSERT INTO users (
            "firstName", email, gender, age, city, region, bio, 
            interests, photos, subscription, "dailyFlashesUsed", "lastFlashReset",
            "isTestProfile", "referralCode", "referredById", "bonusFlashes",
            "subscriptionEndDate", "lookingForGender", "lookingForAgeMin", 
            "lookingForAgeMax", "lookingForDistance", "lookingForRelationType",
            "preferencesCompleted", "createdAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
          )
        `, [
          cleanProfile.firstName,
          cleanProfile.email,
          cleanProfile.gender,
          cleanProfile.age,
          cleanProfile.city,
          cleanProfile.region,
          cleanProfile.bio,
          JSON.stringify(cleanProfile.interests),
          JSON.stringify(cleanProfile.photos),
          cleanProfile.subscription,
          cleanProfile.dailyFlashesUsed,
          cleanProfile.lastFlashReset,
          cleanProfile.isTestProfile,
          cleanProfile.referralCode,
          cleanProfile.referredById,
          cleanProfile.bonusFlashes,
          cleanProfile.subscriptionEndDate,
          cleanProfile.lookingForGender,
          cleanProfile.lookingForAgeMin,
          cleanProfile.lookingForAgeMax,
          cleanProfile.lookingForDistance,
          cleanProfile.lookingForRelationType,
          cleanProfile.preferencesCompleted,
          cleanProfile.createdAt
        ]);
        
        inserted++;
        if (inserted % 100 === 0) {
          console.log(`✅ ${inserted} profils insérés...`);
        }
        
      } catch (error) {
        errors++;
        if (errors < 10) {
          console.error(`❌ Erreur profil ${profile.firstName}:`, error.message);
        }
      }
    }
    
    // Vérifier les résultats
    const result = await pool.query('SELECT COUNT(*) as total FROM users');
    const stars = await pool.query('SELECT COUNT(*) as stars FROM users WHERE "firstName" LIKE \'*%\' OR "firstName" LIKE \'%*%\'');
    const premium = await pool.query('SELECT COUNT(*) as premium FROM users WHERE subscription = \'premium\'');
    const gold = await pool.query('SELECT COUNT(*) as gold FROM users WHERE subscription = \'gold\'');
    const withPhotos = await pool.query('SELECT COUNT(*) as withPhotos FROM users WHERE photos IS NOT NULL AND photos::text != \'[]\'');
    
    console.log('\n🎉 RESTAURATION TERMINÉE:');
    console.log(`📊 Total profils: ${result.rows[0].total}`);
    console.log(`⭐ Profils * personnalisés: ${stars.rows[0].stars}`);
    console.log(`👑 Premium: ${premium.rows[0].premium}`);
    console.log(`💎 Gold: ${gold.rows[0].gold}`);
    console.log(`📸 Avec photos: ${withPhotos.rows[0].withPhotos}`);
    console.log(`✅ Succès: ${inserted}, ❌ Erreurs: ${errors}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
  } finally {
    await pool.end();
  }
}

restoreComplete();