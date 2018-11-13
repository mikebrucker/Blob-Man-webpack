class HUDisplay extends Phaser.Scene {
    
    constructor() {
        super('HUDisplay');
    }

    create() {
        pauseText = this.add.text(320, 320, '', {fontSize: '88px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 8}).setOrigin(0.5),
        pauseButtonGreen = this.add.image(560, 12, 'pause_off').setInteractive()
        .on('pointerup', function() {
            if (!gameOver) {
                this.scene.pause('Game');
                pauseButtonRed.setAlpha(1);
                pauseOff = false;
                pauseText.setText('Game Paused');
            }
        }, this);
        pauseButtonRed = this.add.image(560, 12, 'pause_on').setInteractive()
        .on('pointerup', function() {
            if (!gameOver) {
                this.scene.resume('Game');
                pauseButtonRed.setAlpha(0);
                pauseOff = true;
                pauseText.setText('');
            }
        }, this).setAlpha(0);
        musicButtonGreen = this.add.image(592, 12, 'music_on').setInteractive()
        .on('pointerup', function() {
            music.setMute(playMusic);
            musicButtonRed.setAlpha(1);
            playMusic = !playMusic;
        }, this);
        musicButtonRed = this.add.image(592, 12, 'music_off').setInteractive()
        .on('pointerup', function() {
            music.setMute(playMusic);
            musicButtonRed.setAlpha(0);
            playMusic = !playMusic;
        }, this);
        sfxButtonGreen = this.add.image(624, 12, 'sfx_on').setInteractive()
        .on('pointerup', function() {
            if (playSFX) {
                this.sound.pauseAll();
                music.resume();
            }
            sfxButtonRed.setAlpha(1);
            playSFX = !playSFX;
        }, this);
        sfxButtonRed = this.add.image(624, 12, 'sfx_off').setInteractive()
        .on('pointerup', function() {
            if (playSFX) {
                this.sound.pauseAll();
                music.resume();
            }
            sfxButtonRed.setAlpha(0);
            playSFX = !playSFX;
        }, this);
        
        if (playSFX) {
            sfxButtonRed.setAlpha(0);
        }
        if (playMusic) {
            musicButtonRed.setAlpha(0);
        }
    }
}

export default HUDisplay;