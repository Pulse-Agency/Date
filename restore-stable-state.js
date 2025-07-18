import fs from 'fs';
import { Client } from 'pg';

async function restoreStableState() {
  console.log('🔄 Restauration de l\'état stable avec vos 23 profils personnalisés...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    // Sauvegarder l'état actuel avant restauration
    console.log('📦 Sauvegarde de l\'état actuel...');
    const currentData = await client.query('SELECT * FROM users ORDER BY id');
    fs.writeFileSync('backup_avant_restauration.json', JSON.stringify(currentData.rows, null, 2));
    
    // Vider la table users
    console.log('🗑️ Nettoyage de la table users...');
    await client.query('DELETE FROM users');
    
    // Restaurer les profils depuis le backup stable le plus récent
    console.log('📥 Restauration des profils stables...');
    
    // Utiliser le backup le plus récent qui contenait vos modifications
    const backupPath = '/tmp/backup_final_correction_20250711_141602.json';
    
    if (fs.existsSync(backupPath)) {
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      console.log(`📋 Trouvé ${backupData.length} profils à restaurer`);
      
      for (const user of backupData) {
        // Adapter le format pour PostgreSQL
        const query = `
          INSERT INTO users (
            id, "firstName", gender, age, city, region, bio, interests, photos, 
            subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
            "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
            "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
            "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        `;
        
        await client.query(query, [
          user.id,
          user.firstName,
          user.gender,
          user.age,
          user.city,
          user.region || null,
          user.bio,
          JSON.stringify(user.interests || []),
          JSON.stringify(user.photos || []),
          user.subscription,
          user.email,
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
      }
      
      // Réinitialiser la séquence
      await client.query('SELECT setval(\'users_id_seq\', (SELECT MAX(id) FROM users))');
      
      console.log('✅ Restauration terminée avec succès');
      
      // Vérifier les profils avec * restaurés
      const starProfiles = await client.query('SELECT COUNT(*) FROM users WHERE "firstName" LIKE \'*%\'');
      console.log(`🌟 ${starProfiles.rows[0].count} profils avec * restaurés`);
      
    } else {
      console.log('❌ Backup non trouvé, restauration depuis backup-final.json');
      
      // Fallback vers backup-final.json
      const fallbackData = JSON.parse(fs.readFileSync('backup-final.json', 'utf8'));
      
      for (const user of fallbackData) {
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
          user.firstName,
          user.gender,
          user.age,
          user.city,
          user.region || null,
          user.bio,
          JSON.stringify(user.interests || []),
          JSON.stringify(user.photos || []),
          user.subscription,
          user.email,
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
      }
    }
    
    const finalCount = await client.query('SELECT COUNT(*) FROM users');
    console.log(`🎉 Restauration terminée : ${finalCount.rows[0].count} profils restaurés`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
  } finally {
    await client.end();
  }
}

restoreStableState();