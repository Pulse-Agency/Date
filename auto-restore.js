// Script de restauration automatique à exécuter au démarrage
import { storage } from './server/storage.js';

async function autoRestore() {
  try {
    // Vérifier le nombre de profils actuels
    const users = await storage.getAllUsers();
    console.log(`📊 Profils actuels en mémoire: ${users.length}`);
    
    if (users.length < 985) {
      console.log('🔄 Lancement de la restauration automatique...');
      // Relancer le script de génération
      const { spawn } = await import('child_process');
      const restore = spawn('node', ['generate-additional-profiles.js'], { stdio: 'inherit' });
      
      restore.on('close', (code) => {
        console.log(`✅ Restauration automatique terminée (code: ${code})`);
      });
    } else {
      console.log('✅ Nombre de profils correct, pas de restauration nécessaire');
    }
  } catch (error) {
    console.error('❌ Erreur restauration automatique:', error);
  }
}

// Exporter pour utilisation dans server/index.ts
export { autoRestore };