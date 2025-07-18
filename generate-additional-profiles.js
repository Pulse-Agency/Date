import http from 'http';

// Données pour générer des profils réalistes
const frenchCities = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Lille", "Nice", "Nantes", "Montpellier", 
  "Strasbourg", "Bordeaux", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon",
  "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis", "Le Mans",
  "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Tours", "Limoges", "Amiens", "Perpignan",
  "Metz", "Besançon", "Boulogne-Billancourt", "Orléans", "Mulhouse", "Rouen", "Caen"
];

const frenchNames = {
  F: ["Marie", "Françoise", "Monique", "Sylvie", "Brigitte", "Nicole", "Annie", "Chantal", 
      "Catherine", "Martine", "Christine", "Denise", "Jacqueline", "Isabelle", "Nathalie", 
      "Véronique", "Sandrine", "Corinne", "Valérie", "Dominique", "Patricia", "Michèle"],
  H: ["Michel", "Jean", "Pierre", "André", "Bernard", "Jacques", "Philippe", "Alain",
      "Patrick", "Daniel", "Claude", "Christian", "François", "Thierry", "Marc", "Laurent",
      "Henri", "Gérard", "Pascal", "Serge", "Marcel", "Robert", "Louis", "René"]
};

const interests = [
  "Lecture", "Voyages", "Jardinage", "Cuisine", "Musique", "Cinéma", "Théâtre", "Art",
  "Histoire", "Nature", "Randonnée", "Photographie", "Danse", "Bridge", "Tricot",
  "Bricolage", "Pêche", "Cyclisme", "Natation", "Yoga", "Bénévolat"
];

const bios = [
  "Retraité actif, je partage mon temps entre mes petits-enfants et mes passions.",
  "Passionné de nature, j'aime les balades et les moments de tranquillité.",
  "Ex-cadre d'entreprise, je savoure enfin le temps libre pour mes loisirs favoris.",
  "Épicurien dans l'âme, j'apprécie les plaisirs simples de la vie.",
  "Sportif dans l'âme, je maintiens ma forme et cherche un partenaire actif.",
  "Ancien professeur, je cultive ma curiosité à travers les voyages et la lecture.",
  "Grand-parent comblé, je cherche quelqu'un pour partager de beaux moments.",
  "Veuf depuis peu, je souhaite retrouver la joie de partager avec quelqu'un de spécial.",
  "Amoureuse de la culture, je fréquente théâtres et musées avec passion.",
  "Artiste dans l'âme, je peins et dessine pour exprimer ma créativité."
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInterests() {
  const count = Math.floor(Math.random() * 4) + 2; // 2-5 interests
  const shuffled = [...interests].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateProfile() {
  const gender = Math.random() > 0.5 ? 'F' : 'H';
  const firstName = getRandomElement(frenchNames[gender]);
  const age = Math.floor(Math.random() * 36) + 40; // 40-75 ans
  const city = getRandomElement(frenchCities);
  const photoId = Math.floor(Math.random() * 100);
  
  return {
    firstName,
    gender,
    age,
    city,
    bio: getRandomElement(bios),
    interests: getRandomInterests(),
    photo: `https://randomuser.me/api/portraits/${gender.toLowerCase() === 'f' ? 'women' : 'men'}/${photoId}.jpg`,
    subscription: Math.random() > 0.9 ? (Math.random() > 0.5 ? 'premium' : 'gold') : 'gratuit',
    email: `${firstName.toLowerCase()}${age}@example.com`,
    dailyFlashesUsed: 0,
    flashsRemaining: 3,
    isTestProfile: false
  };
}

async function generateAdditionalProfiles(targetTotal = 985) {
  try {
    console.log(`🔄 Génération de profils supplémentaires pour atteindre ${targetTotal} profils...`);
    
    // Vérifier le nombre actuel
    const statsRes = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/stats',
        method: 'GET'
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });
    
    const currentCount = statsRes.totalUsers;
    const needed = targetTotal - currentCount;
    
    console.log(`📊 Profils actuels: ${currentCount}, à créer: ${needed}`);
    
    if (needed <= 0) {
      console.log('✅ Objectif déjà atteint !');
      return;
    }
    
    let created = 0;
    
    for (let i = 0; i < needed; i++) {
      try {
        const profile = generateProfile();
        const postData = JSON.stringify(profile);
        
        await new Promise((resolve, reject) => {
          const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/users',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData)
            }
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              if (res.statusCode === 200 || res.statusCode === 201) {
                created++;
                if (created % 100 === 0) {
                  console.log(`✅ ${created} nouveaux profils créés...`);
                }
                resolve();
              } else {
                reject(new Error(`HTTP ${res.statusCode}: ${data}`));
              }
            });
          });
          
          req.on('error', reject);
          req.write(postData);
          req.end();
        });
        
      } catch (error) {
        console.error(`❌ Erreur création profil ${i + 1}:`, error.message);
      }
    }
    
    console.log(`🎉 Génération terminée: ${created} nouveaux profils créés`);
    console.log(`📊 Total estimé: ${currentCount + created} profils`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
  }
}

// Générer pour atteindre 985 profils
generateAdditionalProfiles(985);