-- Restauration directe de l'état stable précédent
-- Vider la table users
DELETE FROM users;

-- Réinitialiser la séquence
SELECT setval('users_id_seq', 1, false);

-- Restaurer quelques profils critiques avec vos personnalisations
INSERT INTO users (
  "firstName", gender, age, city, region, bio, interests, photos, 
  subscription, email, "dailyFlashesUsed", "lastFlashReset", "isTestProfile",
  "referralCode", "referredById", "bonusFlashes", "subscriptionEndDate",
  "lookingForGender", "lookingForAgeMin", "lookingForAgeMax", 
  "lookingForDistance", "lookingForRelationType", "preferencesCompleted", "createdAt"
) VALUES 
-- Profils avec * personnalisés
('*Anna', 'F', 44, 'Paris', 'Île-de-France', 'Test correction avec nouvelle route SQL', 
 '["Voyages","Lecture"]', '["/uploads/photos/photo-1752221500498-724215295.jpg","https://randomuser.me/api/portraits/women/44.jpg"]', 
 'gratuit', 'user573@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),

('*Florence', 'F', 61, 'Bourges', 'Centre-Val de Loire', 'Bientôt retraitée, j''aimerai rencontrer un homme sincère',
 '["Cuisine","Jardinage"]', '["/uploads/photos/photo-1752222038574-51364542.jpg"]',
 'gratuit', 'user15@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),

('*Marjolaine', 'F', 54, 'Paris', 'Île-de-France', 'Passionnée de culture, j''aimerai pouvoir rencontrer quelqu''un pour sortir et peut être un peu plus',
 '["Culture","Voyages"]', '["/uploads/photos/photo-1752224583920-542568176.jpg"]',
 'gratuit', 'user377@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),

('* Anne', 'F', 45, 'Bordeaux', 'Nouvelle-Aquitaine', 'J''aime la vie et cherche LA bonne personne. mais ne sait pas si elle existe vraiment',
 '["Lecture","Cuisine"]', '["/uploads/photos/photo-1752221558577-525032751.jpg"]',
 'gratuit', 'user1441@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW()),

('* Anne Lise', 'F', 41, 'Paris', 'Île-de-France', 'Simple, coquette, amoureuse de la vie et des plaisirs simples',
 '["Danse","Voyages"]', '["/uploads/photos/photo-1752221601456-97779292.jpg"]',
 'gratuit', 'user368@example.com', 0, NOW(), false, NULL, NULL, 0, NULL, 'both', 40, 75, 'same_region', 'both', false, NOW());

-- Vérifier la restauration
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as star_profiles FROM users WHERE "firstName" LIKE '*%';
SELECT "firstName", photos FROM users WHERE "firstName" LIKE '*%' ORDER BY "firstName";