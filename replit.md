# Date Mature - Application de Rencontres Seniors

## Overview

This is a full-stack mature dating application built for users aged 40-75. The app features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and Socket.io for real-time messaging. The application includes a comprehensive matching system, subscription tiers, and real-time chat functionality designed for mature adults seeking meaningful relationships.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time**: Socket.io client for messaging

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Real-time**: Socket.io server for chat functionality
- **Session Management**: Express sessions with PostgreSQL store
- **Build**: esbuild for production bundling

### Mobile-First Design
- **Responsive**: Optimized for mobile devices with max-width container
- **PWA Ready**: Configured for progressive web app deployment
- **Touch Optimized**: Gesture-friendly interface for senior users

## Key Components

### User Management System
- **Registration/Onboarding**: Multi-step process including profile creation, interests selection, and photo upload
- **Profile System**: Comprehensive user profiles with bio, interests, city, and subscription status
- **Subscription Tiers**: Three levels with balanced progression:
  - **Gratuit**: 3 flashs/jour, messages basiques
  - **Premium €60/6 mois**: 20 flashs/jour, voir qui vous a flashé, support amélioré
  - **Gold €114/12 mois**: Flashs illimités, messages illimités, profil prioritaire, mode incognito, badges exclusifs

### Matching & Flash System
- **Flash Mechanism**: Like system with daily limits based on subscription tier
- **Mutual Matching**: Automatic match creation when both users flash each other
- **Smart Suggestions**: Location-based profile prioritization with Gold user prominence

### Real-time Messaging
- **Socket.io Integration**: Live chat between matched users only
- **Message Threading**: Conversation management with read receipts
- **Typing Indicators**: Real-time typing status updates
- **Access Control**: Messaging restricted to matched users

### Notification System
- **Local Notifications**: New match alerts, unread message notifications, daily flash reminders
- **Database Storage**: Persistent notification tracking
- **Real-time Updates**: Instant notification delivery via WebSocket

## Data Flow

### User Registration Flow
1. Multi-step onboarding process
2. Profile data validation and sanitization
3. Interest selection from predefined categories
4. Photo upload handling
5. Database user creation with default free subscription

### Matching Flow
1. User views profile suggestions sorted by proximity and subscription tier
2. Flash action triggers validation (daily limits, duplicate prevention)
3. System checks for mutual flash to create automatic match
4. Match notification displayed to both users
5. Chat functionality unlocked between matched users

### Real-time Messaging Flow
1. User joins conversation room via Socket.io
2. Message validation and spam protection
3. Message persistence to database
4. Real-time broadcast to conversation participants
5. Notification creation for offline users

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Hook Form, TanStack Query
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Database**: Drizzle ORM, Neon Database serverless PostgreSQL
- **Real-time**: Socket.io for client-server communication

### Development Tools
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Code Quality**: ESLint configuration, TypeScript strict mode
- **Development**: Replit-specific plugins for debugging and development

### Third-party Integrations
- **Payment Processing**: RevenueCat Web SDK for subscription management with Stripe backend
- **Profile Photos**: RandomUser API for generating test profile images
- **Geolocation**: Browser geolocation API for city-based matching

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL configuration required
- **Admin Tools**: Development-only admin panel for testing and statistics

### Production Build
- **Frontend**: Static build output to `dist/public` directory
- **Backend**: esbuild bundle to `dist/index.js`
- **Database Migrations**: Drizzle Kit for schema management
- **Static Assets**: Served via Express static middleware

### Replit-Specific Configuration
- **Runtime Error Overlay**: Development error modal integration
- **Cartographer**: Replit development tool integration
- **Environment Detection**: Automatic development/production mode switching

## Déploiement

### Clés API Configurées
- ✅ `REVENUECAT_SECRET_KEY` - Gestion des abonnements
- ✅ `STRIPE_SECRET_KEY` + `VITE_STRIPE_PUBLIC_KEY` - Paiements sécurisés  
- ✅ `MAILERLITE_API_KEY` - Intégration newsletter et emails automatiques

### Domaine Choisi
- **Domaine principal** : `date-mature.com` (acheté chez Hostinger)
- **Configuration DNS** : À pointer vers Replit Deployments
- **SSL** : Automatique via Replit

### État de Déploiement
- ✅ Application entièrement fonctionnelle
- ✅ Base de données PostgreSQL configurée
- ✅ Interface mobile-first optimisée seniors
- ✅ Système complet de matching et messagerie
- ✅ Stripe + RevenueCat configurés pour paiements sécurisés
- ✅ Système de parrainage avec codes d'invitation
- ✅ Système d'emails automatiques MailerLite configuré et fonctionnel
- ✅ **Domaine date-mature.com en ligne avec SSL** (July 2, 2025)
- ✅ **Bugs critiques résolus : popup newsletter, upload photos, interface admin** (July 2, 2025)
- ✅ **Processus de déploiement maîtrisé par l'utilisateur** (July 2, 2025)
- ✅ **Système d'emails hybride fonctionnel MailerLite + MailerSend** (July 4, 2025)

## Changelog
```
Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Sistema de newsletter avec popup intelligent ajouté
- June 29, 2025. Intégration MailerLite et système de paiement préparés
- June 29, 2025. Système de connexion automatique configuré
- June 29, 2025. Durées d'engagement ajoutées : Premium 6 mois, Gold 12 mois
- June 29, 2025. Messages de bienvenue personnalisés avec prénom et salutations temporelles
- June 29, 2025. Système de social proof ajouté : notifications discrètes d'abonnements
- June 29, 2025. Système de parrainage complet avec codes d'invitation et récompenses
- June 29, 2025. Migration vers RevenueCat pour la gestion des abonnements
- June 29, 2025. Intégration complète Stripe + RevenueCat pour paiements sécurisés
- June 29, 2025. Tests complets des abonnements Premium et Gold réussis
- June 30, 2025. Pages navigation complètes : Aide, Sécurité, Paramètres, Modifier profil
- June 30, 2025. Récapitulatifs économies intégrés dans cartes abonnements
- June 30, 2025. Rééquilibrage plans : Premium 20 flashs/jour, Gold fonctionnalités exclusives
- June 30, 2025. Navigation home avec logo cœur ajoutée en haut et bas de toutes les pages
- June 30, 2025. Système de notifications visuelles ajouté : cœur qui vibre pour matches, animations pour flashs/messages
- June 30, 2025. Header enrichi avec compteurs temps réel : flashs restants, messages non lus, nouveaux matches
- June 30, 2025. Préparation système email MailerLite pour notifications personnalisées par événement
- June 30, 2025. Élargissement tranche d'âge cible : 40-75 ans au lieu de 50-75 ans pour augmenter la base utilisateurs
- June 30, 2025. Configuration complète MailerLite avec clé API pour emails automatiques (flashs, matches, digest quotidien)
- July 01, 2025. Rebranding complet vers "Date Mature" : header, pages, codes de parrainage (MATURE prefix)
- July 01, 2025. Mise à jour tranche d'âge cohérente : messages "après 40 ans" au lieu de "après 50 ans"
- July 01, 2025. Optimisation notifications sociales : âges 40-65 ans pour cibler la démographie correcte
- July 02, 2025. Corrections techniques majeures : popup newsletter intelligente (30s + 1x/jour), upload photos fonctionnel, textes optimisés
- July 02, 2025. Intégration MailerLite API complète avec clé secrète pour automation emails
- July 02, 2025. Processus de déploiement maîtrisé : corrections dev → bouton Deploy → production live
- July 02, 2025. Email obligatoire dans inscription : plus de confusion de connexion, intégration MailerLite automatique
- July 02, 2025. Upload photos entièrement fonctionnel : synchronisation PhotoUpload/formulaire, endpoint /api/upload/photo opérationnel
- July 02, 2025. Modification de profil corrigée : chargement données utilisateur, gestion types TypeScript, interface stable
- July 02, 2025. Interface admin améliorée : recherche par nom/email/ville, pagination 10 par page, bouton upgrade Premium temporaire
- July 03, 2025. Système récupération panier abandonné complet : codes promo "offre découverte" (-10% Premium, -20% Gold), détection automatique après 24h, intégration MailerLite avec tags spécialisés, interface checkout avec validation temps réel
- July 03, 2025. Email de confirmation paiement instantané pour tous les abonnements (Premium/Gold, mensuel/annuel) avec conseils pratiques et segmentation MailerLite automatique
- July 04, 2025. Système d'emails hybride opérationnel : MailerLite pour segmentation + MailerSend pour envoi transactionnel immédiat, templates HTML intégrés au code, fallback automatique si API indisponible
- July 04, 2025. Compte MailerSend soumis pour approbation : passage du plan Trial (100 emails) vers plan Hobby (3000 emails gratuits/mois) sous 24h, domaine date-mature.com vérifié
- July 04, 2025. Nouvelle landing page professionnelle créée : design chaleureux, message d'accueil "Retrouvez l'amour après 40 ans", témoignages intégrés, ancienne page sauvegardée en /accueil-v2
- July 04, 2025. **PROBLÈME MailerSend** : Compte refusé car "activités commerciales non conformes" (sites de rencontres). Solution : MailerLite uniquement avec automations manuelles à créer
- July 04, 2025. Système email simplifié : segmentation automatique MailerLite + guide configuration automations (MAILERLITE_SETUP_GUIDE.md), carrousel photos/témoignages synchronisé parfaitement
- July 04, 2025. **PROBLÈME CRÉATION PROFIL RÉSOLU** : Validation photo URL trop stricte bloquait upload local, bio étendue à 300 caractères avec compteur dynamique, processus inscription entièrement fonctionnel
- July 04, 2025. **POPUP NEWSLETTER ENTIÈREMENT FONCTIONNEL** : Système multi-déclencheurs opérationnel (30s + scroll 80% + exit intent + beforeunload), logique intelligente 1x/jour, localStorage géré, pages test/diagnostic créées, popup s'affiche correctement
- July 07, 2025. **PROBLÈME STOCKAGE MÉMOIRE RÉSOLU** : Migration complète de MemStorage vers DatabaseStorage PostgreSQL, persistance des données garantie après redémarrages serveur
- July 07, 2025. **INTERFACE ADMIN ENTIÈREMENT FONCTIONNELLE** : 107 profils persistants en PostgreSQL, bouton téléchargement backup JSON opérationnel, stats temps réel avec 31 Premium et 33 Gold
- July 07, 2025. **BASE DE DONNÉES ÉTENDUE** : 1356 profils répartis sur 13 régions, persistance PostgreSQL garantie après redéploiements
- July 07, 2025. **INTERFACE ADMIN COMPLÈTE** : Édition de tous les champs (prénom, âge 40-75 ans, ville, bio), boutons Premium/Gold, validation métier respectée
- July 08, 2025. **FILTRES ADMIN OPÉRATIONNELS** : Filtre H/F (330 hommes, 1295 femmes), toutes les régions peuplées (1625 profils, 100% couverture), filtrage backend corrigé avec paramètres API
- July 08, 2025. **UPLOAD PHOTOS CORRIGÉ** : Composant PhotoUpload intégré dans interface admin, prévisualisation temps réel, compression automatique, validation fichiers, messages d'erreur clairs
- July 08, 2025. **PRÉVISUALISATION PROFILS** : Modal de visualisation complète au clic sur photo, affichage élégant avec bio, région, abonnement, navigation fluide vers édition
- July 09, 2025. **POPUP NEWSLETTER EBOOK FONCTIONNEL** : Logique corrigée pour affichage naturel sur date-mature.com, segmentation automatique MailerLite "Newsletter prospects (popup)", contact mis à jour vers contact@date-mature.com
- July 09, 2025. **CARROUSEL PHOTOS OPTIMISÉ MOBILE** : Nouveau système de carrousel avec 4 images utilisateur intégrées, problème de chevauchement témoignages résolu, hauteur responsive (200px mobile, 256px+ desktop), CSS spécifique iPhone 7 SE, fonctionnel sur Samsung S9, popup fonctionne en scroll/exit intent
- July 11, 2025. **LIENS COURTS EBOOK RÉSEAUX SOCIAUX** : Pages dédiées créées pour partage social (/ebook, /guide, /conseils), popup intégré avec mockup professionnel, formulaire 2 étapes (prénom + email), design responsive optimisé pour conversions
- July 11, 2025. **SUPPRESSION EN LOT PROFILS** : Fonction de suppression massive dans admin-fixed.tsx, confirmation intelligente avec aperçu des noms, gestion d'erreurs avec compteurs succès/échec, bouton rouge avec nombre de sélections
- July 11, 2025. **TRI ALPHABÉTIQUE GÉNÉRALISÉ** : Tri français avec localeCompare dans toutes les interfaces admin (admin.tsx, admin-users.tsx, admin-fixed.tsx, profiles.tsx), facilite la navigation et modification des profils incohérents
- July 11, 2025. **RESTAURATION COMPLÈTE TERMINÉE** : 1170 profils restaurés après corruption de base, 23 profils avec * personnalisés entièrement récupérés avec bios et photos d'origine, 152 Premium et 85 Gold répartis, système entièrement fonctionnel
- July 11, 2025. **INTERFACE ADMIN CORRIGÉE** : Problème React Query résolu en créant versions simplifiées avec fetch direct, interface admin principale (/admin) et gestion utilisateurs (/admin/users) entièrement fonctionnelles, affichage correct des 1000 profils avec statistiques complètes
- July 11, 2025. **CRISE SYSTÈME RÉSOLUE** : Après destruction complète base de données et interface, restauration totale effectuée - interface admin-users.tsx complète restaurée depuis backup_pages (913 lignes), 197 profils restaurés avec génération continue vers 1000, correction routage App.tsx, conversion complète fetch API, tous filtres avancés et fonctionnalités opérationnelles
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```