import { db } from './server/db.js';
import { users } from './shared/schema.js';
import fs from 'fs';

async function restoreFromBackup() {
  console.log('🔄 Restauration immédiate des données utilisateur...');
  
  try {
    // Lire le backup le plus complet
    const backupData = JSON.parse(fs.readFileSync('backup-avant-corrections-20250707_114453.json', 'utf8'));
    const usersToRestore = backupData.data.users;
    
    console.log(`📂 Backup trouvé avec ${usersToRestore.length} utilisateurs`);
    
    // Supprimer tous les utilisateurs existants
    await db.delete(users);
    console.log('🗑️ Utilisateurs existants supprimés');
    
    // Restaurer les utilisateurs par chunks
    const chunkSize = 50;
    let restored = 0;
    
    for (let i = 0; i < usersToRestore.length; i += chunkSize) {
      const chunk = usersToRestore.slice(i, i + chunkSize);
      
      const cleanedChunk = chunk.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName || '',
        email: user.email,
        gender: user.gender,
        age: user.age,
        city: user.city,
        region: user.region || null,
        bio: user.bio || '',
        interests: user.interests || [],
        photo: user.photo || '',
        subscription: user.subscription || 'gratuit',
        dailyFlashesUsed: user.dailyFlashesUsed || 0,
        lastFlashReset: user.lastFlashReset ? new Date(user.lastFlashReset) : new Date(),
        isTestProfile: user.isTestProfile || false,
        referralCode: user.referralCode || null,
        referredById: user.referredById || null,
        bonusFlashes: user.bonusFlashes || 0,
        subscriptionEndDate: user.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null,
        lookingForGender: user.lookingForGender || 'both',
        lookingForAgeMin: user.lookingForAgeMin || 40,
        lookingForAgeMax: user.lookingForAgeMax || 75,
        lookingForDistance: user.lookingForDistance || 'same_region',
        lookingForRelationType: user.lookingForRelationType || 'both',
        preferencesCompleted: user.preferencesCompleted || false,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
      }));
      
      await db.insert(users).values(cleanedChunk);
      restored += cleanedChunk.length;
      console.log(`✅ ${restored}/${usersToRestore.length} utilisateurs restaurés`);
    }
    
    console.log(`🎉 Restauration terminée : ${restored} utilisateurs restaurés avec succès`);
    
    // Vérifier les statistiques
    const allUsers = await db.select().from(users);
    const stats = {
      total: allUsers.length,
      premium: allUsers.filter(u => u.subscription === 'premium').length,
      gold: allUsers.filter(u => u.subscription === 'gold').length,
      withPhotos: allUsers.filter(u => u.photo && u.photo.length > 0).length,
      starProfiles: allUsers.filter(u => u.firstName && u.firstName.startsWith('*')).length
    };
    
    console.log('📊 Statistiques après restauration:', stats);
    
  } catch (error) {
    console.error('❌ Erreur restauration:', error);
    throw error;
  }
}

restoreFromBackup()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Échec restauration:', error);
    process.exit(1);
  });