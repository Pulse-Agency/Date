import fs from 'fs';
import { Pool } from '@neondatabase/serverless';

console.log('🚀 Migration des profils vers PostgreSQL...');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrateProfiles() {
  try {
    // 1. Vider la table existante pour éviter les conflits
    await pool.query('DELETE FROM users WHERE "isTestProfile" = true OR "isTestProfile" = false');
    console.log('✅ Table users vidée');

    // 2. Charger les profils du backup
    const backupProfiles = JSON.parse(fs.readFileSync('backup-profiles-permanent.json', 'utf8'));
    console.log(`📋 ${backupProfiles.length} profils à migrer`);

    // 3. Insérer chaque profil
    let migrated = 0;
    for (const profile of backupProfiles) {
      try {
        await pool.query(`
          INSERT INTO users (
            "firstName", gender, age, city, bio, interests, photo, 
            subscription, email, "dailyFlashesUsed", "lastFlashReset", 
            "isTestProfile", "createdAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          profile.firstName,
          profile.gender || 'H',
          profile.age,
          profile.city,
          profile.bio || 'Profil migré automatiquement',
          JSON.stringify(profile.interests || []),
          profile.photo,
          profile.subscription || 'gratuit',
          profile.email,
          profile.dailyFlashesUsed || 0,
          new Date(profile.lastFlashReset || Date.now()),
          profile.isTestProfile || false,
          new Date(profile.createdAt || Date.now())
        ]);
        migrated++;
      } catch (e) {
        console.log(`⚠️ Erreur profil ${profile.firstName}:`, e.message);
      }
    }

    console.log(`✅ ${migrated} profils migrés vers PostgreSQL`);

    // 4. Vérifier la migration
    const result = await pool.query('SELECT COUNT(*) as total FROM users');
    console.log(`🔍 Vérification: ${result.rows[0].total} profils en base`);

  } catch (error) {
    console.error('❌ Erreur migration:', error);
  } finally {
    await pool.end();
  }
}

migrateProfiles();