# ComponentLab 🧪

**Component Vault universel pour développeurs** - Stockez, organisez, documentez et réutilisez vos composants UI multi-framework avec une interface moderne et intuitive.

![ComponentLab](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Electron](https://img.shields.io/badge/Electron-28.1.0-47848F.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fonctionnalités principales

### 🎯 **Multi-framework universel**
- **React** (JSX/TSX) avec hooks et composants
- **Vue.js** (SFC) avec Composition API
- **Angular** avec TypeScript et décorateurs
- **Flutter** (Dart) avec widgets personnalisés
- **HTML/CSS** natif et Web Components
- **React Native** pour le mobile
- **Svelte** et autres frameworks modernes

### 🚀 **Import intelligent prioritaire**
1. **Dossier complet** ⭐ *Recommandé* - Import d'un projet entier avec auto-détection
2. **Fichiers multiples** - Sélection de fichiers individuels avec configuration
3. **Snippet de code** - Sauvegarde rapide d'extraits utiles

### 🎨 **Interface moderne et accessible**
- **Dark mode complet** avec détection système automatique
- **Scrollbars customisées** compatibles Firefox
- **Sidebar optimisée** avec cartes compactes (padding réduit, max 2 tags)
- **Monaco Editor** intégré avec thèmes adaptatifs
- **Responsive design** (minimum 1000x700px)

### 🌍 **Internationalisation complète**
- **Français** et **Anglais** avec détection automatique
- **Configuration premier lancement** avec sélection de langue
- **Persistance des préférences** utilisateur
- **Support i18next** avec fallback intelligent

### 🔍 **Recherche et filtrage avancés**
- **Recherche textuelle** dans noms, descriptions et tags
- **Filtres par framework** avec compteurs dynamiques
- **Filtres par plateforme** (Web, Mobile, Desktop, Universel)
- **Filtres par tags** avec combinaisons multiples
- **Statistiques en temps réel** des composants

## 🏗️ Architecture technique

### **Stack principal**
- **Frontend** : Electron 28.1 + React 18.2 + Vite 5.0
- **Styling** : TailwindCSS 3.4 avec dark mode classe
- **Éditeur** : Monaco Editor 4.6 (VS Code engine)
- **Stockage** : Système fichiers local avec JSON structuré
- **State** : Context API React avec reducers
- **IPC** : API Electron sécurisée avec preload.js

### **Sécurité et performance**
- **Context isolation** activé
- **Node integration** désactivé
- **API IPC** exposée via contextBridge
- **Stockage local** chiffré et versioned
- **Lazy loading** des composants lourds

## 📁 Structure de stockage

```
my_components/
├── React/
│   └── ButtonComponent/
│       ├── meta.json           # Métadonnées complètes
│       ├── Button.jsx          # Fichier principal
│       ├── Button.module.css   # Styles associés
│       ├── Button.stories.js   # Stories Storybook
│       ├── Button.test.js      # Tests unitaires
│       └── README.md           # Documentation
├── Vue/
│   └── CardComponent/
│       ├── meta.json
│       ├── Card.vue            # Single File Component
│       ├── Card.stories.js
│       └── types.ts            # Types TypeScript
├── Flutter/
│   └── CustomWidget/
│       ├── meta.json
│       ├── custom_widget.dart  # Widget principal
│       ├── widget_test.dart    # Tests
│       └── pubspec.yaml        # Dépendances
└── HTML/
    └── ModalComponent/
        ├── meta.json
        ├── modal.html          # Structure HTML
        ├── modal.css           # Styles CSS
        └── modal.js            # Logique JavaScript
```

## 🎯 Cas d'usage détaillés

### 1. **Import de dossier complet** ⭐ *Prioritaire*
```bash
# Exemple : Import d'un composant React complet
my-button-component/
├── index.js                    # Point d'entrée
├── Button.jsx                  # Composant principal
├── Button.module.css           # Styles CSS Modules
├── Button.stories.js           # Stories Storybook
├── Button.test.js              # Tests Jest
├── types.ts                    # Types TypeScript
└── README.md                   # Documentation
```

**Avantages :**
- Auto-détection du framework (React détecté via .jsx et imports)
- Identification automatique du fichier principal (index.js)
- Import de tous les fichiers associés (tests, styles, docs)
- Préservation de la structure originale

### 2. **Import de fichiers multiples**
```bash
# Sélection manuelle de fichiers dispersés
├── components/Button.vue       # Composant Vue
├── styles/button.scss          # Styles SCSS
├── docs/button-usage.md        # Documentation
└── tests/button.spec.js        # Tests
```

**Configuration :**
- `partial_import: true` - Marquage comme import partiel
- Framework détecté ou sélectionné manuellement
- Fichier principal désigné par l'utilisateur

### 3. **Snippet de code**
```javascript
// Exemple : Utilitaire de formatage de date
const formatDate = (date, locale = 'fr-FR') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};
```

**Métadonnées :**
- `snippet: true` - Marquage comme snippet
- Langage détecté automatiquement
- Sauvegarde rapide sans configuration complexe

## 📋 Schéma meta.json complet

```json
{
  "id": "button-component",
  "name": "Button Component",
  "description": "Bouton réutilisable avec variants et états",
  "framework": "React",
  "platform": "Web",
  "tags": ["ui", "button", "interactive", "accessible"],
  "version": "1.2.0",
  "author": "Votre nom",
  "created": "2024-01-15T10:30:00.000Z",
  "updated": "2024-01-20T14:45:00.000Z",
  "source_files": [
    "Button.jsx",
    "Button.module.css",
    "Button.stories.js",
    "Button.test.js",
    "types.ts",
    "README.md"
  ],
  "main_file": "Button.jsx",
  "external_styles": [
    "https://cdn.tailwindcss.com/3.4.0/tailwind.min.css"
  ],
  "partial_import": false,
  "snippet": false,
  "previewable": true
}
```

## 🎨 Interface utilisateur

### **Sidebar optimisée**
- **Recherche instantanée** avec debouncing
- **Filtres visuels** avec compteurs en temps réel
- **Cartes compactes** : padding `p-2`, icônes `w-6 h-6`
- **Tags limités** : maximum 2 affichés + compteur
- **Scrolling fluide** avec scrollbars customisées
- **Statistiques** : composants, frameworks, plateformes

### **Vue principale adaptative**
- **Liste des composants** avec tri et pagination
- **Détail composant** avec Monaco Editor
- **Aperçu en temps réel** pour composants supportés
- **Édition inline** avec sauvegarde automatique
- **Page de paramètres** complète

### **Assistant d'import multi-étapes**
1. **Sélection du type** avec recommandations
2. **Choix des sources** via dialogues natifs Electron
3. **Configuration** avec auto-détection intelligente
4. **Aperçu** avec validation des métadonnées
5. **Finalisation** avec feedback de progression

## 🌙 Dark mode et thèmes

### **Implémentation complète**
- **Détection automatique** des préférences système
- **Basculement manuel** avec persistance
- **Monaco Editor** avec thèmes `vs-dark`/`vs-light`
- **Scrollbars customisées** compatibles tous navigateurs
- **Transitions fluides** avec `transition-colors duration-200`

### **Classes Tailwind utilisées**
```css
/* Backgrounds */
.bg-white .dark:bg-gray-800
.bg-gray-50 .dark:bg-gray-900

/* Text */
.text-gray-900 .dark:text-white
.text-gray-600 .dark:text-gray-400

/* Borders */
.border-gray-200 .dark:border-gray-700

/* Scrollbars */
::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600;
}
```

## 🌍 Internationalisation (i18next)

### **Configuration hybride**
```javascript
// Ordre de détection des langues
detection: {
  order: [
    'localStorage',    // Préférence sauvegardée
    'navigator',       // Langue du navigateur  
    'htmlTag',         // Attribut lang du HTML
    'path',            // URL path
    'subdomain'        // Sous-domaine
  ]
}
```

### **Fichiers de traduction**
```
src/locales/
├── fr.json    # Français (langue par défaut)
├── en.json    # Anglais
└── index.js   # Configuration i18next
```

### **Premier lancement**
- **FirstRunSetup.jsx** pour sélection de langue
- **Détection automatique** avec fallback français
- **Persistance** dans localStorage
- **Application immédiate** sans redémarrage

## 🔧 Installation et développement

### **Prérequis**
- Node.js 18+ avec npm/yarn
- Git pour le versioning
- Système d'exploitation : Windows 10+, macOS 10.15+, Linux Ubuntu 18+

### **Installation**
```bash
# Cloner le repository
git clone https://github.com/votre-username/componentlab.git
cd componentlab

# Installer les dépendances
npm install

# Lancer en développement (hot reload)
npm run dev

# Build pour production
npm run build:electron

# Tests unitaires
npm run test

# Linting et formatage
npm run lint
npm run lint:fix
```

### **Scripts disponibles**
```json
{
  "dev": "concurrently \"npm run dev:vite\" \"npm run dev:electron\"",
  "dev:vite": "vite",
  "dev:electron": "wait-on http://localhost:5173 && electron .",
  "build": "vite build",
  "build:electron": "npm run build && electron-builder",
  "preview": "vite preview",
  "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix"
}
```

## 🚀 Roadmap et évolution

### **Phase 1 : MVP Local** ✅ *Terminé*
- ✅ Stockage local avec fichiers JSON
- ✅ Interface complète avec dark mode
- ✅ Import multi-modes (dossier prioritaire)
- ✅ Recherche et filtrage avancés
- ✅ Internationalisation FR/EN
- ✅ Assistant d'import robuste

### **Phase 2 : Partage et Export** 🚧 *En cours*
- 📋 Export de composants (ZIP, JSON)
- 📋 Import depuis URLs et repositories Git
- 📋 Synchronisation cloud optionnelle (Google Drive, Dropbox)
- 📋 Partage via liens temporaires
- 📋 Templates et boilerplates

### **Phase 3 : Collaboration Équipe** 📅 *Planifié*
- 📋 Workspaces partagés
- 📋 Versioning avancé avec Git integration
- 📋 Commentaires et reviews
- 📋 API REST publique
- 📋 Plugins et extensions

### **Phase 4 : Écosystème** 🔮 *Vision*
- 📋 Marketplace de composants
- 📋 CI/CD integration
- 📋 Storybook integration native
- 📋 Design tokens synchronization
- 📋 AI-powered component suggestions

## 🛡️ Sécurité et confidentialité

### **Stockage local sécurisé**
- **Aucune donnée** envoyée vers des serveurs externes
- **Chiffrement** des métadonnées sensibles
- **Isolation** des processus Electron
- **Validation** des entrées utilisateur
- **Sandboxing** des aperçus de composants

### **Bonnes pratiques**
- Context isolation activé
- Node integration désactivé  
- CSP (Content Security Policy) configuré
- Validation des fichiers importés
- Limitation des permissions système

## 🤝 Contribution et communauté

### **Comment contribuer**
1. **Fork** le projet sur GitHub
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Développer** avec tests unitaires
4. **Committer** avec messages conventionnels
5. **Pousser** vers la branche (`git push origin feature/AmazingFeature`)
6. **Ouvrir** une Pull Request avec description détaillée

### **Standards de code**
- **ESLint** avec configuration React
- **Prettier** pour le formatage automatique
- **Conventional Commits** pour les messages
- **Tests unitaires** obligatoires pour nouvelles features
- **Documentation** JSDoc pour les fonctions publiques

### **Issues et support**
- 🐛 **Bug reports** avec template détaillé
- 💡 **Feature requests** avec justification
- 📚 **Documentation** améliorations
- 🌍 **Traductions** nouvelles langues

## 📄 Licence et remerciements

### **Licence MIT**
```
MIT License - Copyright (c) 2024 ComponentLab Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

### **Remerciements et crédits**
- 🚀 **[Electron](https://electronjs.org/)** - Framework desktop cross-platform
- ⚛️ **[React](https://reactjs.org/)** - Bibliothèque UI déclarative
- ⚡ **[Vite](https://vitejs.dev/)** - Build tool ultra-rapide
- 🎨 **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utility-first
- 📝 **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - Éditeur VS Code
- 🎯 **[Lucide React](https://lucide.dev/)** - Icônes SVG modernes
- 🌍 **[i18next](https://www.i18next.com/)** - Framework d'internationalisation
- 🎭 **[React Context](https://reactjs.org/docs/context.html)** - State management

---

**ComponentLab** - *Votre vault de composants, organisé et accessible* 🧪✨ 