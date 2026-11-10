#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/audio
python -m pip install --quiet --upgrade edge-tts
edge-tts --voice id-ID-ArdiNeural --rate=-8% --pitch=-3Hz --text "$(cat scripts/narration.txt)" --write-media public/audio/voice.mp3
# Original low cinematic drone bed; no copyrighted music sample is used.
ffmpeg -y \
  -f lavfi -i "sine=frequency=55:duration=120" \
  -f lavfi -i "sine=frequency=82.41:duration=120" \
  -i public/audio/voice.mp3 \
  -filter_complex "[0:a]volume=0.035,afade=t=in:st=0:d=8,afade=t=out:st=108:d=12[a0];[1:a]volume=0.018,afade=t=in:st=0:d=10,afade=t=out:st=108:d=12[a1];[a0][a1]amix=inputs=2:duration=longest[bed];[2:a]volume=1.0[voice];[voice][bed]amix=inputs=2:duration=longest:dropout_transition=2[out]" \
  -map "[out]" -codec:a libmp3lame -b:a 192k public/audio/narration.mp3
rm public/audio/voice.mp3
