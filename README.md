# Matchy Angular 18 — Template Modulaire

> **#1 Tunisian Freelance Platform** — Template Angular 18 avec architecture modulaire (non standalone)

## 📁 Structure du projet

```
src/app/
├── frontoffice/                      # Module FrontOffice (site public)
│   ├── frontoffice.module.ts
│   ├── frontoffice-routing.module.ts
│   ├── home/                         # Page d'accueil (Hero + Stats)
│   ├── courses-resources/            # Catalogue de cours
│   ├── events/                       # Événements & webinars
│   ├── profile-settings/             # Profil utilisateur + onglets
│   ├── projects-milestones/          # Suivi projets & jalons
│   ├── subscription-management/      # Plans & abonnements
│   └── layout/                       # Navbar + Footer
│
├── backoffice/                       # Module BackOffice (admin)
│   ├── backoffice.module.ts
│   ├── backoffice-routing.module.ts
│   ├── dashboard/                    # Dashboard stats + KPIs
│   ├── users/                        # CRUD utilisateurs
│   ├── projects/                     # CRUD projets
│   ├── courses-resources/            # Gestion cours (admin)
│   ├── events/                       # Gestion événements (admin)
│   ├── profile-settings/             # Paramètres admin + plateforme
│   ├── projects-milestones/          # Vue admin des projets & jalons
│   ├── subscription-management/      # Gestion abonnements & revenus
│   ├── user-management/              # Gestion avancée + ban/verify
│   ├── layout/                       # Sidebar + Header + Login
│   └── shared/                       # StatCardComponent
│
└── core/                             # Guards, Services, Models, Interceptors
```

## 🚀 Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm start
# ou
ng serve

# 3. Ouvrir dans le navigateur
# http://localhost:4200
```

## 🔑 Accès

| Module | URL | Credentials |
|--------|-----|-------------|
| FrontOffice | http://localhost:4200 | - |
| BackOffice Login | http://localhost:4200/backoffice/login | - |
| BackOffice Dashboard | http://localhost:4200/backoffice/dashboard | admin@matchy.tn / password |

> **Note :** Le login est actuellement mocké. Remplacez la méthode `login()` dans `auth.service.ts` par votre vrai appel API.

## 🎨 Design

- **FrontOffice** : Thème sombre, fond `#0a0e27`, typographie Syne + DM Sans
- **BackOffice** : Thème clair avec sidebar sombre, couleurs Matchy Blue (#4f6ef7)
- **Design System** : Variables CSS globales dans `src/styles/styles.scss`

## 📦 Technologies

- **Angular 18** — Architecture modulaire (NgModule, non standalone)
- **SCSS** — Styles avec variables CSS custom
- **RxJS** — Gestion de l'état réactif
- **Angular Router** — Lazy loading des modules
- **Reactive Forms** — Formulaires typés

## 🔧 Prochaines étapes

1. **Connecter l'API** : Remplacer les données mockées dans les services
2. **Ajouter les charts** : Intégrer Chart.js ou ngx-charts pour le dashboard
3. **Auth réelle** : Implémenter JWT avec refresh token
4. **Guards** : Activer `AuthGuard` sur les routes protégées
5. **Pagination** : Ajouter la pagination dans les tableaux

## 📂 Conventions

- **Modules** : `@NgModule` avec `declarations`, `imports`, `exports`
- **Services** : `providedIn: 'root'` (singleton)
- **Composants** : `standalone: false` (architecture modulaire)
- **Routing** : Lazy loading avec `loadChildren`
- **Styles** : SCSS avec BEM naming convention
