# 🚀 DÉMARRER MATCHY ANGULAR

## ⚠️ Important — Pourquoi ça s'affiche mal ?

Ce projet est une **application Angular** — il ne peut pas s'ouvrir directement en double-cliquant sur un fichier HTML.
Il faut le **compiler et le servir** avec Angular CLI.

---

## ✅ Étapes d'installation (une seule fois)

### 1. Prérequis
```bash
# Vérifier que Node.js est installé (version 18+)
node --version

# Vérifier que Angular CLI est installé
ng version

# Si Angular CLI n'est pas installé :
npm install -g @angular/cli
```

### 2. Installer les dépendances
```bash
# Ouvrir un terminal dans le dossier matchy-angular/
cd matchy-angular
npm install
```
> ⏳ Cela prend 1-2 minutes la première fois

### 3. Lancer l'application
```bash
ng serve
```

### 4. Ouvrir dans le navigateur
```
http://localhost:4200
```

---

## 🔗 Routes disponibles

### FrontOffice (site public)
| URL | Page |
|-----|------|
| `http://localhost:4200` | Accueil (Hero + Stats) |
| `http://localhost:4200/events` | Événements & Webinars |
| `http://localhost:4200/courses-resources` | Cours & Ressources |
| `http://localhost:4200/profile-settings` | Paramètres Profil |
| `http://localhost:4200/projects-milestones` | Projets & Jalons |
| `http://localhost:4200/subscription-management` | Abonnements |

### BackOffice (admin)
| URL | Page |
|-----|------|
| `http://localhost:4200/backoffice/login` | Connexion Admin |
| `http://localhost:4200/backoffice/dashboard` | Dashboard |
| `http://localhost:4200/backoffice/users` | Utilisateurs |
| `http://localhost:4200/backoffice/projects` | Projets |
| `http://localhost:4200/backoffice/courses-resources` | Cours (admin) |
| `http://localhost:4200/backoffice/events` | Événements (admin) |
| `http://localhost:4200/backoffice/profile-settings` | Paramètres Admin |
| `http://localhost:4200/backoffice/projects-milestones` | Jalons (admin) |
| `http://localhost:4200/backoffice/subscription-management` | Abonnements (admin) |
| `http://localhost:4200/backoffice/user-management` | Gestion Utilisateurs |

### Identifiants de test
```
Email    : admin@matchy.tn
Password : password
```

---

## 🏗️ Build pour production
```bash
ng build --configuration production
# Les fichiers compilés seront dans dist/matchy-angular/
```

---

## ❓ Problèmes fréquents

| Problème | Solution |
|---------|----------|
| `ng: command not found` | `npm install -g @angular/cli` |
| `Cannot find module` | Relancer `npm install` |
| Port 4200 déjà utilisé | `ng serve --port 4300` |
| Erreur de compilation SCSS | Vérifier la version de Node (18+) |
