#!/usr/bin/env node

/**
 * Script d'export complet de l'application Date Mature
 * Crée un fichier ZIP avec tout le code source et les données
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function exportCompleteApp() {
  console.log('🚀 Export complet de l\'application Date Mature...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const exportName = `date-mature-export-${timestamp}`;
  const exportDir = `./${exportName}`;
  
  try {
    // Créer le dossier d'export
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // 1. Exporter le code source complet
    console.log('📁 Copie du code source...');
    const sourceFiles = [
      'client/',
      'server/',
      'shared/',
      'email-templates/',
      'backup_pages/',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'drizzle.config.ts',
      'components.json',
      'replit.md',
      '.env',
      '.replit',
      '.gitignore'
    ];
    
    for (const file of sourceFiles) {
      if (fs.existsSync(file)) {
        const isDir = fs.statSync(file).isDirectory();
        if (isDir) {
          await execAsync(`cp -r "${file}" "${exportDir}/"`);
        } else {
          await execAsync(`cp "${file}" "${exportDir}/"`);
        }
        console.log(`✅ ${file} copié`);
      }
    }
    
    // 2. Exporter la base de données
    console.log('💾 Export de la base de données...');
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const usersData = await response.json();
      
      const dbExport = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        users: usersData.users || [],
        stats: usersData.stats || {}
      };
      
      fs.writeFileSync(
        path.join(exportDir, 'database-export.json'),
        JSON.stringify(dbExport, null, 2)
      );
      console.log('✅ Base de données exportée');
    } catch (error) {
      console.log('⚠️ Erreur export DB:', error.message);
    }
    
    // 3. Exporter les fichiers de backup
    console.log('📋 Copie des backups...');
    const backupFiles = fs.readdirSync('.')
      .filter(file => file.includes('backup') || file.includes('restore'))
      .filter(file => file.endsWith('.json') || file.endsWith('.js'));
    
    const backupDir = path.join(exportDir, 'backups');
    fs.mkdirSync(backupDir, { recursive: true });
    
    for (const backup of backupFiles) {
      fs.copyFileSync(backup, path.join(backupDir, backup));
      console.log(`✅ ${backup} copié`);
    }
    
    // 4. Créer un README d'installation
    const readme = `# Date Mature - Export Complet

## Installation

1. Installer Node.js (version 18+)
2. Installer les dépendances:
   \`\`\`bash
   npm install
   \`\`\`

3. Configurer les variables d'environnement (.env):
   \`\`\`
   DATABASE_URL=your_postgres_url
   STRIPE_SECRET_KEY=your_stripe_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   REVENUECAT_SECRET_KEY=your_revenuecat_key
   MAILERLITE_API_KEY=your_mailerlite_key
   \`\`\`

4. Configurer la base de données:
   \`\`\`bash
   npm run db:push
   \`\`\`

5. Importer les données:
   \`\`\`bash
   node import-database.js
   \`\`\`

6. Lancer l'application:
   \`\`\`bash
   npm run dev
   \`\`\`

## Restauration des données

Le fichier \`database-export.json\` contient tous les utilisateurs.
Le dossier \`backups/\` contient les fichiers de sauvegarde.

## Structure

- \`client/\` - Frontend React
- \`server/\` - Backend Express
- \`shared/\` - Schémas partagés
- \`backup_pages/\` - Interfaces de backup
- \`email-templates/\` - Templates d'emails

Export créé le: ${new Date().toLocaleString('fr-FR')}
`;
    
    fs.writeFileSync(path.join(exportDir, 'README.md'), readme);
    
    // 5. Créer un script d'import de database
    const importScript = `import fs from 'fs';
import { db } from './server/db.js';
import { users } from './shared/schema.js';

async function importDatabase() {
  console.log('Importation de la base de données...');
  
  const data = JSON.parse(fs.readFileSync('database-export.json', 'utf8'));
  
  // Supprimer les utilisateurs existants
  await db.delete(users);
  
  // Importer par chunks de 25
  const chunkSize = 25;
  for (let i = 0; i < data.users.length; i += chunkSize) {
    const chunk = data.users.slice(i, i + chunkSize);
    await db.insert(users).values(chunk);
    console.log(\`\${i + chunk.length}/\${data.users.length} utilisateurs importés\`);
  }
  
  console.log('✅ Import terminé');
}

importDatabase().catch(console.error);`;
    
    fs.writeFileSync(path.join(exportDir, 'import-database.js'), importScript);
    
    // 6. Créer l'archive ZIP
    console.log('📦 Création de l\'archive ZIP...');
    await execAsync(`zip -r "${exportName}.zip" "${exportName}"`);
    
    // Nettoyer le dossier temporaire
    await execAsync(`rm -rf "${exportDir}"`);
    
    console.log(`✅ Export terminé: ${exportName}.zip`);
    console.log(`📊 Taille: ${(fs.statSync(\`\${exportName}.zip\`).size / 1024 / 1024).toFixed(2)} MB`);
    
    return `${exportName}.zip`;
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

// Exécuter l'export
exportCompleteApp()
  .then(filename => {
    console.log(`🎉 Application exportée avec succès: ${filename}`);
    console.log('💡 Vous pouvez maintenant télécharger ce fichier et l\'utiliser sur n\'importe quel serveur.');
  })
  .catch(error => {
    console.error('💥 Échec de l\'export:', error);
    process.exit(1);
  });