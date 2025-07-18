#!/usr/bin/env python3
"""
Export complet de l'application Date Mature
Crée un fichier TAR.GZ avec tout le code source et les données
"""

import os
import tarfile
import json
import requests
from datetime import datetime
import shutil

def export_app():
    print("🚀 Export complet Date Mature")
    
    # Créer timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    export_name = f"date-mature-export-{timestamp}.tar.gz"
    
    # Exporter la base de données
    print("💾 Export base de données...")
    try:
        response = requests.get("http://localhost:5000/api/admin/users")
        if response.status_code == 200:
            with open("database-current.json", "w") as f:
                json.dump(response.json(), f, indent=2)
            print("✅ Base de données exportée")
        else:
            print(f"⚠️ Erreur DB: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Erreur DB: {e}")
    
    # Créer l'archive
    print("📦 Création archive...")
    
    files_to_include = [
        "client/",
        "server/", 
        "shared/",
        "backup_pages/",
        "email-templates/",
        "package.json",
        "package-lock.json", 
        "tsconfig.json",
        "vite.config.ts",
        "tailwind.config.ts",
        "postcss.config.js",
        "drizzle.config.ts",
        "components.json",
        "replit.md",
        "database-current.json",
        "EXPORT_GUIDE.md"
    ]
    
    # Ajouter tous les fichiers de backup
    for file in os.listdir("."):
        if "backup" in file and file.endswith(".json"):
            files_to_include.append(file)
        if "restore" in file and file.endswith(".js"):
            files_to_include.append(file)
    
    with tarfile.open(export_name, "w:gz") as tar:
        for item in files_to_include:
            if os.path.exists(item):
                tar.add(item)
                print(f"✅ Ajouté: {item}")
            else:
                print(f"⚠️ Manquant: {item}")
    
    # Vérifier la taille
    size_mb = os.path.getsize(export_name) / (1024 * 1024)
    print(f"✅ Export terminé: {export_name}")
    print(f"📊 Taille: {size_mb:.2f} MB")
    
    # Créer un README
    readme_content = f"""# Date Mature - Export Complet

## Contenu de l'export
- Code source complet (client, server, shared)
- Base de données ({export_name})
- Fichiers de backup
- Configuration complète

## Installation sur nouveau serveur

1. Extraire l'archive:
   tar -xzf {export_name}

2. Installer les dépendances:
   npm install

3. Configurer .env avec vos clés API

4. Configurer la base de données:
   npm run db:push

5. Importer les données:
   # Utiliser les fichiers backup-*.json

6. Lancer l'application:
   npm run dev

Export créé le: {datetime.now().strftime('%d/%m/%Y à %H:%M:%S')}
"""
    
    with open("README-EXPORT.md", "w") as f:
        f.write(readme_content)
    
    return export_name

if __name__ == "__main__":
    try:
        filename = export_app()
        print(f"\n🎉 SUCCESS! Application exportée: {filename}")
        print("💡 Téléchargez ce fichier depuis l'interface Replit")
        print("📖 Consultez README-EXPORT.md pour l'installation")
    except Exception as e:
        print(f"❌ Erreur: {e}")