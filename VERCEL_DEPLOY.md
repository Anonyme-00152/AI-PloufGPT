# 🚀 Guide de déploiement rapide - DarkGPT sur Vercel

## ⚡ Résumé
Votre application DarkGPT est prête pour Vercel ! Suivez ces 5 étapes simples pour la déployer gratuitement.

---

## 📋 Étape 1 : Préparer votre clé API OpenRouter

1. Allez sur **[openrouter.ai](https://openrouter.ai)**
2. Créez un compte gratuit (ou connectez-vous)
3. Allez dans **Settings → API Keys**
4. Cliquez **"Create New Key"**
5. Copiez votre clé API (vous en aurez besoin à l'étape 4)

---

## 🔧 Étape 2 : Créer un repository GitHub

### Option A : Via GitHub Web
1. Allez sur **[github.com/new](https://github.com/new)**
2. Nommez le repository `darkgpt` (ou autre)
3. Sélectionnez **Public** (pour Vercel gratuit)
4. Cliquez **"Create repository"**
5. Suivez les instructions pour pousser le code

### Option B : Via CLI (plus rapide)
```bash
# Clonez ce projet
git clone <ce-repo> darkgpt
cd darkgpt

# Initialisez Git
git init
git add .
git commit -m "Initial commit: DarkGPT for Vercel"

# Poussez sur GitHub
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/darkgpt.git
git push -u origin main
```

---

## 🌐 Étape 3 : Connecter Vercel à GitHub

1. Allez sur **[vercel.com](https://vercel.com)**
2. Cliquez **"Sign Up"** (ou **"Log In"**)
3. Connectez votre compte GitHub
4. Autorisez Vercel à accéder à vos repositories

---

## 📦 Étape 4 : Déployer sur Vercel

1. Sur Vercel, cliquez **"Add New..."** → **"Project"**
2. Sélectionnez votre repository `darkgpt`
3. Vercel détectera automatiquement la configuration
4. **IMPORTANT** : Allez à **"Environment Variables"**
5. Ajoutez une nouvelle variable :
   - **Name** : `OPENROUTER_API_KEY`
   - **Value** : Collez votre clé API OpenRouter
6. Cliquez **"Deploy"**

---

## ✅ Étape 5 : Tester votre application

1. Attendez que le déploiement soit terminé (2-3 minutes)
2. Cliquez sur le lien fourni par Vercel (ex: `https://darkgpt.vercel.app`)
3. Tapez une question et testez l'IA !

---

## 🎯 Résultat final

Votre application sera accessible à :
```
https://votre-domaine.vercel.app
```

---

## 🛠️ Dépannage

### ❌ "Erreur : Clé API non configurée"
- Vérifiez que `OPENROUTER_API_KEY` est bien configurée dans Vercel
- Allez dans **Project Settings → Environment Variables**
- Redéployez après avoir ajouté la variable

### ❌ "Erreur 429 - Saturé"
- L'API gratuite OpenRouter est surchargée
- Réessayez dans 1-2 minutes

### ❌ "Page blanche ou erreur 404"
- Attendez 2-3 minutes après le déploiement
- Rafraîchissez la page (Ctrl+F5 ou Cmd+Shift+R)
- Vérifiez les logs Vercel : **Project → Deployments → Logs**

---

## 📊 Limites gratuites

| Service | Limite gratuite |
|---------|-----------------|
| **Vercel** | 100 appels/jour |
| **OpenRouter** | Dépend du modèle (gratuit disponible) |

---

## 🔒 Sécurité

✅ Votre clé API est stockée de manière sécurisée dans Vercel  
✅ Les requêtes passent par les Serverless Functions (pas d'exposition)  
✅ CORS est configuré correctement  

---

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [API OpenRouter](https://openrouter.ai/docs)
- [Serverless Functions Python](https://vercel.com/docs/functions/serverless-functions/python)

---

## ❓ Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les **logs Vercel** (Project → Deployments)
2. Vérifiez que votre clé API OpenRouter est valide
3. Consultez la [documentation Vercel](https://vercel.com/docs)

---

**Bon déploiement ! 🚀**
