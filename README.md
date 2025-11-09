# Helios - Système de Supervision Sécurisé IoT

Interface de supervision pour la surveillance en temps réel des dispositifs IoT connectés sur des sites télécom. Intégration complète avec la plateforme Thingsboard pour la gestion des cadenas connectés, caméras, batteries GPS et détecteurs de proximité.

## 🎯 Fonctionnalités

- **Authentification sécurisée** avec tokens JWT Thingsboard
- **Tableau de bord en temps réel** avec vue d'ensemble des sites et alertes
- **Gestion des cadenas connectés** - Statut de verrouillage, niveau de batterie, historique
- **Surveillance vidéo** - Intégration de flux vidéo (YouTube, flux directs)
- **Suivi GPS des batteries** - Carte interactive avec géolocalisation en temps réel
- **Détecteurs de proximité** - Zones de surveillance avec alertes d'intrusion
- **Administration des dispositifs** - Configuration des UUIDs Thingsboard
- **Rafraîchissement automatique** - Mise à jour des données toutes les 30 secondes
- **Interface en français** - Entièrement localisée

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Thingsboard avec accès API
- Dispositifs IoT enregistrés sur votre plateforme Thingsboard

## 🚀 Installation

### 1. Cloner ou télécharger le projet

\`\`\`bash
# Si vous avez Git
git clone <url-du-repo>
cd helios

# Ou télécharger le ZIP depuis v0 et extraire
\`\`\`

### 2. Installer les dépendances

\`\`\`bash
npm install
\`\`\`

### 3. Configuration de l'environnement

Le projet est configuré pour se connecter à votre plateforme Thingsboard. Les paramètres sont définis dans le code :

**Base URL API** : `https://platform.iokub.com:443/api/`

Si vous utilisez une autre instance Thingsboard, modifiez l'URL dans `lib/thingsboard-api.ts` :

\`\`\`typescript
private baseUrl = 'https://votre-instance.com/api';
\`\`\`

### 4. Lancer le projet en développement

\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### 5. Build pour la production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🔐 Première connexion

1. Accédez à [http://localhost:3000](http://localhost:3000)
2. Vous serez redirigé vers la page de connexion
3. Entrez vos identifiants Thingsboard :
   - **Nom d'utilisateur** : votre email tenant Thingsboard (ex: `tenant@thingsboard.org`)
   - **Mot de passe** : votre mot de passe Thingsboard

## ⚙️ Configuration des dispositifs

Après connexion, configurez vos dispositifs IoT :

1. Cliquez sur votre profil utilisateur (en haut à droite)
2. Sélectionnez **"Administration"**
3. Ajoutez vos dispositifs avec :
   - **Nom** : Nom descriptif du dispositif
   - **Type** : Cadenas / Caméra / Batterie / Détecteur de Proximité
   - **UUID** : L'identifiant du dispositif sur Thingsboard
   - **URL Stream** (pour les caméras) : Lien vers le flux vidéo

### Comment obtenir les UUIDs Thingsboard ?

1. Connectez-vous à votre tableau de bord Thingsboard
2. Allez dans **Dispositifs** (Devices)
3. Cliquez sur un dispositif pour voir ses détails
4. Copiez l'**ID** (UUID) du dispositif
5. Collez-le dans l'administration Helios

## 📁 Structure du projet

\`\`\`
helios/
├── app/                          # Pages Next.js
│   ├── page.tsx                 # Tableau de bord principal
│   ├── login/                   # Page de connexion
│   ├── admin/                   # Administration des dispositifs
│   ├── padlocks/                # Gestion des cadenas
│   ├── cameras/                 # Surveillance vidéo
│   ├── batteries/               # Suivi GPS batteries
│   ├── proximity/               # Détecteurs de proximité
│   └── alerts/                  # Gestion des alertes
├── components/                   # Composants React réutilisables
│   ├── header.tsx               # En-tête avec menu utilisateur
│   ├── stats-overview.tsx       # Statistiques globales
│   ├── site-map.tsx             # Carte des sites
│   ├── padlock-grid.tsx         # Grille des cadenas
│   ├── camera-grid.tsx          # Grille des caméras
│   ├── battery-map.tsx          # Carte GPS batteries
│   └── ...                      # Autres composants
├── lib/                          # Utilitaires et services
│   ├── thingsboard-api.ts       # Client API Thingsboard
│   ├── auth-context.tsx         # Gestion de l'authentification
│   ├── device-storage.ts        # Stockage local des dispositifs
│   └── types.ts                 # Définitions TypeScript
└── public/                       # Assets statiques
\`\`\`

## 🔧 Technologies utilisées

- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styles utilitaires
- **Lucide React** - Icônes
- **SWR** - Gestion du cache et data fetching
- **Recharts** - Graphiques et visualisations

## 🌐 API Thingsboard

L'application communique avec l'API REST Thingsboard :

- **Authentication** : `POST /api/auth/login`
- **Dispositifs** : `GET /api/devices?deviceIds={ids}`

Consultez la [documentation Thingsboard](https://thingsboard.io/docs/api/) pour plus de détails.

## 🎨 Personnalisation du thème

Les couleurs et le thème sombre sont configurés dans `app/globals.css`. Modifiez les variables CSS pour personnaliser l'apparence :

\`\`\`css
@theme inline {
  --color-primary: /* Couleur primaire */;
  --color-background: /* Fond de l'application */;
  --color-card: /* Fond des cartes */;
  /* ... autres variables */
}
\`\`\`

## 🐛 Dépannage

### Le token a expiré

Les tokens JWT Thingsboard expirent après un certain temps. L'application vous redirigera automatiquement vers la page de connexion. Reconnectez-vous simplement.

### Les données ne se chargent pas

1. Vérifiez que vous avez ajouté des dispositifs dans l'administration
2. Vérifiez que les UUIDs correspondent à ceux dans Thingsboard
3. Vérifiez la console du navigateur pour les erreurs API
4. Assurez-vous que votre token Thingsboard est valide

### Erreur CORS

Si vous rencontrez des erreurs CORS, vérifiez que votre instance Thingsboard autorise les requêtes depuis votre domaine.

## 📝 Développement

### Ajouter un nouveau type de dispositif

1. Ajoutez le type dans `lib/device-storage.ts`
2. Créez une nouvelle page dans `app/`
3. Créez les composants d'affichage dans `components/`
4. Ajoutez la route dans le menu principal

### Déboguer l'application

Des logs de débogage sont présents dans le code avec le préfixe `[v0]`. Ouvrez la console du navigateur pour les voir.

## 📄 Licence

Ce projet est développé pour la supervision sécurisée des sites télécom.

## 🤝 Support

Pour toute question ou problème, consultez :
- [Documentation Thingsboard](https://thingsboard.io/docs/)
- [Documentation Next.js](https://nextjs.org/docs)

---

Développé avec v0 by Vercel
