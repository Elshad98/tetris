import { SOUNDS } from './constants';

import '../sounds/drop.mp3';
import '../sounds/reset.mp3';
import '../sounds/clear.mp3';
import '../sounds/moves.mp3';
import '../sounds/pause.mp3';
import '../sounds/finish.mp3';

class Sound {

    constructor(parentNode) {
        this.parentNode = parentNode;
        this.soundTrack = {};

        for (const sound in SOUNDS) {
            const audio = this.create(SOUNDS[sound]);
            this.parentNode.append(audio);
            this.soundTrack[sound] = audio;
        }
    }

    isMuted() {
        return !!localStorage.getItem('muted');
    }

    muteToggle() {
        if (this.isMuted()) {
            localStorage.removeItem('muted');
        } else {
            localStorage.setItem('muted', 'muted');
        }

        const isMuted = this.isMuted();
        for (const sound in this.soundTrack) {
            this.soundTrack[sound].muted = isMuted;
        }
    }

    create(name) {
        const audio = document.createElement('audio');
        audio.preload = 'auto';
        audio.id = `audio-${name}`;
        audio.muted = this.isMuted();

        const source = document.createElement('source');
        source.src = `./sounds/${name}.mp3`;
        source.type = 'audio/mp3';

        audio.append(source);
        return audio;
    }

    clear() {
        this.soundTrack[SOUNDS.clear].play();
    }

    drop() {
        this.soundTrack[SOUNDS.drop].play();
    }

    finish() {
        this.soundTrack[SOUNDS.finish].play();
    }

    moves() {
        this.soundTrack[SOUNDS.moves].play();
    }

    pause() {
        this.soundTrack[SOUNDS.pause].play();
    }

    reset() {
        this.soundTrack[SOUNDS.reset].play();
    }
}

export default Sound;