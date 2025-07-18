# Intégration Automatique MailerLite - Date Mature

## Vue d'ensemble

Le système est maintenant configuré pour ajouter automatiquement les utilisateurs aux groupes MailerLite correspondants selon leurs actions, ce qui déclenche vos automations personnalisées.

## Groupes MailerLite Configurés

### 1. "Membres actifs (utilisateurs inscrits)"
- **Déclencheur** : Inscription sur l'application Date Mature
- **Code** : `emailService.addToActiveMembers(email, firstName)`
- **Moment** : Automatique lors de l'inscription via `/api/auth/register`

### 2. "Newsletter prospects (popup)"
- **Déclencheur** : Inscription newsletter via popup sur le site
- **Code** : `emailService.addToNewsletter(email, firstName)`
- **Moment** : Automatique lors de l'inscription via `/api/newsletter/subscribe`

### 3. "Premium subscribers"
- **Déclencheur** : Upgrade vers abonnement Premium (€60/6 mois)
- **Code** : `emailService.notifyPremiumUpgrade(email, firstName, 'premium')`
- **Moment** : Automatique lors du paiement via `/api/subscription/create`

### 4. "Gold subscribers"
- **Déclencheur** : Upgrade vers abonnement Gold (€114/12 mois)
- **Code** : `emailService.notifyPremiumUpgrade(email, firstName, 'gold')`
- **Moment** : Automatique lors du paiement via `/api/subscription/create`

## Nouvelles Routes Disponibles

### Téléchargement Ebook (Instagram/Facebook)
```
POST /api/ebook/download
Body: { "email": "user@example.com", "firstName": "Marie" }
```
- Ajoute l'utilisateur au groupe prospects
- Retourne l'URL de téléchargement de l'ebook

## Flux Automatique

### Inscription Utilisateur
1. Utilisateur s'inscrit sur Date Mature
2. **Automatique** → Ajout au groupe "Membres actifs"
3. **Automatique** → Déclenchement de votre automation "Free members"

### Newsletter Popup
1. Utilisateur saisit email dans popup newsletter
2. **Automatique** → Ajout au groupe "Newsletter prospects (popup)"
3. **Automatique** → Déclenchement de votre automation "Téléchargé Ebook"

### Upgrade Premium/Gold
1. Utilisateur achète abonnement Premium ou Gold
2. **Automatique** → Ajout au groupe correspondant
3. **Automatique** → Déclenchement de votre automation de bienvenue

## Configuration MailerLite Requise

### Vérifiez que ces groupes existent dans MailerLite :
1. ✅ "Membres actifs (utilisateurs inscrits)" 
2. ✅ "Newsletter prospects (popup)"
3. ✅ "Premium subscribers"
4. ✅ "Gold subscribers"

### Automations à configurer :
1. **Free members** : Déclencheur = "Ajouté au groupe Membres actifs"
2. **Téléchargé Ebook** : Déclencheur = "Ajouté au groupe Newsletter prospects"
3. **Bienvenue membres Premium** : Déclencheur = "Ajouté au groupe Premium subscribers"
4. **Bienvenue membres Gold** : Déclencheur = "Ajouté au groupe Gold subscribers"

## Logs et Debugging

Tous les ajouts de groupes sont loggés dans la console :
```
[EMAIL] ✅ Utilisateur ajouté au groupe "Premium subscribers": marie@example.com
[MAILERLITE] Utilisateur ajouté au groupe premium: marie@example.com
```

## Test du Système

1. **Test inscription** : Créez un compte → Vérifiez dans MailerLite groupe "Membres actifs"
2. **Test newsletter** : Utilisez popup → Vérifiez dans MailerLite groupe "Newsletter prospects"
3. **Test Premium** : Achetez abonnement → Vérifiez dans MailerLite groupe "Premium subscribers"

## URL pour Marketing Instagram/Facebook

Pour récupérer emails et déclencher download ebook :
```
https://date-mature.com/api/ebook/download
```

Cette intégration assure que tous vos utilisateurs sont automatiquement segmentés dans les bons groupes MailerLite selon leurs actions, déclenchant vos automations personnalisées.