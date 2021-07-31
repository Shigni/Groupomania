Projet 7 : Groupomania

Clonez le repository,
Créez un fichier ".env" dans le dossier backend,
dans le .env ajoutez les variables: HOST=localhost USER=utilisateur PASS=mot de passe DB=nom de la DB JWT=token jwt.

Faites "npm install" à la racine du dossier backend et du dossier groupomania.

importez la sauvegarde SQL, pour ajouter un administrateur il suffit de modifier un user déjà créé et de passer sa valeur admin à 1 (par défaut 0)

Dans un terminal, à la racine du dossier "groupomania" entrez "ng serve -o", et, à la racine du dossier "backend" entrez "nodemon server"