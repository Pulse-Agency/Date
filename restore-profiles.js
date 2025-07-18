import fs from 'fs';
import { storage } from './server/storage.js';

async function restoreProfiles() {
  try {
    console.log('🔄 Restauration des profils depuis backup-profiles-permanent.json...');
    
    // Lire le fichier backup
    const backupData = JSON.parse(fs.readFileSync('backup-profiles-permanent.json', 'utf8'));
    let usersRestored = 0;
    
    console.log(`📋 ${backupData.length} profils trouvés dans le backup`);
    
    // Restaurer chaque profil
    for (const userData of backupData) {
      try {
        const user = {
          firstName: userData.firstName,
          gender: userData.gender || 'F',
          age: userData.age,
          city: userData.city,
          bio: userData.bio,
          interests: userData.interests || [],
          photo: userData.photo,
          subscription: userData.subscription || 'gratuit',
          email: userData.email,
          dailyFlashesUsed: userData.dailyFlashesUsed || 0,
          flashsRemaining: userData.flashsRemaining || 3,
          isTestProfile: userData.isTestProfile || false,
          createdAt: new Date(userData.createdAt || Date.now())
        };
        
        await storage.createUser(user);
        usersRestored++;
        
        // Afficher le progrès tous les 100 profils
        if (usersRestored % 100 === 0) {
          console.log(`✅ ${usersRestored} profils restaurés...`);
        }
      } catch (error) {
        console.error(`❌ Erreur restauration ${userData.firstName}:`, error.message);
      }
    }
    
    console.log(`🎉 Restauration terminée: ${usersRestored} profils sur ${backupData.length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
  }
}

// Exécuter la restauration
restoreProfiles();