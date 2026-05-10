#!/bin/bash
# =============================================================================
# DEPLOY vers OVH — diff-based (git)
# Ne déploie QUE les fichiers modifiés depuis le dernier déploiement
#
# Usage:
#   ./deploy-to-ovh.sh              → déploie le diff git depuis le dernier deploy
#   ./deploy-to-ovh.sh --dry-run    → simulation, affiche les fichiers qui seraient envoyés
#   ./deploy-to-ovh.sh --full       → sync complète (premier déploiement ou reset)
# =============================================================================

set -e

REMOTE_HOST="ovh-monpilates"
REMOTE_PATH="www"
LOCAL_PATH="app/public"
LAST_DEPLOY_FILE=".last-deploy"
EXCLUDE_PATTERNS=(
    "wp-config.php"
    "wp-content/cache/"
    "wp-content/uploads/"
    "wp-content/ai1wm-backups/"
    "wp-content/upgrade/"
    "wp-content/upgrade-temp-backup/"
    ".htaccess"
    ".user.ini"
    "local-xdebuginfo.php"
    "llms.txt"
    "*.log"
    ".DS_Store"
)

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
BLUE='\033[0;34m';  CYAN='\033[0;36m';  NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

DRY_RUN=false; FULL=false
for arg in "$@"; do
    case $arg in --dry-run) DRY_RUN=true ;; --full) FULL=true ;; esac
done

echo -e "${BLUE}=== DEPLOY Local → OVH (git diff) ===${NC}"
[[ "$DRY_RUN" == true ]] && echo -e "${YELLOW}Mode DRY-RUN — aucun fichier ne sera modifié${NC}"
[[ "$FULL" == true ]]    && echo -e "${YELLOW}Mode FULL — sync complète${NC}"
echo ""

# Vérifier les fichiers non commités
if [[ -n "$(git status --porcelain -- "${LOCAL_PATH}/")" ]]; then
    echo -e "${YELLOW}Attention : fichiers non commités dans ${LOCAL_PATH}/ :${NC}"
    git status --short -- "${LOCAL_PATH}/"
    echo ""
    read -r -p "Seuls les fichiers commités seront déployés. Continuer ? (o/N) " confirm
    [[ ! "$confirm" =~ ^[oO]$ ]] && echo "Annulé." && exit 0
    echo ""
fi

CURRENT_COMMIT=$(git rev-parse HEAD)

# Vérifier SSH
echo -e "${YELLOW}Vérification SSH...${NC}"
if ! ssh -o ConnectTimeout=10 "${REMOTE_HOST}" "echo ok" 2>/dev/null; then
    echo -e "${RED}Impossible de se connecter à OVH.${NC}"
    echo "Ajoutez votre clé sur manager.ovh.com → Hébergement → FTP-SSH → Clés SSH :"
    cat ~/.ssh/jf_paragon.pub
    exit 1
fi
echo -e "${GREEN}Connexion OK${NC}"; echo ""

# ── MODE FULL ──────────────────────────────────────────────────────────────
if [[ "$FULL" == true ]]; then
    echo -e "${RED}Sync complète — tous les fichiers seront envoyés.${NC}"
    read -r -p "Tapez 'DEPLOY' pour confirmer : " confirm
    [[ "$confirm" != "DEPLOY" ]] && echo "Annulé." && exit 0

    RSYNC_EXCLUDES=()
    for p in "${EXCLUDE_PATTERNS[@]}"; do RSYNC_EXCLUDES+=("--exclude=${p}"); done

    DRY_FLAG=""; [[ "$DRY_RUN" == true ]] && DRY_FLAG="n"

    rsync -avz${DRY_FLAG} --progress -e "ssh" \
        "${RSYNC_EXCLUDES[@]}" \
        "${LOCAL_PATH}/" "${REMOTE_HOST}:~/${REMOTE_PATH}/"

    if [[ "$DRY_RUN" == false ]]; then
        echo "$CURRENT_COMMIT" > "$LAST_DEPLOY_FILE"
        echo -e "${GREEN}Hash sauvegardé dans ${LAST_DEPLOY_FILE}${NC}"
    fi
    echo -e "${GREEN}Terminé.${NC}"; exit 0
fi

# ── MODE DIFF (défaut) ────────────────────────────────────────────────────
if [[ ! -f "$LAST_DEPLOY_FILE" ]]; then
    echo -e "${RED}Erreur : pas de déploiement précédent (${LAST_DEPLOY_FILE} absent).${NC}"
    echo "Lancez d'abord : ./deploy-to-ovh.sh --full"
    exit 1
fi

LAST_COMMIT=$(cat "$LAST_DEPLOY_FILE")

if [[ "$LAST_COMMIT" == "$CURRENT_COMMIT" ]]; then
    echo -e "${GREEN}Rien à déployer — déjà à jour.${NC}"; exit 0
fi

echo "Dernier deploy : ${LAST_COMMIT:0:8}"
echo "HEAD actuel    : ${CURRENT_COMMIT:0:8}"; echo ""

CHANGED_FILES=$(git diff --name-only --diff-filter=ACMRT "${LAST_COMMIT}" "${CURRENT_COMMIT}" -- "${LOCAL_PATH}/" \
    | sed "s|^${LOCAL_PATH}/||")
DELETED_FILES=$(git diff --name-only --diff-filter=D "${LAST_COMMIT}" "${CURRENT_COMMIT}" -- "${LOCAL_PATH}/" \
    | sed "s|^${LOCAL_PATH}/||")

is_excluded() {
    local file="$1"
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        [[ "$file" == "$pattern" || "$file" == ${pattern%/}/* || "$file" == *"$pattern" ]] && return 0
    done
    return 1
}

FILTERED_CHANGED=()
while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    is_excluded "$f" || FILTERED_CHANGED+=("$f")
done <<< "$CHANGED_FILES"

FILTERED_DELETED=()
while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    is_excluded "$f" || FILTERED_DELETED+=("$f")
done <<< "$DELETED_FILES"

TOTAL=$(( ${#FILTERED_CHANGED[@]} + ${#FILTERED_DELETED[@]} ))

if [[ $TOTAL -eq 0 ]]; then
    echo -e "${GREEN}Aucun fichier à déployer.${NC}"; exit 0
fi

echo -e "${CYAN}Fichiers à envoyer (${#FILTERED_CHANGED[@]}) :${NC}"
for f in "${FILTERED_CHANGED[@]}"; do echo "  + $f"; done

if [[ ${#FILTERED_DELETED[@]} -gt 0 ]]; then
    echo ""; echo -e "${RED}Fichiers à supprimer sur OVH (${#FILTERED_DELETED[@]}) :${NC}"
    for f in "${FILTERED_DELETED[@]}"; do echo "  - $f"; done
fi
echo ""

if [[ "$DRY_RUN" == true ]]; then
    echo -e "${YELLOW}DRY-RUN terminé. Relancez sans --dry-run pour déployer réellement.${NC}"; exit 0
fi

read -r -p "Déployer ces ${TOTAL} fichier(s) ? (o/N) " confirm
[[ ! "$confirm" =~ ^[oO]$ ]] && echo "Annulé." && exit 0
echo ""

# Envoyer les fichiers modifiés
if [[ ${#FILTERED_CHANGED[@]} -gt 0 ]]; then
    TMPFILE=$(mktemp)
    printf '%s\n' "${FILTERED_CHANGED[@]}" > "$TMPFILE"

    rsync -avz --progress -e "ssh" \
        --files-from="$TMPFILE" \
        "${LOCAL_PATH}/" "${REMOTE_HOST}:~/${REMOTE_PATH}/"

    rm "$TMPFILE"
fi

# Supprimer les fichiers effacés
if [[ ${#FILTERED_DELETED[@]} -gt 0 ]]; then
    echo ""; echo -e "${YELLOW}Suppression sur OVH...${NC}"
    for f in "${FILTERED_DELETED[@]}"; do
        ssh "${REMOTE_HOST}" "rm -f ~/${REMOTE_PATH}/${f}" && echo "  supprimé : $f"
    done
fi

echo "$CURRENT_COMMIT" > "$LAST_DEPLOY_FILE"
echo ""
echo -e "${GREEN}Déploiement terminé ! (${TOTAL} fichier(s))${NC}"
echo "Commit déployé : ${CURRENT_COMMIT:0:8}"
