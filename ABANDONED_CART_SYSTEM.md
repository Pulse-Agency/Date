# Système de Récupération de Panier Abandonné - Date Mature

## Vue d'ensemble

Le système de récupération de panier abandonné permet de récupérer les utilisateurs qui ont commencé un processus d'abonnement mais l'ont abandonné avant de finaliser leur paiement. Il propose automatiquement des codes promo "offre découverte" pour les inciter à revenir.

## Fonctionnalités

### 1. Détection automatique des paniers abandonnés
- **Déclenchement** : Après 30 secondes sur la page checkout
- **Tracking** : Enregistrement dans la table `abandonedCarts`
- **Données sauvées** : userId, plan (premium/gold), prix original

### 2. Codes promo "Offre découverte"
- **Premium** : -10% (60€ → 54€)
- **Gold** : -20% (228€ → 182€)
- **Format code** : `DECOUVERTE[timestamp][userId]`
- **Usage unique** : Chaque code ne peut être utilisé qu'une fois

### 3. Emails automatiques MailerLite
- **Délai** : 24h après abandon
- **Contenu** : Code promo personnalisé avec message "offre découverte"
- **Segmentation** : Ajout automatique aux groupes MailerLite spécialisés

## API Endpoints

### Création de panier abandonné
```
POST /api/abandoned-cart/create
Body: { userId: number, plan: "premium" | "gold" }
```

### Validation code promo
```
POST /api/promo/validate
Body: { code: string }
Response: { valid: boolean, discountPercent: number, originalPrice: number, discountedPrice: number }
```

### Application code promo
```
POST /api/promo/apply
Body: { code: string }
Response: { success: boolean, message: string }
```

### Traitement automatique
```
POST /api/abandoned-cart/process-reminders
Response: { success: boolean, processedCount: number }
```

## Interface utilisateur

### Page Checkout
- **Section code promo** : Entre résumé plan et formulaire paiement
- **Validation temps réel** : Vérification immédiate des codes
- **Affichage réduction** : Prix barré et nouveau prix affiché
- **État visuel** : Badge vert quand code appliqué

### Messages utilisateur
- Code valide : "Code promo appliqué ! Réduction de X% appliquée"
- Code invalide : "Ce code promo n'est pas valide ou a expiré"
- Hint : "💡 Offre découverte disponible pour certains utilisateurs"

## Intégration MailerLite

### Tags automatiques
- `abandoned_cart_discount` : Tous les utilisateurs avec codes promo
- `discount_premium` / `discount_gold` : Selon le plan
- `discount_10pct` / `discount_20pct` : Selon le pourcentage

### Groupes MailerLite
- **"Panier abandonné"** : Tous les utilisateurs ayant reçu un code
- **Automation possible** : Séquences d'emails personnalisées

## Logique métier

### Conditions d'envoi
1. Panier créé il y a plus de 24h
2. Aucun rappel déjà envoyé
3. Code promo pas encore utilisé
4. Utilisateur avec email valide

### Prévention double envoi
- Flag `discountOffered` : Évite les doublons
- `lastReminderSent` : Timestamp du dernier envoi
- `discountUsed` : Bloque la réutilisation

## Workflow complet

1. **Utilisateur arrive sur checkout** → Timer 30s démarre
2. **Utilisateur quitte sans payer** → Panier abandonné créé
3. **24h plus tard** → Script automatique détecte le panier
4. **Génération code promo** → Code unique "DECOUVERTE..."
5. **Email MailerLite** → Envoi avec tags appropriés
6. **Utilisateur revient** → Saisit le code sur checkout
7. **Validation réduction** → Prix réduit affiché
8. **Finalisation paiement** → Code marqué comme utilisé

## Avantages business

### Récupération de revenus
- **Premium** : Récupération de 54€ au lieu de 0€
- **Gold** : Récupération de 182€ au lieu de 0€
- **Conversion estimée** : +15-25% sur paniers abandonnés

### Expérience utilisateur
- **Message positif** : "Offre découverte" vs "remise"
- **Urgence implicite** : Code unique à usage limité
- **Transparence** : Prix barré visible

### Marketing automation
- **Segmentation fine** : Tags MailerLite précis
- **Suivi performance** : Tracking des conversions
- **Optimisation** : A/B test possibles sur réductions

## Configuration technique

### Variables d'environnement
- `MAILERLITE_API_KEY` : Pour envoi emails automatiques

### Tables base de données
- `abandonedCarts` : Stockage paniers abandonnés
- Champs : userId, plan, originalPrice, discountCode, timestamps

### Automatisation
- **Manuel** : Route `/api/abandoned-cart/process-reminders`
- **Futur** : Cron job quotidien ou webhook

## Métriques de suivi

### KPIs principaux
- Taux de paniers abandonnés
- Taux d'ouverture emails récupération
- Taux de conversion codes promo
- Revenus récupérés par plan

### Optimisations possibles
- **Délai d'envoi** : Tester 6h, 24h, 48h
- **Pourcentages** : Ajuster selon conversion
- **Séquences** : Multi-touch email campaigns
- **Personnalisation** : Messages selon profil utilisateur