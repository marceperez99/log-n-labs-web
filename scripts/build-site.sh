#!/usr/bin/env bash
# Builds the static site into _site/ and injects contact values from the environment.
#
# Values come from (first wins): variables already set in the environment (CI uses
# GitHub repository variables), then config/.env for local builds.
#
#   WHATSAPP_NUMBER   required. International format, digits only (e.g. 595981344033)
#   WHATSAPP_DISPLAY  optional. How the number is shown; derived from the number if empty
#   CONTACT_EMAIL     optional. Until it is set, the pages show "[CORREO]"
#   GOOGLE_TAG_ID     optional. GTM container (GTM-XXXXXXX) or GA4 ID (G-XXXXXXXXXX); off when empty
#   SITE_URL          optional. Absolute origin for share links/images (default https://log-n-labs.pages.dev)
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
GOOGLE_TAG_ID="${GOOGLE_TAG_ID:-}"
SITE_URL="${SITE_URL:-https://log-n-labs.pages.dev}"
SITE_URL="${SITE_URL%/}"

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
if [[ -n "$GOOGLE_TAG_ID" && ! "$GOOGLE_TAG_ID" =~ ^(GTM|G)-[A-Z0-9]{4,20}$ ]]; then
  echo "GOOGLE_TAG_ID must look like GTM-XXXXXXX or G-XXXXXXXXXX" >&2
  exit 1
fi
if [[ ! "$SITE_URL" =~ ^https://[A-Za-z0-9.-]+$ ]]; then
  echo "SITE_URL must be an https origin with no path, like https://lognlabs.com.py" >&2
  exit 1
fi
CONTACT_EMAIL_LABEL="${CONTACT_EMAIL:-[CORREO]}"
export WHATSAPP_NUMBER WHATSAPP_DISPLAY CONTACT_EMAIL CONTACT_EMAIL_LABEL GOOGLE_TAG_ID SITE_URL

rm -rf _site
mkdir -p _site
cp -R src/. _site/
cp -R logos _site/

find _site -type f \( -name '*.html' -o -name '*.js' -o -name '*.txt' -o -name '*.xml' \) -print0 | xargs -0 perl -pi -e '
  s/%%WHATSAPP_NUMBER%%/$ENV{WHATSAPP_NUMBER}/g;
  s/%%WHATSAPP_DISPLAY%%/$ENV{WHATSAPP_DISPLAY}/g;
  s/%%CONTACT_EMAIL_LABEL%%/$ENV{CONTACT_EMAIL_LABEL}/g;
  s/%%CONTACT_EMAIL%%/$ENV{CONTACT_EMAIL}/g;
  s/%%GOOGLE_TAG_ID%%/$ENV{GOOGLE_TAG_ID}/g;
  s/%%SITE_URL%%/$ENV{SITE_URL}/g;
'

if grep -rlE '%%[A-Z_]+%%' _site >/dev/null; then
  echo "Unreplaced tokens left in:" >&2
  grep -rlE '%%[A-Z_]+%%' _site >&2
  exit 1
fi
echo "Built _site/ (WhatsApp ${WHATSAPP_DISPLAY}, email ${CONTACT_EMAIL_LABEL}, Google tag ${GOOGLE_TAG_ID:-off}, site ${SITE_URL})"
