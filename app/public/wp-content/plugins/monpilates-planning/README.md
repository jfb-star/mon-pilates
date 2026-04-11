# Mon Pilates - Planning Custom

Plugin WordPress pour afficher un planning des cours avec design premium, alimenté par l'API Bsport.

## Fonctionnalités

- Planning interactif avec navigation par jour (7 jours par défaut)
- Design premium "bord de mer" (bleu doux + rose accent)
- Filtres par établissement, activité, coach
- Responsive (mobile-first)
- Accessible (ARIA, focus visible, reduced motion)
- Performance optimisée (cache serveur, lazy loading)
- SEO-friendly (contenu fallback si JS désactivé)
- Redirection vers Bsport pour la réservation

## Installation

### 1. Copier le plugin

Le plugin est déjà installé dans :
```
wp-content/plugins/monpilates-planning/
```

### 2. Activer le plugin

1. Aller dans **Extensions > Extensions installées**
2. Trouver "Mon Pilates - Planning Custom"
3. Cliquer sur **Activer**

### 3. Configurer (optionnel)

1. Aller dans **Réglages > Mon Pilates Planning**
2. Vérifier/modifier les paramètres :
   - **Company ID** : 3023 (déjà configuré)
   - **Jours à afficher** : 7
   - **Durée du cache** : 300 secondes (5 min)
   - **URL de réservation** : URL vers Bsport
   - **Textes des boutons**

### 4. Ajouter à une page

Dans l'éditeur de la page "planning-des-cours-de-pilates-larmor-plage" :

```
[monpilates_planning]
```

#### Options du shortcode

```
[monpilates_planning days="14"]
```
Afficher 14 jours au lieu de 7.

```
[monpilates_planning establishment="10821"]
```
Filtrer par établissement (ID Bsport).

## Structure des fichiers

```
monpilates-planning/
├── monpilates-planning.php    # Plugin principal
│   ├── Shortcode [monpilates_planning]
│   ├── REST API proxy (/wp-json/monpilates/v1/)
│   └── Page admin (Réglages)
├── assets/
│   ├── css/
│   │   └── planning.css       # Styles premium
│   └── js/
│       └── planning.js        # Frontend interactif
└── README.md
```

## API Endpoints (Proxy)

Le plugin expose deux endpoints REST pour éviter les problèmes CORS :

### GET /wp-json/monpilates/v1/offers

Récupère les créneaux de cours.

**Paramètres :**
- `date_min` : Date de début (YYYY-MM-DD)
- `date_max` : Date de fin (YYYY-MM-DD)

**Réponse :**
```json
{
  "offers": [...],
  "count": 42,
  "generated_at": "2024-01-31T10:00:00+01:00"
}
```

### GET /wp-json/monpilates/v1/establishments

Récupère la liste des établissements.

**Réponse :**
```json
[
  {
    "id": 10821,
    "name": "TheSource",
    "address": "...",
    "city": "Larmor-Plage"
  }
]
```

## Personnalisation CSS

Le CSS utilise des variables CSS personnalisables :

```css
:root {
    --mp-primary: #5B8FA8;        /* Bleu principal */
    --mp-primary-light: #8CBFD4;  /* Bleu clair */
    --mp-accent: #D4A5A5;         /* Rose accent */
    --mp-accent-light: #E8C4C4;   /* Rose clair */
    /* ... voir planning.css pour toutes les variables */
}
```

Pour personnaliser, ajouter dans le fichier `custom-monpilates-style.css` :

```css
:root {
    --mp-primary: #votrebleu;
    --mp-accent: #votrerose;
}
```

## Données Bsport disponibles

Chaque créneau contient :

| Champ | Description |
|-------|-------------|
| `id` | ID unique du créneau |
| `activity_name` | Nom du cours |
| `date` | Date (YYYY-MM-DD) |
| `time` | Heure (HH:mm) |
| `duration` | Durée en minutes |
| `establishment_id` | ID du lieu |
| `coach_id` | ID du coach |
| `capacity` | Capacité max |
| `booked` | Places réservées |
| `spots_left` | Places restantes |
| `is_full` | Complet (boolean) |

## Établissements Mon Pilates

| ID | Nom | Description |
|----|-----|-------------|
| 10821 | TheSource | Espace santé et bien-être |
| 10822 | Villa les mouettes | Vue sur la mer |
| ? | Vitaform | Centre fitness |

## Dépannage

### Le planning ne s'affiche pas

1. Vérifier que le plugin est activé
2. Vérifier que le shortcode est bien présent sur la page
3. Activer le **Mode debug** dans les réglages (désactive le cache)
4. Tester les endpoints API : Réglages > Mon Pilates Planning > "Tester l'endpoint"

### Les données sont obsolètes

1. Aller dans Réglages > Mon Pilates Planning
2. Réduire la **Durée du cache** (minimum 60 secondes)
3. Ou activer le **Mode debug** temporairement

### Erreur CORS

Les appels à l'API Bsport passent par un proxy PHP côté serveur. Si vous voyez des erreurs CORS, vérifiez :
1. Que le plugin est bien activé
2. Que les permaliens WordPress sont configurés (Réglages > Permaliens > Enregistrer)

## Évolution future

- [ ] Affichage du nom des coachs (nécessite endpoint Bsport)
- [ ] Intégration booking direct (si API Bsport le permet)
- [ ] Mode "liste de la semaine" (vue alternative)
- [ ] Notifications de places disponibles

## Support

Plugin développé pour Mon Pilates - Larmor-Plage.

---

**Version** : 1.0.0
**Compatibilité** : WordPress 6.0+
**PHP** : 7.4+
