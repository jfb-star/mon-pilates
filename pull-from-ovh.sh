#!/bin/bash
# =============================================================================
# PULL depuis OVH → Local
# Récupère les sources de production vers le dossier local
# Usage: ./pull-from-ovh.sh [--with-uploads]
# =============================================================================

set -e

# --- Configuration ---
REMOTE_HOST="ovh-monpilates"
REMOTE_PATH="www"          # Chemin relatif depuis ~ sur OVH (ajuster si nécessaire)
LOCAL_PATH="app/public"    # Chemin local relatif à la racine du projet

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Aller à la racine du projet
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${GREEN}=== PULL OVH → Local ===${NC}"
echo "Remote : ${REMOTE_HOST}:~/${REMOTE_PATH}/"
echo "Local  : ${LOCAL_PATH}/"
echo ""

# Vérifier la connexion SSH
echo -e "${YELLOW}Vérification de la connexion SSH...${NC}"
if ! ssh -o ConnectTimeout=10 "${REMOTE_HOST}" "echo ok" 2>/dev/null; then
    echo -e "${RED}Erreur : Impossible de se connecter à OVH.${NC}"
    exit 1
fi
echo -e "${GREEN}Connexion OK${NC}"
echo ""

# Détecter le chemin distant si besoin
echo -e "${YELLOW}Détection du chemin distant...${NC}"
REMOTE_FULL_PATH=$(ssh "${REMOTE_HOST}" "
    if [ -d ~/www ]; then echo 'www'
    elif [ -d ~/public_html ]; then echo 'public_html'
    else ls ~ | head -5; fi
")
echo "Chemin détecté : ~/${REMOTE_FULL_PATH}"
echo ""

# Confirmation
echo -e "${YELLOW}⚠️  Cette opération va ÉCRASER vos fichiers locaux avec la version OVH.${NC}"
read -r -p "Continuer ? (o/N) " confirm
if [[ ! "$confirm" =~ ^[oO]$ ]]; then
    echo "Annulé."
    exit 0
fi

WITH_UPLOADS=false
if [[ "$1" == "--with-uploads" ]]; then
    WITH_UPLOADS=true
    echo "Mode : avec uploads"
else
    echo -e "${YELLOW}Note : Les uploads sont exclus. Utilisez --with-uploads pour les inclure.${NC}"
fi

# Exclusions tar (côté serveur OVH)
TAR_EXCLUDES=(
    "--exclude=./wp-config.php"
    "--exclude=./wp-content/cache"
    "--exclude=./wp-content/ai1wm-backups"
    "--exclude=./wp-content/upgrade"
    "--exclude=./wp-content/upgrade-temp-backup"
    "--exclude=./.htaccess"
    "--exclude=./.user.ini"
    "--exclude=./local-xdebuginfo.php"
    "--exclude=./llms.txt"
    "--exclude=./*.log"
    "--exclude=./.DS_Store"
    "--exclude=./index.html.ovh.old"
)
if [[ "$WITH_UPLOADS" == false ]]; then
    TAR_EXCLUDES+=("--exclude=./wp-content/uploads")
fi

echo ""
echo -e "${GREEN}Transfert en cours (tar over SSH)...${NC}"

ssh "${REMOTE_HOST}" "cd ~/${REMOTE_FULL_PATH} && tar czf - ${TAR_EXCLUDES[*]} ." \
    | tar xzf - -C "${LOCAL_PATH}/"

echo ""
echo -e "${GREEN}✅ Pull terminé !${NC}"
echo ""
echo "💡 Pensez à :"
echo "   - Vérifier wp-config.php local (DB locale : root/root)"
echo "   - Importer la base de données depuis OVH si nécessaire"
