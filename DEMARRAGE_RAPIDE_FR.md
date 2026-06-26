# Démarrage rapide — version CMS avec backend

Cette version remplace le portfolio statique. Elle ajoute un espace privé `/admin` pour modifier le contenu sans toucher au code.

## 1. Installer et lancer le projet

1. Installe Node.js 22 LTS.
2. Ouvre ce dossier dans VS Code.
3. Copie `.env.example` et renomme la copie en `.env.local`.
4. Termine la configuration Supabase décrite dans `docs/SUPABASE_SETUP.md`.
5. Dans le terminal VS Code :

```powershell
npm install
npm run dev
```

Ouvre ensuite :

```text
http://localhost:3000
```

L’espace de gestion est ici :

```text
http://localhost:3000/admin/login
```

## 2. Configurer Supabase une seule fois

Dans Supabase :

1. Crée un projet.
2. Mets les 4 clés dans `.env.local`.
3. Dans SQL Editor, exécute d’abord `supabase/schema.sql`, puis `supabase/seed.sql`.
4. Dans Authentication > Users, crée ton utilisateur administrateur avec un email et un mot de passe.
5. Ouvre `supabase/create-admin.sql`, remplace l’email si nécessaire, puis exécute-le dans SQL Editor.
6. Redémarre `npm run dev`.

## 3. Modifier le site ensuite

Connecte-toi à `/admin/login`. Tu peux modifier le profil, la photo, les projets, les expériences, les compétences, l’éducation, les CV et les messages reçus.

## Important

- Ne partage jamais `SUPABASE_SECRET_KEY`.
- Ne mets jamais cette clé dans une variable commençant par `NEXT_PUBLIC_`.
- La version CMS doit être déployée sur Vercel ou Netlify, pas comme un simple dossier `out` statique.
- Si `npm install` donne encore l’erreur npm précédente, réinstalle Node.js LTS puis redémarre VS Code avant de relancer la commande.
