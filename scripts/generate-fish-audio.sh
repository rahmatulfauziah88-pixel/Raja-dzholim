#!/usr/bin/env bash
set -euo pipefail
: "${FISH_API_KEY:?Secret FISH_API_KEY belum tersedia di GitHub Actions.}"
mkdir -p public/audio
python - <<'PY'
from pathlib import Path
import json
text = Path("scripts/narration.txt").read_text(encoding="utf-8").strip()
Path("/tmp/fish-request.json").write_text(json.dumps({"text": text, "format": "mp3"}, ensure_ascii=False), encoding="utf-8")
PY
curl --fail --silent --show-error --retry 2 --retry-delay 3 \
  -X POST "https://api.fish.audio/v1/tts" \
  -H "Authorization: Bearer ${FISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "model: s2.1-pro-free" \
  --data-binary @/tmp/fish-request.json \
  --output /tmp/voice.mp3
test -s /tmp/voice.mp3
ffmpeg -y -i /tmp/voice.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -codec:a libmp3lame -b:a 192k public/audio/narration.mp3
test -s public/audio/narration.mp3
