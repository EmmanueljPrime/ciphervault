# 🔐 CipherVault - Chiffreur/Déchiffreur de Texte Sécurisé

CipherVault est une application moderne de chiffrement et déchiffrement de texte avec support de multiples algorithmes cryptographiques et génération de QR codes. Conçu avec Next.js et une interface utilisateur au thème cyber-sécurité.

## 📋 Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Guide d'utilisation](#guide-dutilisation)
- [Architecture technique](#architecture-technique)
- [Algorithmes supportés](#algorithmes-supportés)
- [Sécurité](#sécurité)
- [API Reference](#api-reference)

## ✨ Fonctionnalités

### 🔒 Chiffrement/Déchiffrement Multi-Algorithmes

**Comment ça fonctionne :**
- **Interface unifiée** : Un seul bouton bascule entre chiffrement et déchiffrement
- **6 algorithmes supportés** : César, Vigenère, XOR, AES, Base64, ROT13
- **Gestion automatique des clés** : Génération et validation selon l'algorithme
- **Traitement en temps réel** : Résultats instantanés avec feedback visuel

**Modes de fonctionnement :**
- **Mode Chiffrement** : Transforme le texte clair en texte chiffré
- **Mode Déchiffrement** : Restaure le texte original à partir du texte chiffré
- **Basculement intelligent** : Préservation des paramètres lors du changement de mode

**Code technique :**
\`\`\`typescript
const processText = () => {
switch (algorithm) {
case "caesar":
processedText = caesarCipher(inputText, shift, !isEncrypting)
break
case "aes":
processedText = aesCipher(inputText, key, !isEncrypting)
break
// ... autres algorithmes
}
}
\`\`\`

### 🎯 Algorithmes de Chiffrement

#### 1. **César (Décalage)**
- **Principe** : Décalage alphabétique simple
- **Clé** : Nombre entier (ex: 3)
- **Sécurité** : 🔴 Faible - Facilement cassable
- **Usage** : Éducatif, démonstration

\`\`\`typescript
const caesarCipher = (text: string, shift: number, decrypt = false): string => {
const actualShift = decrypt ? -shift : shift
return text.replace(/[a-zA-Z]/g, (char) => {
const start = char <= "Z" ? 65 : 97
return String.fromCharCode(((char.charCodeAt(0) - start + actualShift + 26) % 26) + start)
})
}
\`\`\`

#### 2. **Vigenère (Polyalphabétique)**
- **Principe** : Clé répétée sur le texte
- **Clé** : Mot ou phrase (ex: "SECRET")
- **Sécurité** : 🟡 Moyen - Résistant aux analyses de fréquence simples
- **Usage** : Chiffrement historique amélioré

#### 3. **XOR (Bit à bit)**
- **Principe** : Opération XOR entre texte et clé
- **Clé** : Chaîne de caractères quelconque
- **Sécurité** : 🔵 Variable - Dépend de la qualité de la clé
- **Usage** : Chiffrement rapide, masquage de données

#### 4. **AES (Advanced Encryption Standard)**
- **Principe** : Chiffrement symétrique moderne
- **Clé** : Phrase de passe forte
- **Sécurité** : 🟢 Très fort - Standard militaire/gouvernemental
- **Usage** : Protection de données sensibles

#### 5. **Base64 (Encodage)**
- **Principe** : Encodage en base 64 (pas de chiffrement réel)
- **Clé** : Aucune
- **Sécurité** : ⚪ Aucune - Simple obfuscation
- **Usage** : Transport de données, encodage

#### 6. **ROT13 (Rotation)**
- **Principe** : Rotation de 13 caractères (César fixe)
- **Clé** : Aucune (fixe à 13)
- **Sécurité** : ⚪ Aucune - Réversible instantanément
- **Usage** : Masquage léger, forums

### 📱 Générateur de QR Code

**Fonctionnalités :**
- **Génération automatique** : QR code du texte chiffré
- **Personnalisation visuelle** : Couleurs cyber (vert/noir)
- **Navigation intelligente** : Bascule automatique vers l'onglet QR
- **Export multiple** : Téléchargement PNG + copie Data URL

**Spécifications techniques :**
- **Taille** : 256x256 pixels
- **Marge** : 2 modules
- **Couleurs** : Vert (#00ff88) sur noir (#0a0a0a)
- **Format** : PNG en base64

\`\`\`typescript
const generateQRCode = async () => {
const qrUrl = await QRCode.toDataURL(result, {
width: 256,
margin: 2,
color: {
dark: "#00ff88",
light: "#0a0a0a",
},
})
setQrCodeUrl(qrUrl)
setActiveTab("qr") // Navigation automatique
}
\`\`\`

### 📊 Système d'Historique

**Fonctionnalités :**
- **Stockage local** : 10 dernières opérations
- **Métadonnées complètes** : Algorithme, clé, timestamp
- **Copie rapide** : Réutilisation des résultats précédents
- **Interface chronologique** : Tri par date décroissante

**Structure des données :**
\`\`\`typescript
interface CipherResult {
result: string      // Texte chiffré/déchiffré
algorithm: string   // Algorithme utilisé
key: string        // Clé de chiffrement
timestamp: string  // Date/heure de l'opération
}
\`\`\`

### 🎨 Interface Cyber-Sécurité

**Design System :**
- **Palette** : Dégradés vert/cyan sur fond sombre
- **Typographie** : Font monospace pour l'aspect terminal
- **Animations** : Transitions fluides et effets hover
- **Iconographie** : Lucide React avec thème sécurité

**Composants visuels :**
- **Badges de sécurité** : Indicateurs colorés par niveau
- **Switches animés** : Basculement mode chiffrement/déchiffrement
- **Cards glassmorphism** : Effet de transparence moderne
- **Boutons gradient** : Effets visuels cyber

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn ou pnpm

### Étapes d'installation

1. **Cloner le projet**
   \`\`\`bash
   git clone <repository-url>
   cd ciphervault
   \`\`\`

2. **Installer les dépendances**
   \`\`\`bash
   npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

3. **Lancer en développement**
   \`\`\`bash
   npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

4. **Build pour production**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

L'application sera accessible sur \`http://localhost:3000\`

## 📖 Guide d'Utilisation

### 1. Chiffrement de Texte

1. **Sélectionner l'algorithme** dans le menu déroulant
2. **Configurer la clé** :
    - César : Nombre (ex: 3, 13, 25)
    - Vigenère/XOR/AES : Texte (ex: "MonMotDePasse")
    - Base64/ROT13 : Aucune clé requise
3. **Saisir le texte** à chiffrer dans la zone de texte
4. **Cliquer sur "CHIFFRER"** pour obtenir le résultat
5. **Copier ou générer un QR Code** du résultat

### 2. Déchiffrement de Texte

1. **Basculer en mode déchiffrement** avec le switch
2. **Utiliser la même clé** que pour le chiffrement
3. **Saisir le texte chiffré** dans la zone d'entrée
4. **Cliquer sur "DÉCHIFFRER"** pour restaurer le texte original

### 3. Génération de QR Code

1. **Chiffrer un texte** dans l'onglet principal
2. **Cliquer sur "QR Code"** (navigation automatique)
3. **Télécharger l'image** ou copier l'URL
4. **Scanner avec un smartphone** pour récupérer le texte chiffré

### 4. Consultation de l'Historique

1. **Accéder à l'onglet "Historique"**
2. **Consulter les 10 dernières opérations**
3. **Copier un résultat précédent** si nécessaire
4. **Voir les métadonnées** (algorithme, clé, date)

## 🏗️ Architecture Technique

### Structure des Fichiers
\`\`\`
app/
├── page.tsx          # Composant principal CipherVault
├── layout.tsx        # Layout global avec thème sombre
└── globals.css       # Styles globaux + thème cyber

components/ui/         # Composants shadcn/ui
├── button.tsx        # Boutons avec variants
├── card.tsx          # Cards avec bordures vertes
├── input.tsx         # Inputs avec thème sombre
├── textarea.tsx      # Zone de texte monospace
├── tabs.tsx          # Navigation par onglets
├── select.tsx        # Sélecteurs d'algorithmes
├── switch.tsx        # Basculeurs animés
├── badge.tsx         # Badges de sécurité
└── ...

hooks/
└── use-toast.ts      # Hook pour notifications

lib/
└── utils.ts          # Utilitaires (cn function)
\`\`\`

### Technologies Utilisées

- **Framework** : Next.js 14 (App Router)
- **UI Library** : shadcn/ui + Radix UI
- **Styling** : Tailwind CSS avec thème personnalisé
- **Cryptographie** : crypto-js + algorithmes custom
- **QR Codes** : qrcode library
- **Icons** : Lucide React
- **TypeScript** : Type safety complète

### État de l'Application

\`\`\`typescript
// États principaux
const [inputText, setInputText] = useState("")           // Texte d'entrée
const [key, setKey] = useState("")                       // Clé de chiffrement
const [algorithm, setAlgorithm] = useState("caesar")     // Algorithme sélectionné
const [result, setResult] = useState("")                 // Résultat du traitement
const [qrCodeUrl, setQrCodeUrl] = useState("")          // URL du QR code
const [isEncrypting, setIsEncrypting] = useState(true)   // Mode chiffrement/déchiffrement
const [activeTab, setActiveTab] = useState("cipher")     // Onglet actif
const [history, setHistory] = useState<CipherResult[]>([]) // Historique des opérations
\`\`\`

## 🔒 Sécurité

### Niveaux de Sécurité par Algorithme

| Algorithme | Niveau | Usage Recommandé | Vulnérabilités |
|------------|--------|------------------|----------------|
| **AES** | 🟢 Très Fort | Données sensibles | Aucune connue |
| **XOR** | 🔵 Variable | Selon la clé | Clé faible = vulnérable |
| **Vigenère** | 🟡 Moyen | Éducatif/Historique | Analyse statistique |
| **César** | 🔴 Faible | Démonstration | Force brute triviale |
| **Base64** | ⚪ Aucune | Transport de données | Décodage instantané |
| **ROT13** | ⚪ Aucune | Masquage léger | Réversible |

### Bonnes Pratiques Implémentées

1. **Validation des entrées** : Vérification des clés et textes
2. **Gestion d'erreurs** : Try/catch avec messages explicites
3. **Pas de stockage persistant** : Aucune donnée sensible sauvée
4. **Génération de clés sécurisée** : Caractères aléatoires cryptographiques
5. **Interface claire** : Indicateurs visuels de sécurité

### Recommandations d'Usage

- **Pour la production** : Utilisez uniquement AES avec des clés fortes
- **Longueur de clé** : Minimum 16 caractères pour AES
- **Clés uniques** : Ne réutilisez jamais la même clé
- **Transport sécurisé** : Utilisez HTTPS pour transmettre les données chiffrées

### Limitations de Sécurité

- **Chiffrement côté client** : Les clés transitent en clair dans le navigateur
- **Pas de gestion de clés** : Aucun système de stockage sécurisé des clés
- **Algorithmes éducatifs** : César, Vigenère, ROT13 ne sont pas sécurisés
- **Pas d'authentification** : Aucune vérification d'intégrité des données

## 📚 API Reference

### Fonctions de Chiffrement

#### \`caesarCipher(text: string, shift: number, decrypt?: boolean): string\`
Chiffrement César avec décalage alphabétique.

**Paramètres :**
- \`text\` : Texte à traiter
- \`shift\` : Nombre de positions de décalage
- \`decrypt\` : Mode déchiffrement (optionnel)

#### \`vigenereCipher(text: string, key: string, decrypt?: boolean): string\`
Chiffrement Vigenère polyalphabétique.

#### \`xorCipher(text: string, key: string): string\`
Chiffrement XOR bit à bit (réversible).

#### \`aesCipher(text: string, key: string, decrypt?: boolean): string\`
Chiffrement AES avec crypto-js.

### Fonctions Utilitaires

#### \`generateKey(): void\`
Génère une clé aléatoire de 16 caractères.

#### \`generateQRCode(): Promise<void>\`
Génère un QR code du résultat et bascule vers l'onglet QR.

#### \`copyToClipboard(text: string, type: string): void\`
Copie du texte dans le presse-papiers avec notification.

### Hooks Personnalisés

#### \`useToast()\`
Hook pour afficher des notifications toast.

\`\`\`typescript
const { toast } = useToast()
toast({
title: "Succès",
description: "Texte chiffré avec succès",
})
\`\`\`

## 🎯 Cas d'Usage

### 1. **Éducation en Cryptographie**
- Démonstration des algorithmes classiques
- Comparaison des niveaux de sécurité
- Apprentissage interactif

### 2. **Prototypage Rapide**
- Tests d'algorithmes de chiffrement
- Validation de concepts
- Démonstrations client

### 3. **Masquage de Données**
- Obfuscation légère avec Base64/ROT13
- Transport de données non sensibles
- Génération de QR codes

### 4. **Communication Sécurisée Basique**
- Échange de messages avec AES
- Partage via QR codes
- Historique des conversations

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/NewAlgorithm\`)
3. Commit les changements (\`git commit -m 'Add Blowfish algorithm'\`)
4. Push vers la branche (\`git push origin feature/NewAlgorithm\`)
5. Ouvrir une Pull Request

### Guidelines de Contribution

- **Tests** : Ajouter des tests pour les nouveaux algorithmes
- **Documentation** : Mettre à jour le README pour les nouvelles fonctionnalités
- **Sécurité** : Indiquer clairement le niveau de sécurité des algorithmes
- **UI/UX** : Respecter le thème cyber-sécurité existant

## 🆘 Support

Pour toute question ou problème :
- **Issues GitHub** : Signaler des bugs ou demander des fonctionnalités
- **Discussions** : Questions générales sur l'utilisation
- **Wiki** : Documentation détaillée des algorithmes

---

**CipherVault** - Votre arsenal cryptographique moderne 🔐⚡
#   c i p h e r v a u l t  
 