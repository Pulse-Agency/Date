import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { createConnection } from 'mysql2/promise';
import fs from 'fs';

async function fastRestore() {
  console.log('🔄 Restauration rapide depuis PostgreSQL...');
  
  try {
    // Connexion directe à PostgreSQL
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL non définie');
    }
    
    console.log('🔄 Connexion à PostgreSQL...');
    
    // Lire le backup
    const backupData = JSON.parse(fs.readFileSync('backup-avant-corrections-20250707_114453.json', 'utf8'));
    const usersToRestore = backupData.data.users;
    
    console.log(`📂 ${usersToRestore.length} utilisateurs à restaurer`);
    
    // Créer requête SQL d'insertion
    const insertQuery = `
      INSERT INTO users (
        id, "firstName", "lastName", email, gender, age, city, region, bio, interests, 
        photo, subscription, "dailyFlashesUsed", "lastFlashReset", "isTestProfile", 
        "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate", 
        "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", "lookingForDistance", 
        "lookingForRelationType", "preferencesCompleted", "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      ON CONFLICT (id) DO UPDATE SET
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        email = EXCLUDED.email,
        gender = EXCLUDED.gender,
        age = EXCLUDED.age,
        city = EXCLUDED.city,
        region = EXCLUDED.region,
        bio = EXCLUDED.bio,
        interests = EXCLUDED.interests,
        photo = EXCLUDED.photo,
        subscription = EXCLUDED.subscription,
        "dailyFlashesUsed" = EXCLUDED."dailyFlashesUsed",
        "lastFlashReset" = EXCLUDED."lastFlashReset",
        "isTestProfile" = EXCLUDED."isTestProfile",
        "referralCode" = EXCLUDED."referralCode",
        "referredById" = EXCLUDED."referredById",
        "bonusFlashes" = EXCLUDED."bonusFlashes",
        "subscriptionEndDate" = EXCLUDED."subscriptionEndDate",
        "lookingForGender" = EXCLUDED."lookingForGender",
        "lookingForAgeMin" = EXCLUDED."lookingForAgeMin",
        "lookingForAgeMax" = EXCLUDED."lookingForAgeMax",
        "lookingForDistance" = EXCLUDED."lookingForDistance",
        "lookingForRelationType" = EXCLUDED."lookingForRelationType",
        "preferencesCompleted" = EXCLUDED."preferencesCompleted",
        "createdAt" = EXCLUDED."createdAt"
    `;
    
    // Utiliser tsx pour exécuter avec le bon environnement
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const restoreScript = `
      import { db } from './server/db.ts';
      import { users } from './shared/schema.ts';
      import fs from 'fs';
      
      const backupData = JSON.parse(fs.readFileSync('backup-avant-corrections-20250707_114453.json', 'utf8'));
      const usersToRestore = backupData.data.users;
      
      console.log('Suppression des utilisateurs existants...');
      await db.delete(users);
      
      console.log('Restauration des utilisateurs...');
      const chunkSize = 25;
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
        console.log(\`\${i + chunk.length}/\${usersToRestore.length} utilisateurs restaurés\`);
      }
      
      console.log('Restauration terminée');
    `;
    
    fs.writeFileSync('temp-restore.ts', restoreScript);
    
    console.log('⚡ Exécution de la restauration avec tsx...');
    await execAsync('tsx temp-restore.ts');
    
    // Nettoyer le fichier temporaire
    fs.unlinkSync('temp-restore.ts');
    
    console.log('✅ Restauration terminée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

fastRestore()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Échec:', error);
    process.exit(1);
  });