class StartScreen extends Phaser.Scene {
    
    constructor() {
        super('StartScreen');
    }

    create() {
        points = 0;
        maxSkeletons = 4;
        level = 1;
        lives = 3;
        riseTime = 4000;
        skeletonSpeed = 60;
        getExtraLife = true;
        gameOverMusic = true;
        this.add.image(320, 320, 'background');

        pauseButtonGreen = this.add.image(560, 12, 'pause_off');

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

        this.add.sprite(176, 336, 'blob_child_color').play('idle_color').setScale(0.75);
        this.add.sprite(464, 336, 'blob_child_color').play('idle_color').setScale(0.75);

        let graphics = this.add.graphics();
        graphics.fillStyle(0x222222);
        graphics.lineStyle(4, 0x00FF2D);
        graphics.fillRoundedRect(240, 360, 160, 80, 32);
        graphics.strokeRoundedRect(240, 360, 160, 80, 32);
        graphics.fillRoundedRect(240, 460, 160, 80, 32);
        graphics.strokeRoundedRect(240, 460, 160, 80, 32);
        graphics.fillRoundedRect(10, 88, 620, 136, 32);
        graphics.strokeRoundedRect(10, 88, 620, 136, 32);

        this.add.text(320, 160, 'Blob Man', { fontSize: '140px', padding: 10, fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 10 }).setOrigin(0.5);
        this.add.text(320, 500, 'Start', { fontSize: '40px', padding: 10, fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6 })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerup', function() {
            this.sound.stopAll();
            this.scene.start('Game');
        }, this);

        this.add.text(320, 400, 'Custom', { fontSize: '40px', padding: 10, fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6 })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerup', function() {
            this.sound.stopAll();
            riseTime = parseFloat(customRise.value) * 1000;
            skeletonSpeed = parseInt(customSpeed.value);
            maxSkeletons = parseInt(customMax.value);
            if (riseTime < 500 || riseTime > 4000 || skeletonSpeed < 60 || skeletonSpeed > 120 || maxSkeletons < 4 || maxSkeletons > 60) {
                let fixText = this.add.text(320, 320, 'Fix Custom Attributes', { fontSize: '30px', padding: 10, fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6 }).setOrigin(0.5);
                this.add.tween({
                    targets: fixText,
                    ease: 'Sine.easeInOut',
                    duration: 3000,
                    alpha: {
                        getStart: () => 1,
                        getEnd: () => 0
                    }
                });
                riseTime = 4000;
                skeletonSpeed = 60;
                maxSkeletons = 4;
            } else {
                this.scene.start('Game');
            }
        }, this);
    }
}

export default StartScreen;