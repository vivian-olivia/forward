// Lets EnvelopeIntro trigger MusicPlayer's playback from the same click
// gesture that opens the envelope, without wiring props through layout.
type PlayHandler = () => void;

let handler: PlayHandler | null = null;

export function setMusicPlayHandler(fn: PlayHandler | null) {
  handler = fn;
}

export function requestMusicPlay() {
  handler?.();
}
