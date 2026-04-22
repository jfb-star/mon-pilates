# Prisma Migrations — Mon Pilates v2

Baseline: `0000_init` représente le schéma tel que déployé historiquement
via `prisma db push`.

## État actuel

Le build Vercel continue d'utiliser `prisma db push --accept-data-loss`
(script `build`). La baseline migration est **prête mais pas activée**.

## Activation (à faire par JFB quand il sera prêt)

**Étape 1** — marquer la baseline comme appliquée contre Neon prod. À lancer
UNE SEULE FOIS depuis ta machine locale avec `DATABASE_URL` pointant vers
Neon prod :

```bash
cd v2
npx prisma migrate resolve --applied 0000_init
```

**Étape 2** — basculer le script `build` dans `package.json` :

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

(le script `build:migrate` contient déjà cette commande prête à l'emploi).

**Étape 3** — redéployer sur Vercel. `migrate deploy` ne fera rien de neuf
puisque la baseline est marquée "applied" ; les futures migrations
(`prisma migrate dev --name <x>`) s'appliqueront automatiquement.

## Workflow futur (post-activation)

- Changement de schéma en local : `npx prisma migrate dev --name <description>`
- Commit du dossier `prisma/migrations/<timestamp>_<description>/`
- Au prochain build Vercel, `prisma migrate deploy` applique la migration.

## Backup / rollback

Le script `npm run db:push` reste disponible pour forcer un sync direct en cas
d'urgence (pas de `--accept-data-loss`, à utiliser consciemment).
