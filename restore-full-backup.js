import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

async function restoreFullBackup() {
  console.log('🔄 Restauration complète de la base de données à 1170+ profils...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    // Sauvegarder l'état actuel
    console.log('📦 Sauvegarde état actuel...');
    const currentData = await client.query('SELECT * FROM users ORDER BY id');
    fs.writeFileSync('backup_avant_restauration_' + new Date().toISOString().replace(/[:.]/g, '-') + '.json', 
                     JSON.stringify(currentData.rows, null, 2));
    
    // Vider la table
    console.log('🗑️ Nettoyage table users...');
    await client.query('DELETE FROM users');
    
    // Restaurer depuis le backup le plus complet
    let backupPath = 'backup-final-test.json';
    if (!fs.existsSync(backupPath)) {
      backupPath = '/tmp/backup_emergency_20250711_132421.json';
    }
    
    console.log('📥 Restauration depuis:', backupPath);
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    console.log(`📊 Profils à restaurer: ${backupData.length}`);
    
    let insertedCount = 0;
    
    for (const user of backupData) {
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
        
        await client.query(query, [
          user.firstName || 'User',
          user.gender || 'F',
          user.age || 45,
          user.city || 'Paris',
          user.region || 'Île-de-France',
          user.bio || 'Profil utilisateur',
          JSON.stringify(user.interests || []),
          JSON.stringify(user.photos || []),
          user.subscription || 'gratuit',
          user.email || `user${insertedCount}@example.com`,
          user.dailyFlashesUsed || 0,
          user.lastFlashReset || new Date(),
          user.isTestProfile || false,
          user.referralCode || null,
          user.referredById || null,
          user.bonusFlashes || 0,
          user.subscriptionEndDate || null,
          user.lookingForGender || 'both',
          user.lookingForAgeMin || 40,
          user.lookingForAgeMax || 75,
          user.lookingForDistance || 'same_region',
          user.lookingForRelationType || 'both',
          user.preferencesCompleted || false,
          user.createdAt || new Date()
        ]);
        
        insertedCount++;
        
        if (insertedCount % 100 === 0) {
          console.log(`✅ ${insertedCount} profils restaurés...`);
        }
        
      } catch (error) {
        console.error(`❌ Erreur profil ${user.firstName}:`, error.message);
      }
    }
    
    // Réinitialiser la séquence
    await client.query('SELECT setval(\'users_id_seq\', (SELECT MAX(id) FROM users))');
    
    console.log(`🎉 Restauration terminée: ${insertedCount} profils restaurés`);
    
    // Vérifier la restauration
    const finalStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE gender = 'F') as femmes,
        COUNT(*) FILTER (WHERE gender = 'M') as hommes,
        COUNT(*) FILTER (WHERE "firstName" LIKE '*%') as profiles_etoile,
        COUNT(*) FILTER (WHERE subscription = 'premium') as premium,
        COUNT(*) FILTER (WHERE subscription = 'gold') as gold
      FROM users
    `);
    
    console.log('📊 Statistiques finales:', finalStats.rows[0]);
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
  } finally {
    await client.end();
  }
}

restoreFullBackup();