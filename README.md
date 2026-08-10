# Probishirt — PWA vitrine

## Ce que c'est

Un site statique (HTML/CSS/JS, sans framework, sans backend) qui
fonctionne comme une application installable (PWA). Pas de build,
pas de `npm install` requis : les fichiers se déploient tels quels.

## Avant de publier

Un seul fichier à modifier pour rendre le site opérationnel : **`js/products.js`**, tout en haut.

1. **Ton numéro WhatsApp**
   ```js
   const WHATSAPP_NUMBER = "22900000000";
   ```
   Remplace par ton numéro au format international, sans "+" ni espaces
   (ex. Bénin : `22997000000`).

2. **Tes prix**
   Chaque produit a un champ `price` dans le tableau `PRODUCTS` — les valeurs
   actuelles (15 000 / 18 000 FCFA) sont des exemples à ajuster.

3. **Tes textes produits**
   `name` et `quote` sont modifiables librement dans ce même tableau.

4. **Tes réseaux sociaux** (facultatif)
   ```js
   var SOCIAL_LINKS = {
     instagram: "https://instagram.com/tonpseudo",
     facebook: "",
     tiktok: ""
   };
   ```
   Laisse une valeur vide ("") pour que l'icône n'apparaisse pas dans le
   footer si tu n'as pas encore ce compte.

## Google Sheet (ajouter des produits sans toucher au code)

Une fois `sheet-config.json` rempli avec le lien CSV de ton Google
Sheet, le site (et le message WhatsApp) lit les produits depuis ce
Sheet à chaque visite — `js/products.js` ne sert alors que de secours
si le Sheet est vide ou injoignable.

Colonnes attendues sur la première ligne du Sheet, une ligne par
coloris (même `id` répété pour un produit à plusieurs coloris) :

```
id | name | quote | description | price | color | hex | image_url | badge | sizes
```

- `badge` (facultatif) : `nouveau`, `bestseller`, ou laisser vide
- `sizes` (facultatif) : tailles séparées par des virgules, ex.
  `S,M,L,XL` — laisser vide pour utiliser les tailles par défaut
  (S, M, L, XL, XXL)

## Déployer sur GitHub + Vercel

**1. Créer le dépôt GitHub**
```bash
cd probishirt
git init
git add .
git commit -m "Site vitrine Probishirt"
git branch -M main
git remote add origin https://github.com/<ton-compte>/probishirt.git
git push -u origin main
```
(Crée d'abord un dépôt vide sur github.com — sans README ni .gitignore —
puis utilise l'URL qu'il te donne pour la commande `remote add`.)

**2. Connecter Vercel**
- Va sur vercel.com → "Add New Project"
- Choisis le dépôt `probishirt` sur GitHub
- Framework Preset : **Other** (site statique, aucune config nécessaire)
- Build Command : *(laisser vide)*
- Output Directory : *(laisser vide — la racine du dépôt)*
- Clique sur "Deploy"

Vercel te donne une URL `.vercel.app` immédiatement. Ensuite, dans
Project Settings → Domains, ajoute `www.probishirt.com` et suis les
instructions DNS affichées (un enregistrement CNAME chez ton
fournisseur de domaine).

**3. Mettre à jour le site plus tard**
Chaque fois que tu modifies un fichier et fais :
```bash
git add .
git commit -m "Mise à jour"
git push
```
Vercel redéploie automatiquement en quelques secondes.

## Aperçu WhatsApp (comme une pub Facebook)

Le bouton "Commander" ajoute un lien vers
`/api/produit/<id-du-produit>` dans le message WhatsApp pré-rempli.
Cette page (générée automatiquement, dossier `api/`) contient les
balises Open Graph nécessaires pour que WhatsApp affiche l'image du
produit en aperçu — exactement comme un lien de pub Facebook. Le lien
reste visible en bas du message : c'est inévitable, WhatsApp ne peut
pas générer l'aperçu autrement.

⚠️ Ça ne fonctionne qu'une fois le site déployé sur un vrai domaine
(Vercel ou ton nom de domaine) — WhatsApp ne peut pas récupérer
l'aperçu sur `localhost`. Le fichier `api/products-data.json` doit
rester synchronisé avec `js/products.js` (mêmes id, mêmes images) —
si tu ajoutes un produit dans `js/products.js`, ajoute la même entrée
(id, name, quote, price, img) dans `api/products-data.json`.

```
index.html            → Accueil (hero + sélection de 3 produits)
collection.html        → Collection complète (les 6 produits)
produit.html            → Fiche produit dynamique (lit ?id=... dans l'URL)
apropos.html             → Histoire de la marque et valeurs
contact.html              → Coordonnées + FAQ

css/style.css           → tous les styles (couleurs, typographie, mise en page)
js/products.js           → configuration produits + numéro WhatsApp (LE fichier à modifier)
js/app.js                 → logique commune à toutes les pages (cartes produits, menu, etc.)
js/product-page.js         → logique propre à la fiche produit (produit.html)

manifest.json              → identité de l'app installable (PWA)
sw.js                        → mise en cache hors-ligne (version bumpée à chaque grosse mise à jour)
vercel.json                   → règles de cache pour Vercel
assets/brand/                  → logo, favicons, icônes d'app
assets/products/                 → visuels produits (optimisés pour le web)
```

Chaque produit sur la page Collection ou Accueil renvoie vers sa propre
fiche à l'adresse `produit.html?id=<id-du-produit>` (l'`id` est défini
dans `js/products.js`).

## Installer comme application (PWA)

Une fois le site en ligne en HTTPS (Vercel le fait automatiquement), un
visiteur peut :
- **Sur Android/Chrome** : menu → "Ajouter à l'écran d'accueil"
- **Sur iPhone/Safari** : bouton Partager → "Sur l'écran d'accueil"

Le site s'installe alors comme une vraie application, avec icône et
fonctionnement hors-ligne pour les pages déjà visitées.

## Ajouter un nouveau produit

Dans `js/products.js`, duplique un bloc du tableau `PRODUCTS` et ajuste
`id`, `name`, `quote`, `description`, `price` et `variants` (une entrée
par coloris, avec le chemin de l'image dans `assets/products/`). Le
produit apparaîtra automatiquement sur la page Collection, et sa fiche
sera accessible sur `produit.html?id=<id-choisi>`.
