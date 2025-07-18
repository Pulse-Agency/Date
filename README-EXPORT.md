# Date Mature - Export Complet

## Contenu de l'export
- Code source complet (client, server, shared)
- Base de données (date-mature-export-20250711_193945.tar.gz)
- Fichiers de backup
- Configuration complète

## Installation sur nouveau serveur

1. Extraire l'archive:
   tar -xzf date-mature-export-20250711_193945.tar.gz

2. Installer les dépendances:
   npm install

3. Configurer .env avec vos clés API

4. Configurer la base de données:
   npm run db:push

5. Importer les données:
   # Utiliser les fichiers backup-*.json

6. Lancer l'application:
   npm run dev

Export créé le: 11/07/2025 à 19:39:46
