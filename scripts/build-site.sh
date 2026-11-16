#!/usr/bin/env bash
# Builds the static site into _site/ and injects contact values from the environment.
#
# Values come from (first wins): variables already set in the environment (CI uses
# GitHub repository variables), then config/.env for local builds.
#
#   WHATSAPP_NUMBER   required. International format, digits only (e.g. 595981344033)
#   WHATSAPP_DISPLAY  optional. How the number is shown; derived from the number if empty
#   CONTACT_EMAIL     optional. Until it is set, the pages show "[CORREO]"
#
# Local preview:  bash scripts/build-site.sh && python3 -m http.server -d _site 8000
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

if [[ -f config/.env ]]; then
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    if [[ -z "${!key:-}" ]]; then export "$key=$value"; fi
  done < config/.env
fi

WHATSAPP_NUMBER="${WHATSAPP_NUMBER:-}"
WHATSAPP_DISPLAY="${WHATSAPP_DISPLAY:-}"
CONTACT_EMAIL="${CONTACT_EMAIL:-}"

if [[ ! "$WHATSAPP_NUMBER" =~ ^[0-9]{8,15}$ ]]; then
  echo "WHATSAPP_NUMBER must be digits only, in international format (got: '${WHATSAPP_NUMBER}')" >&2
  exit 1
fi
if [[ -z "$WHATSAPP_DISPLAY" ]]; then
  n="$WHATSAPP_NUMBER"
  WHATSAPP_DISPLAY="+${n:0:3} ${n:3:3} ${n:6:3} ${n:9}"
fi
if [[ ! "$WHATSAPP_DISPLAY" =~ ^[+0-9\ \(\)-]+$ ]]; then
  echo "WHATSAPP_DISPLAY may only contain digits, spaces, +, ( ) and -" >&2
  exit 1
fi
if [[ -n "$CONTACT_EMAIL" && ! "$CONTACT_EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
  echo "CONTACT_EMAIL is not a valid address" >&2
  exit 1
fi
CONTACT_EMAIL_LABEL="${CONTACT_EMAIL:-[CORREO]}"
export WHATSAPP_NUMBER WHATSAPP_DISPLAY CONTACT_EMAIL CONTACT_EMAIL_LABEL

rm -rf _site
mkdir -p _site
cp -R variations logos _site/
find _site/variations -type d -name screens -prune -exec rm -rf {} +
touch _site/.nojekyll
cat > _site/index.html <<'HTML'
<!doctype html><html lang="es-PY"><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=variations/">
<title>Log N Labs · Variaciones</title></head>
<body><a href="variations/">Ver variaciones</a></body></html>
HTML

find _site -type f \( -name '*.html' -o -name '*.js' \) -print0 | xargs -0 perl -pi -e '
  s/%%WHATSAPP_NUMBER%%/$ENV{WHATSAPP_NUMBER}/g;
  s/%%WHATSAPP_DISPLAY%%/$ENV{WHATSAPP_DISPLAY}/g;
  s/%%CONTACT_EMAIL_LABEL%%/$ENV{CONTACT_EMAIL_LABEL}/g;
  s/%%CONTACT_EMAIL%%/$ENV{CONTACT_EMAIL}/g;
'

if grep -rlE '%%[A-Z_]+%%' _site >/dev/null; then
  echo "Unreplaced tokens left in:" >&2
  grep -rlE '%%[A-Z_]+%%' _site >&2
  exit 1
fi
echo "Built _site/ (WhatsApp ${WHATSAPP_DISPLAY}, email ${CONTACT_EMAIL_LABEL})"
