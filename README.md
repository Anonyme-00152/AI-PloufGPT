# 🚀 DarkGPT - AI-PloufGPT Edition

Une plateforme d'IA provocatrice et sans filtre pour démontrer les techniques de jailbreaking d'IA à des fins éducatives.

## ⚠️ Avertissement Important

**Cette application est fournie strictement à des fins éducatives et de recherche.** Les utilisateurs sont responsables de l'utilisation éthique et légale de cette application. L'abus des techniques de jailbreaking d'IA à des fins nuisibles est interdit et peut violer les lois et les conditions d'utilisation.

## 🎯 À Propos

**DarkGPT** est un système d'IA créé par **DEDE** qui démontre comment les modèles de langage peuvent être manipulés via l'ingénierie de prompt. Cette plateforme éducative permet d'explorer les vulnérabilités des IA et de comprendre les mécanismes de sécurité.

### Caractéristiques Principales

- 🤖 **4 Modes d'IA** : Normal, Hacker, Vulgar, Expert
- 🔐 **Système de Licences** : Gestion des clés d'accès
- 📊 **Admin Dashboard** : Gestion complète des licences
- 🌐 **Support Multi-API** : Groq ou OpenRouter
- ⚡ **Déploiement Facile** : Vercel, Heroku, ou serveur classique
- 🎨 **Interface Moderne** : Design cyberpunk avec animations

## 🚀 Démarrage Rapide

### Installation Locale

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Anonyme-00152/AI-PloufGPT.git
   cd AI-PloufGPT
   ```

2. **Créer un environnement virtuel**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurer les variables d'environnement**
   ```bash
   export GROQ_API_KEY=votre_clé_groq_ici
   export ADMIN_PASSWORD=votre_mot_de_passe_admin
   ```

5. **Lancer l'application**
   ```bash
   python app.py
   ```

L'application sera accessible à `http://localhost:10000`

## 🌐 Déploiement sur Vercel

### Configuration Vercel

1. **Pousser sur GitHub** (déjà fait)

2. **Importer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez votre compte GitHub
   - Cliquez "Import Project"
   - Sélectionnez `Anonyme-00152/AI-PloufGPT`

3. **Configurer les variables d'environnement**
   - Allez dans Settings → Environment Variables
   - Ajoutez `GROQ_API_KEY` ou `OPENROUTER_API_KEY`
   - Ajoutez `ADMIN_PASSWORD`

4. **Déployer**
   ```bash
   vercel --prod
   ```

## 📡 API Endpoints

### Chat Endpoint

**POST** `/api/chat`

```bash
curl -X POST https://votre-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Votre question ici",
    "mode": "normal",
    "license_key": "votre-clé-de-licence"
  }'
```

**Modes disponibles** :
- `normal` : DarkGPT standard
- `hacker` : Mode technique
- `vulgar` : Mode sans filtre
- `expert` : Mode technique avancé

## 🔑 Système de Licences

Les licences peuvent être gérées via le dashboard admin (`/admin`).

## 🎨 Système d'IA DarkGPT

Créé par **DEDE**, ce système d'IA démontre :
- L'ingénierie de prompt avancée
- Les techniques de jailbreaking
- Les vulnérabilités des modèles de langage
- L'importance de la robustesse des systèmes d'IA

## 📚 Documentation

- [DARKGPT_INTEGRATION.md](./DARKGPT_INTEGRATION.md) - Détails techniques
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Guide Vercel complet

## ⚠️ Responsabilité

Cette application est fournie à titre éducatif uniquement. Les utilisateurs acceptent que :
- Tout abus est de la responsabilité de l'utilisateur
- Les créateurs ne sont pas responsables des utilisations malveillantes
- L'utilisation doit respecter les lois locales et internationales

## 📄 Licence

MIT License

## 👤 Créateur

**DarkGPT** créé par **DEDE**

---

**Dernière mise à jour** : 20 Janvier 2026
**Plateforme** : AI-PloufGPT
