import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function restoreData() {
  try {
    console.log('🔄 Restauration rapide des données...');
    
    // Charger une sauvegarde qui fonctionne
    const backupContent = JSON.parse(fs.readFileSync('backup-avant-corrections-20250707_114453.json', 'utf8'));
    const backupData = backupContent.data?.users || backupContent.users || backupContent;
    console.log(`📁 Sauvegarde chargée: ${backupData.length} profils`);
    
    // Vérifier si la base est vide
    const count = await pool.query('SELECT COUNT(*) as total FROM users');
    console.log(`📊 Profils actuels: ${count.rows[0].total}`);
    
    if (count.rows[0].total == 0) {
      console.log('🔄 Base vide, restauration...');
      
      // Restaurer les profils
      let inserted = 0;
      for (const profile of backupData) {
        try {
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
            profile.firstName,
            profile.email,
            profile.gender,
            profile.age,
            profile.city,
            profile.region,
            profile.bio,
            profile.interests || [],
            profile.photos || [],
            profile.subscription || 'gratuit',
            profile.dailyFlashesUsed || 0,
            profile.lastFlashReset || new Date().toISOString(),
            profile.isTestProfile || false,
            profile.referralCode,
            profile.referredById,
            profile.bonusFlashes || 0,
            profile.subscriptionEndDate,
            profile.lookingForGender || 'both',
            profile.lookingForAgeMin || 40,
            profile.lookingForAgeMax || 75,
            profile.lookingForDistance || 'same_region',
            profile.lookingForRelationType || 'both',
            profile.preferencesCompleted || false,
            profile.createdAt || new Date().toISOString()
          ]);
          inserted++;
        } catch (error) {
          console.error(`❌ Erreur profil ${profile.firstName}:`, error.message);
        }
      }
      
      console.log(`✅ ${inserted} profils restaurés`);
    }
    
    // Vérifier les résultats
    const result = await pool.query('SELECT COUNT(*) as total FROM users');
    const stars = await pool.query('SELECT COUNT(*) as stars FROM users WHERE "firstName" LIKE \'*%\' OR "firstName" LIKE \'* %\'');
    const premium = await pool.query('SELECT COUNT(*) as premium FROM users WHERE subscription = \'premium\'');
    const gold = await pool.query('SELECT COUNT(*) as gold FROM users WHERE subscription = \'gold\'');
    
    console.log('\n✅ ÉTAT FINAL:');
    console.log(`📊 Total profils: ${result.rows[0].total}`);
    console.log(`⭐ Profils * personnalisés: ${stars.rows[0].stars}`);
    console.log(`👑 Premium: ${premium.rows[0].premium}`);
    console.log(`💎 Gold: ${gold.rows[0].gold}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
  } finally {
    await pool.end();
  }
}

restoreData();