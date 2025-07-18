# Guide d'Export Complet - Date Mature

## Méthode 1: Script d'Export Automatique

### Étape 1: Lancer l'export
```bash
node export-complete-app.js
```

Cela créera un fichier ZIP complet avec:
- ✅ Tout le code source (client, server, shared)
- ✅ Base de données exportée (tous les utilisateurs)
- ✅ Fichiers de configuration
- ✅ Scripts de restauration
- ✅ Documentation d'installation

### Étape 2: Télécharger le fichier ZIP
Le fichier `date-mature-export-[timestamp].zip` sera créé dans le dossier racine.

---

## Méthode 2: Export Manuel via Replit

### Étape 1: Télécharger les fichiers
1. Cliquer sur l'icône "Files" dans Replit
2. Cliquer sur les 3 points (...) à côté du nom du projet
3. Sélectionner "Download as ZIP"

### Étape 2: Exporter la base de données
1. Aller sur `/admin/users`
2. Cliquer sur "Sauvegarder" pour télécharger users-backup.json

---

## Méthode 3: Export via Git (Recommandé)

### Étape 1: Créer un repository Git
```bash
git init
git add .
git commit -m "Export complet Date Mature"
```

### Étape 2: Pousser vers GitHub
```bash
git remote add origin https://github.com/votre-username/date-mature.git
git push -u origin main
```

---

## Restauration sur un Nouveau Serveur

### Étape 1: Prérequis
- Node.js 18+
- PostgreSQL
- Compte Stripe + RevenueCat + MailerLite

### Étape 2: Installation
```bash
npm install
```

### Étape 3: Configuration
Créer un fichier `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/datemat
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
REVENUECAT_SECRET_KEY=...
MAILERLITE_API_KEY=...
```

### Étape 4: Base de données
```bash
npm run db:push
node import-database.js
```

### Étape 5: Lancement
```bash
npm run dev
```

---

## Problèmes Fréquents et Solutions

### Import ne fonctionne pas
**Problème**: L'import de fichiers JSON échoue
**Solution**: Utiliser le script `import-database.js` fourni

### Interface admin cassée
**Problème**: L'interface admin ne s'affiche pas correctement
**Solution**: Utiliser le fichier `backup_pages/pages/admin.tsx`

### Photos manquantes
**Problème**: Les photos ne s'affichent pas
**Solution**: Vérifier le chemin `/uploads/` et les permissions

---

## Support Technique

Si vous rencontrez des problèmes après l'export:

1. **Vérifiez les logs**: `npm run dev` affiche les erreurs
2. **Testez la DB**: `npm run db:studio` pour voir les données
3. **Vérifiez les variables**: `.env` doit être configuré
4. **Contactez le support**: Avec les logs d'erreur

---

## Fichiers Importants à Conserver

- `database-export.json` - Tous les utilisateurs
- `backup_pages/` - Interfaces de backup
- `email-templates/` - Templates d'emails
- `replit.md` - Documentation du projet
- `.env` - Variables d'environnement

---

*Guide créé le: ${new Date().toLocaleString('fr-FR')}*