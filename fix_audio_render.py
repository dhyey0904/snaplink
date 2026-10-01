import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "<audio ref={audioRef} loop src={ambientAudio === 'rain' ? 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c6bb1c25.mp3' : ambientAudio === 'forest' ? 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_2267ff4693.mp3' : undefined} />",
    "{ambientAudio !== 'none' && <audio ref={audioRef} loop src={ambientAudio === 'rain' ? 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c6bb1c25.mp3' : 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_2267ff4693.mp3'} />}"
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
