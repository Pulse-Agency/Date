import fs from 'fs';
import http from 'http';

// Restauration rapide et immédiate
async function quickRestore() {
  console.log('🚀 Restauration rapide des 985 profils...');
  
  const { spawn } = require('child_process');
  return new Promise((resolve) => {
    const restore = spawn('node', ['generate-additional-profiles.js'], { stdio: 'inherit' });
    restore.on('close', (code) => {
      console.log(`✅ Restauration terminée (code: ${code})`);
      resolve();
    });
  });
}

quickRestore();