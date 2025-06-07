# ComponentLab 🧩

<div align="center">

![ComponentLab Logo](public/componentLab256x256.png)

**Component Vault universel pour développeurs**

*Stockez, organisez et réutilisez vos composants UI multi-framework*

[![Version](https://img.shields.io/github/v/release/Pouiks/ComponentLab)](https://github.com/Pouiks/ComponentLab/releases)
[![Downloads](https://img.shields.io/github/downloads/Pouiks/ComponentLab/total)](https://github.com/Pouiks/ComponentLab/releases)
[![License](https://img.shields.io/github/license/Pouiks/ComponentLab)](LICENSE)

[📥 Télécharger](https://github.com/Pouiks/ComponentLab/releases/latest) • [🐛 Reporter un bug](https://github.com/Pouiks/ComponentLab/issues) • [💬 Discussions](https://github.com/Pouiks/ComponentLab/discussions)

</div>

## 🎯 À propos

ComponentLab est une application desktop qui révolutionne la façon dont les développeurs gèrent leurs composants UI. Fini le temps perdu à chercher ce bouton parfait ou cette animation CSS dans vos anciens projets !

### ✨ Pourquoi ComponentLab ?

- **🏗️ Multi-framework** : React, Vue, Angular, Flutter, HTML/CSS, Web Components...
- **🔍 Recherche intelligente** : Trouvez vos composants en quelques secondes
- **📁 Import flexible** : Dossiers complets, fichiers multiples, ou simples snippets
- **🌍 Interface bilingue** : Français et Anglais
- **🌙 Mode sombre** : Confort visuel pour les longues sessions de code
- **📝 Documentation intégrée** : Chaque composant avec sa doc et ses exemples

## 🚀 Fonctionnalités

### 📦 Gestion des composants
- **Import avancé** : 4 méthodes d'import (dossier complet, fichiers multiples, snippet, styles externes)
- **Détection automatique** : Reconnaissance du framework et du langage
- **Prévisualisation** : Aperçu du code avec coloration syntaxique (Monaco Editor)
- **Métadonnées complètes** : Nom, description, tags, version, auteur...

### 🔎 Recherche et organisation
- **Recherche textuelle** : Dans le nom, description, tags
- **Filtres avancés** : Par framework, langage, type
- **Vue liste/grille** : Organisez selon vos préférences
- **Navigation intuitive** : Interface claire et responsive

### 🛠️ Développeur-friendly
- **Éditeur intégré** : Monaco Editor avec support multi-langage
- **Sauvegarde automatique** : Modifications préservées en temps réel
- **Suppression sécurisée** : Confirmation avant suppression
- **Stockage local** : Vos composants restent sur votre machine

## 🖼️ Screenshots

<!-- Ajoutez vos screenshots ici -->
<div align="center">

### Interface principale
![Interface principale](docs/screenshots/main-interface.png)

### Mode sombre
![Mode sombre](docs/screenshots/light-mode.png)

### Import de composants
![Import wizard](docs/screenshots/import-wizard.png)

### Éditeur de code
![Code editor](docs/screenshots/code-editor.png)

</div>

## 📥 Installation

### Windows

1. **Téléchargez** la dernière version depuis la [page des releases](https://github.com//ComponentLab/releases/latest)
2. **Exécutez** `ComponentLab.Setup.x.x.x.exe`
3. **Suivez** l'assistant d'installation

⚠️ **Note importante** :** Windows peut afficher un avertissement SmartScreen car l'application n'est pas signée numériquement. Cliquez sur "Informations complémentaires" puis "Exécuter quand même" - ComponentLab est parfaitement sûr !**

### macOS & Linux

*Versions à venir - Contributions bienvenues !*

## 🎮 Utilisation

### Premier lancement

1. **Lancez ComponentLab** depuis votre menu Démarrer
2. **Explorez** l'interface avec les composants d'exemple
3. **Ajoutez** votre premier composant avec le bouton "+"

### Ajouter un composant

1. **Cliquez** sur le bouton "+" dans la sidebar
2. **Choisissez** votre méthode d'import :
   - **Dossier complet** : Pour importer un composant avec tous ses fichiers
   - **Fichiers multiples** : Sélectionnez plusieurs fichiers liés
   - **Snippet de code** : Copiez-collez du code directement
   - **Styles externes** : Référencez des fichiers CSS externes
3. **Remplissez** les métadonnées (nom, description, tags...)
4. **Sauvegardez** et c'est prêt !

### Organiser vos composants

- **Recherchez** avec la barre de recherche
- **Filtrez** par framework ou langage
- **Triez** par nom, date de création, ou dernière modification
- **Supprimez** les composants obsolètes (avec confirmation)

## 🔧 Configuration

### Structure des fichiers

ComponentLab stocke vos composants dans :
my_components/
├── React/
│ ├── Button/
│ │ ├── index.jsx
│ │ ├── styles.css
│ │ └── meta.json
│ └── Modal/
│ ├── index.jsx
│ └── meta.json
├── Vue/
├── Angular/
└── ...


### Format meta.json

```json
{
  "id": "button-primary",
  "name": "Primary Button",
  "description": "Bouton primaire avec animations",
  "framework": "React",
  "language": "JSX",
  "tags": ["button", "primary", "interactive"],
  "version": "1.0.0",
  "author": "Votre nom",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## 🛠️ Développement

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation locale

```bash
# Cloner le repo
git clone https://github.com/Pouiks/ComponentLab.git
cd ComponentLab

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Scripts disponibles

```bash
npm run dev          # Développement avec hot-reload
npm run build        # Build pour production
npm run build:electron # Build et package l'app Electron
npm run lint         # Vérification du code
npm run lint:fix     # Correction automatique
```

### Stack technique

- **Frontend** : React 18 + Vite
- **Desktop** : Electron 28
- **Styling** : TailwindCSS
- **Éditeur** : Monaco Editor
- **Icons** : Lucide React
- **i18n** : react-i18next

## 🤝 Contribution

Les contributions sont les bienvenues ! 

### Comment contribuer

1. **Forkez** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Idées de contributions

- [ ] Support macOS et Linux
- [ ] Synchronisation cloud (optionnelle)
- [ ] Plugins pour IDE (VS Code, WebStorm...)
- [ ] Export vers différents formats
- [ ] Thèmes personnalisés
- [ ] API REST pour intégrations

## 🐛 Problèmes connus

- **Windows SmartScreen** : Avertissement normal pour les apps non signées
- **Icônes** : Utilise l'icône par défaut d'Electron temporairement

## 📋 Roadmap

- [ ] **v1.1** : Support macOS et Linux
- [ ] **v1.2** : Plugins IDE
- [ ] **v1.3** : Synchronisation cloud
- [ ] **v2.0** : Mode collaboration équipe

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 💬 Support

- 🐛 **Bugs** : [Issues GitHub](https://github.com/Pouiks/ComponentLab/issues)
- 💭 **Discussions** : [GitHub Discussions](https://github.com/Pouiks/ComponentLab/discussions)
- 📧 **Contact** : votre-email@example.com

## ⭐ Remerciements

- Merci à tous les contributeurs
- Inspiré par les besoins réels des développeurs
- Construit avec amour pour la communauté dev

---

<div align="center">

**⭐ Si ComponentLab vous aide, n'hésitez pas à mettre une étoile au projet !**


</div>
