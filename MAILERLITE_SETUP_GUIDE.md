# Guide Configuration MailerLite pour Date Mature

## Problème MailerSend
Le compte MailerSend n'a pas été approuvé car les sites de rencontres ne correspondent pas à leurs politiques commerciales.

## Solution : MailerLite uniquement

### Configuration des Automations MailerLite

L'application segmente automatiquement les utilisateurs avec des tags. Vous devez créer des automations dans MailerLite :

#### 1. Automation "Flash Reçu"
- **Déclencheur** : Tag ajouté "flash_received"
- **Action** : Envoyer email personnalisé
- **Sujet** : "💕 Quelqu'un s'intéresse à vous - Date Mature"
- **Template** : 
  ```
  Bonjour {{first_name}},

  Excellente nouvelle ! Quelqu'un vient de vous flasher sur Date Mature.

  Connectez-vous pour découvrir qui s'intéresse à vous :
  https://date-mature.com/profiles

  L'équipe Date Mature
  ```

#### 2. Automation "Nouveau Match"
- **Déclencheur** : Tag ajouté "match_created"
- **Action** : Envoyer email personnalisé
- **Sujet** : "🎉 Nouveau match - Date Mature"
- **Template** :
  ```
  Félicitations {{first_name}} !

  Vous avez un nouveau match mutuel ! L'attraction est réciproque.

  Commencez la conversation :
  https://date-mature.com/messages

  L'équipe Date Mature
  ```

#### 3. Automation "Bienvenue Newsletter"
- **Déclencheur** : Tag ajouté "newsletter_subscriber"
- **Action** : Envoyer email de bienvenue
- **Sujet** : "Bienvenue dans la communauté Date Mature"

#### 4. Automation "Membre Actif"
- **Déclencheur** : Tag ajouté "active_member"
- **Action** : Envoyer conseils et astuces rencontres

### Groupes MailerLite à créer
- `newsletter_subscribers` - Pour les inscriptions newsletter
- `active_members` - Pour les utilisateurs actifs
- `premium_members` - Pour les abonnés Premium
- `gold_members` - Pour les abonnés Gold

### Avantages de cette approche
- ✅ Segmentation automatique des utilisateurs
- ✅ Pas de limite d'envoi (contrairement à MailerSend)
- ✅ Interface simple pour créer les automations
- ✅ Meilleure délivrabilité avec MailerLite
- ✅ Statistiques détaillées sur les campagnes

### Actions à effectuer
1. Connectez-vous à votre compte MailerLite
2. Créez les 4 automations ci-dessus
3. Testez avec quelques emails pour vérifier le fonctionnement
4. Les utilisateurs seront automatiquement segmentés par l'application

## État actuel
- ✅ Segmentation automatique fonctionnelle
- ✅ Tags ajoutés automatiquement
- ⏳ Automations à créer manuellement dans MailerLite
- ❌ MailerSend définitivement désactivé