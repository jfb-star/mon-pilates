# Migration Bsport → V2 — Guide opérationnel

## Vue d'ensemble

Cette migration importe les comptes clients + leurs cartes de cours actives
depuis Bsport vers la base V2. Elle est **idempotente** : on peut la relancer
plusieurs fois sans créer de doublons (clé : `bsportId` + email fallback).

**Une seule CLI sert à 2 usages** :
- **Aujourd'hui (sans clé API)** : `--source=fixture` ingère 280 fakes pour tester le site avec un volume réaliste
- **Le jour J** : `--source=api` ingère les vrais comptes Bsport
- **`--reset`** : vide toutes les données Bsport-importées avant de re-créer (clean slate, utilisable dans les 2 modes)

Architecture en 4 outils :

1. **Générateur de fixtures** (`scripts/generate-bsport-fixtures.ts`) — produit 280 fakes Bsport-shaped pour tester
2. **CLI d'import** (`scripts/import-bsport.ts`) — ingère fixture / API / CSV → DB V2
3. **Seeder de bookings fakes** (`scripts/seed-fake-bookings.ts`) — distribue des résa aléatoires sur les sessions V2 (consomme les crédits cartes)
4. **Webhook receiver** (`/api/webhooks/bsport`) — capte les nouvelles activités Bsport en temps réel (pour la phase de cutover)

Plus une **admin UI** (`/admin/migration`) qui montre les batches + webhooks reçus.

## 🧪 Workflow TEST (sans clé API Bsport)

Pour peupler ta DB en local avec 280 utilisateurs réalistes pour tester ton site :

```bash
cd v2

# 1. Générer 280 fausses fiches clients réalistes (noms FR, mix de cartes)
npx tsx scripts/generate-bsport-fixtures.ts

# 2. Importer ces fixtures (ils deviennent de vrais users V2 avec needsActivation=true)
npx tsx scripts/import-bsport.ts --source=fixture

# 3. Distribuer des bookings aléatoires sur les sessions des 4 prochaines semaines
npx tsx scripts/seed-fake-bookings.ts --max=4 --past-weeks=4 --future-weeks=4

# 4. Tester le site
# - /admin/migration : voir les counts
# - /admin : voir les 280 users + bookings + cartes
# - /planning : voir les sessions remplies
# - /compte : se connecter (impossible — needsActivation, mais admin peut consulter)
```

Pour repartir de zéro :
```bash
# Relance avec --reset : wipe les Bsport-imported puis re-crée
npx tsx scripts/import-bsport.ts --source=fixture --reset
npx tsx scripts/seed-fake-bookings.ts --reset
```

## 🚀 Workflow PROD (3 phases)

### Phase A — Bulk import (jour de l'import)

Quand t'as la clé API Bsport :

```bash
# .env.local doit avoir : BSPORT_API_KEY, BSPORT_CLIENT_ID, BSPORT_COMPANY_ID, BSPORT_WEBHOOK_SECRET

# Wipe les éventuels fakes + import des vrais comptes Bsport
npx tsx scripts/import-bsport.ts --source=api --reset
```

Tu obtiens : tous tes comptes Bsport en V2 + leurs cartes avec crédits restants.
Aucun email envoyé à ce stade — les comptes existent en V2 mais les users
n'ont pas encore de mot de passe (`needsActivation=true`).

### Phase B — Période hybride (semaines/mois)

Configure le webhook côté Bsport admin → **Settings → Webhook** → URL :
```
https://mon-pilates.bzh/api/webhooks/bsport?secret=<BSPORT_WEBHOOK_SECRET>
```

À partir de là, V2 mirrore en temps réel :

| Événement Bsport | Action V2 |
|---|---|
| `member-create` / `member-update` | Crée ou met à jour le `User` |
| `booking-create` / `booking-update` | Crée le `Booking` (si la `Session` existe) |
| `booking-delete` | Marque le `Booking` comme `CANCELLED` |
| `invoice-create` / `invoice-update` | Crée un `Payment` + une `CourseCard` si line_item référence un pass |

Va voir `/admin/migration` pour suivre l'état des webhooks reçus.

### Phase C — Cutover final (le jour où tu dis "stop Bsport")

```bash
# Re-importer une dernière fois pour synchroniser tout reliquat
npx tsx scripts/import-bsport.ts --source=api

# Envoi des emails d'activation à TOUS les comptes Bsport-imported pas encore activés
npx tsx scripts/import-bsport.ts --source=api --send-emails
```

Puis dans Bsport admin → Settings → Webhook → tu retires l'URL.

✅ V2 tourne maintenant en autonomie totale :
- Les clients reçoivent l'email d'activation
- Ils cliquent le lien → set un mot de passe
- Ils peuvent se logger, voir leur carte (avec les bons crédits restants), réserver
- Stripe gère les nouveaux paiements
- Les emails de confirm/rappel/annulation partent en automatique
- Bsport peut être éteint (ou laissé en lecture seule pour archive comptable)

---

## Prérequis (à faire AVANT tout)

### 1. Pousser le schéma Prisma à jour

Le schéma a 4 nouveaux champs `bsportId` (User/Booking/CourseCard/Payment) +
2 nouvelles tables (MigrationBatch, BsportWebhookEvent).

```bash
cd v2
npx prisma db push --accept-data-loss
```

`--accept-data-loss` est nécessaire car Prisma est conservateur, mais les
modifications sont **non-destructives** (colonnes nullable + nouvelles tables).

### 2. Obtenir tes données Bsport — 2 voies

#### Voie A — Clé API Bsport (la plus propre)

Mail à `support@bsport.io` : « Demande d'accès au programme Early Release du Public API ».
Délai de réponse : 1-7 jours. Récupère dans le mail :
- `BSPORT_API_KEY`

Et depuis ton dashboard Bsport :
- `BSPORT_CLIENT_ID` (slug du studio, ex: `mon-pilates`)
- `BSPORT_COMPANY_ID` (id numérique)

Stocke dans `v2/.env.local` :

```
BSPORT_API_KEY=...
BSPORT_CLIENT_ID=mon-pilates
BSPORT_COMPANY_ID=12345
BSPORT_WEBHOOK_SECRET=$(openssl rand -hex 32)
```

#### Voie B — Scraper l'admin avec ton login (pas besoin de clé API !)

Si Bsport tarde à te donner la clé, le script `scripts/scrape-bsport.ts`
ouvre un navigateur visible, **tu te logges manuellement** (avec ton mot
de passe + 2FA si tu en as), puis le script aspire toutes tes données via
l'API interne que l'admin Bsport utilise. Ton mot de passe ne quitte
jamais ta machine — il est tapé directement dans le formulaire Bsport.

```bash
npx tsx scripts/scrape-bsport.ts
```

Le script t'explique étape par étape :
1. Une fenêtre Chrome s'ouvre sur app.bsport.io
2. Tu te logges (email + password + 2FA si tu en as)
3. Tu navigues : **Members** → scroll pour charger tous → **Bookings** → **Passes**
4. Tu reviens dans le terminal, tu appuies ENTER
5. Le script écrit `scripts/bsport-fixtures/clients.json` etc. en parsant ce qu'il a vu passer

Ensuite tu importes :
```bash
npx tsx scripts/import-bsport.ts --source=fixture --reset
```

⚠️ Les fichiers `clients.json` / `client-passes.json` / `bookings.json` sont
**dans le `.gitignore`** — ils contiennent des données personnelles RGPD,
donc jamais commitées.

### 3. Configurer le webhook côté Bsport (optionnel — pour la sync continue)

Bsport admin → **Settings → Webhook** → URL :

```
https://mon-pilates.bzh/api/webhooks/bsport?secret=<même valeur que BSPORT_WEBHOOK_SECRET>
```

Bsport va envoyer `member-create`, `member-update`, `booking-create`,
`booking-update`, `booking-delete` à cette URL.

---

## Workflow recommandé (cutover hybride)

### J-7 : pre-flight

Tester que tout marche en local avec les fixtures :

```bash
# Vérifier que les fixtures parsent + le code tourne
npx tsx scripts/import-bsport.ts --source=fixture --dry-run

# Si OK, importer les fixtures dans la DB locale (pour valider le pipeline complet)
npx tsx scripts/import-bsport.ts --source=fixture
```

Tu devrais voir :
```
[clients] processing 5 records…
  → 5 created, 0 updated, 0 errored
[cards] processing 4 records…
  → 4 created, 0 updated, 0 skipped, 0 errored
```

### J-1 : dry-run prod depuis l'API

```bash
# .env.local doit avoir BSPORT_API_KEY etc.
npx tsx scripts/import-bsport.ts --source=api --dry-run
```

Tu vois ce qui SERAIT importé sans rien écrire. Vérifie le rapport JSON
`./migration-report-*.json`.

### J : cutover

```bash
# 1. Import réel sans envoyer d'emails
npx tsx scripts/import-bsport.ts --source=api

# 2. Vérifier dans /admin/migration que les counts sont OK
# 3. Activer les webhooks dans Bsport admin (filet de sécurité)
# 4. Envoyer le batch d'emails d'activation
npx tsx scripts/import-bsport.ts --source=api --send-emails
# (--send-emails est idempotent : un user qui a déjà reçu son email ne reçoit pas un 2ème)
```

### J+1 à J+14 : période de transition

- Bsport reste accessible pour les clients qui n'ont pas vu l'email
- Toute nouvelle réservation Bsport arrive en webhook → mirrorée en V2
- Surveiller `/admin/migration` pour les erreurs de webhook

### J+30 : fin

- Désactiver les webhooks dans Bsport
- Ne plus utiliser l'admin Bsport
- Laisser le compte Bsport actif 6 mois en lecture seule pour archive comptable

---

## Flags du CLI

```
--source=fixture|api|csv     (default: fixture)
--dir=path                   (where fixtures/CSV live; default ./scripts/bsport-fixtures)
--dry-run                    (no DB writes; print what would change)
--only=clients,cards,bookings (subset; default: clients,cards)
--with-bookings              (shorthand to add bookings to default --only)
--send-emails                (send activation emails — default OFF for safety)
--batch-id=xxx               (override; default: auto-generated)
--limit=N                    (stop after N records per resource — for testing)
```

## Fixtures

`scripts/bsport-fixtures/` contient des données de test représentatives :
- 5 clients (4 actifs + 1 archivé)
- 3 templates de cartes (5/10/20 cours)
- 4 cartes clients (1 vide, 3 avec crédits restants)
- 5 bookings (passés, futurs, annulés)

Modifie ces fichiers pour reproduire des cas edge (caractères accentués,
emails dupliqués, etc.) et valider le comportement avant prod.

## Webhook testing en local

```bash
# Démarre le dev server
npm run dev

# Génère un webhook fake
curl -X POST 'http://localhost:3456/api/webhooks/bsport?secret=YOUR_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{
    "event_type": "member-create",
    "date": 1714748400,
    "data": {
      "member": {
        "id": 99999,
        "email": "test@example.com",
        "firstname": "Test",
        "lastname": "User"
      }
    }
  }'
```

Vérifie dans `/admin/migration` que l'event apparaît avec status `PROCESSED`.

## Limitations connues

1. **Bookings** : import des réservations historiques nécessite la
   reconstruction des `Session` côté V2 (tricky, dépend du `Schedule`
   correspondant). Pour l'instant, l'import est **désactivé** pour les
   bookings (cf. `importBookings` dans `import-bsport.ts`). Les nouveaux
   bookings post-cutover passent par les webhooks.

2. **CSV import** : pas implémenté tant qu'on n'a pas un exemple d'export
   CSV Bsport. Si tu reçois un ZIP de CSV de leur support, ajoute le parser
   dans `loadFromCsv()`.

3. **Webhook signature** : Bsport ne documente pas de HMAC. On utilise un
   secret partagé en query param. Si Bsport ajoute un header de signature
   plus tard, ajouter la vérification dans `verifySecret()`.

4. **Mots de passe** : impossibles à migrer (hash propriétaire Bsport). Tous
   les utilisateurs importés ont `needsActivation=true` et un placeholder
   hash inutilisable. Ils doivent passer par le flow reset-password (lien
   dans l'email d'activation).
