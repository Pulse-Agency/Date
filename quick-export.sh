#!/bin/bash

echo "🚀 Export rapide Date Mature"

# Créer un backup de la DB
echo "💾 Export base de données..."
curl -s "http://localhost:5000/api/admin/users" > database-current.json

# Créer l'archive
echo "📦 Création archive..."
timestamp=$(date +"%Y%m%d_%H%M%S")
zip -r "date-mature-backup-${timestamp}.zip" \
  client/ \
  server/ \
  shared/ \
  backup_pages/ \
  email-templates/ \
  package.json \
  package-lock.json \
  tsconfig.json \
  vite.config.ts \
  tailwind.config.ts \
  postcss.config.js \
  drizzle.config.ts \
  components.json \
  replit.md \
  .env \
  .replit \
  database-current.json \
  backup-*.json \
  restore-*.js \
  --exclude="node_modules/*" \
  --exclude="dist/*" \
  --exclude=".git/*"

echo "✅ Export terminé: date-mature-backup-${timestamp}.zip"
ls -lh date-mature-backup-*.zip | tail -1