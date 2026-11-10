#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/audio
python -m pip install --quiet edge-tts
edge-tts --voice id-ID-ArdiNeural --rate=-8% --pitch=-3Hz --text "$(cat scripts/narration.txt)" --write-media public/audio/narration.mp3
