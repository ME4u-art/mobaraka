# Travel CMS — installation WordPress

Ce guide explique comment brancher n'importe quel WordPress (LocalWP en local,
ou un hébergement classique) comme back-office headless pour le site de
l'agence de voyage.

## 1. Installer "Secure Custom Fields"

Dans wp-admin : **Extensions → Ajouter**, cherchez **Secure Custom Fields**
(le plugin gratuit officiel qui a remplacé ACF Free), installez et activez-le.
(ACF classique fonctionne aussi si déjà installé.)

## 2. Installer le plugin `travel-cms.php`

Deux options :

**Option A — mu-plugin (recommandé, toujours actif) :**

- Copiez `docs/wordpress/travel-cms.php` dans `wp-content/mu-plugins/`.
- Si le dossier `mu-plugins` n'existe pas, créez-le.
- Rien à activer, WordPress le charge automatiquement.

**Option B — plugin classique :**

- Créez un dossier `wp-content/plugins/travel-cms/` et placez-y le fichier
  (renommez-le éventuellement `travel-cms.php`).
- Dans wp-admin : **Extensions**, activez "Travel CMS — Programmes".

## 3. Vérifier l'admin

- Un menu **Programmes** (icône palmier) doit apparaître dans le menu latéral
  de wp-admin.
- Créez un programme de test : **Programmes → Ajouter un programme**.
- Remplissez le titre, les champs (type, sous-titre, durée, prix,
  itinéraire, etc.).
- Ajoutez une **image mise en avant** (colonne de droite).
- Cliquez sur **Publier**.

## 4. Vérifier l'API REST

Ouvrez dans un navigateur :

```
{site}/wp-json/wp/v2/programmes?_embed&acf_format=standard
```

Exemple : `http://travel-cms.local/wp-json/wp/v2/programmes?_embed&acf_format=standard`

Vous devez voir un tableau JSON contenant votre programme, avec :

- un objet `"acf": { ... }` contenant tous les champs remplis,
- `_embedded["wp:featuredmedia"]` contenant l'URL de l'image mise en avant.

Si l'objet `acf` est absent ou vide, vérifiez que Secure Custom
Fields/ACF est bien actif et que le plugin `travel-cms.php` est bien chargé.

## 5. Brancher le site headless

Dans `src/config/agency.ts`, indiquez la source WordPress :

```ts
data: {
  source: "wordpress",
  url: "http://travel-cms.local",
},
```

Le front lira désormais les voyages/circuits depuis WordPress. Les
programmes Omra restent servis depuis les données locales (v1).

## 6. Notes pour un hébergement mutualisé

- Réglez les permaliens sur **"Nom de l'article"** :
  **Réglages → Permaliens**, sinon `/wp-json/...` ne fonctionne pas.
- Vérifiez que l'hébergeur n'empêche pas l'accès à `/wp-json` (certains
  hébergements gratuits comme InfinityFree bloquent l'API REST — à
  éviter pour ce projet).
- Utilisez de préférence HTTPS pour l'URL renseignée dans `agency.ts`.
