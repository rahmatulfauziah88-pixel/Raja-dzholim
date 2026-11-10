#!/usr/bin/env bash
set -euo pipefail

: "${FISH_API_KEY:?GitHub Secret FISH_API_KEY belum diatur. Tambahkan di Settings > Secrets and variables > Actions.}"

mkdir -p public/audio
python - <<'PY'
from pathlib import Path
import json
text = Path("scripts/narration.txt").read_text(encoding="utf-8").strip()
Path("scripts/fish-request.json").write_text(
    json.dumps({"text": text, "format": "mp3"}, ensure_ascii=False),
    encoding="utf-8"
)
PY

curl --fail --silent --show-error \
  --retry 2 --retry-delay 3 \
  -X POST "https://api.fish.audio/v1/tts" \
  -H "Authorization: Bearer ${FISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "model: s2.1-pro-free" \
  --data-binary @scripts/fish-request.json \
  --output public/audio/voice.mp3

test -s public/audio/voice.mp3
ffmpeg -y -i public/audio/voice.mp3 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -codec:a libmp3lame -b:a 192k \
  public/audio/narration.mp3
rm -f public/audio/voice.mp3 scripts/fish-request.json
