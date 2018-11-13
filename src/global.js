window.maze = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 8, 8, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [3, 3, 3, 3, 3, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 3],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 1, 9, 9, 1, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
window.music_config = {
    mute: false,
    volume: 0.8,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
},
window.pauseOff = true,
window.playMusic = true,
window.playSFX = true,
window.gameOver = true,
window.getExtraLife = true,
window.gameOverMusic = true,
window.pauseButtonGreen = null,
window.pauseButtonRed = null,
window.musicButtonGreen = null,
window.musicButtonRed = null,
window.sfxButtonGreen = null,
window.sfxButtonRed = null,
window.victoryMusic = null,
window.invincible = null,
window.player = null,
window.blobs = null,
window.skeletons = null,
window.rises = null,
window.gems = null,
window.cursors = null,
window.music = null,
window.timer = null,
window.invincibleTimer = null,
window.createSkeletons = null,
window.gameTimer = null,
window.lifeIcons = null,
window.pauseText = null,
window.pointsText = null,
window.highScores = [],
window.gameNumber = 1,
window.points = 0,
window.maxSkeletons = 4,
window.level = 1,
window.lives = 3,
window.riseTime = 4000,
window.skeletonSpeed = 60,
window.finalTime = 0,
window.custom = null,
window.customMax = null,
window.customRise = null,
window.customSpeed = null,
window.customShow = null;

document.addEventListener('DOMContentLoaded', () => {
    custom = document.getElementById('custom'),
    customMax = document.getElementById('maxSkeletons'),
    customRise = document.getElementById('riseTime'),
    customShow = document.getElementById('customShow'),
    customSpeed = document.getElementById('skeletonSpeed');
    custom.style.display = 'none';
    customShow.addEventListener('click', () => {
        if (custom.style.display === 'inline-block') {
            custom.style.display = 'none';
        } else {
            custom.style.display = 'inline-block';
        }
    });
});

window.componentToHex = function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

window.rgbToHex = function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

window.collectBlobs = function collectBlobs(player, blob) {
    blob.on('animationstart', function() {
        points += 10;
        pointsText.setText(points);
        if (playSFX) {
            this.sound.play('pop');
        }
    }, this);
    blob.anims.play('collect', true);
    blob.on('animationcomplete', function() {
        blob.disableBody(true, false);
        if (blobs.countActive(true) === 0) {
            if (victoryMusic && playSFX) {
                this.sound.play('victory');
                victoryMusic = false;
            }
        }
    }, this);
}

window.contactSkeletons = function contactSkeletons(player, skeleton) {
    if (playSFX) {
        this.sound.play('skeleton_death');
    }

    if (invincible) {
        points += 200;
        pointsText.setText(points);    
        skeleton.disableBody(true, true);
    } else {
        if (lives > 1) {
            skeletons.clear(true, true);
            lifeIcons.getLast(true).destroy();
            player.setX(320).setY(496);
            player.body.moves = false;
            player.alpha = 0;
            setTimeout(function() {
                player.body.moves = true;
                player.alpha = 1;
            }, 1000);
            lives--;
        } else {
            for (let blob of blobs.getChildren()) {
                if (blob.active) {
                    blob.anims.play('collect');
                }
            }

            if (gameOverMusic && playSFX) {
                this.sound.play('death');
                gameOverMusic = false;
            }
            
            let graphics = this.add.graphics();
            graphics.fillStyle(0x222222);
            graphics.lineStyle(4, 0x00FF2D);
            graphics.fillRoundedRect(200, 440, 240, 80, 32);
            graphics.strokeRoundedRect(200, 440, 240, 80, 32);

            this.add.text(320, 240, 'You Lost In', {fontSize: '40px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6}).setOrigin(0.5);
            this.add.text(320, 320, `${finalTime} Seconds`, {fontSize: '88px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 8}).setOrigin(0.5);
            this.add.text(320, 480, 'Game Over', { fontSize: '40px', padding: 10, fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6 })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerup', function() {
                highScores.push(points);
                document.getElementById('highScores').innerHTML += `<div class='highScore'>Game ${gameNumber}: Level ${level} - ${points} Points</div><div class='block'></div>`;
                gameNumber++;
                this.sound.stopAll();
                this.scene.start('StartScreen');
            }, this);

            gameOver = true;
        }
    }
}

// Collect gems in corners to turn invincible for setTimeout amount of time
window.collectGems = function collectGems(player, gem) {
    points += 50;
    pointsText.setText(points);
    if (playSFX) {
        this.sound.play('gem_on');
    }
    invincible = true;
    gem.disableBody(true, true);
    player.setTint(0xFF00FF);
    clearTimeout(invincibleTimer);
    invincibleTimer = setTimeout( () => {
        if (!gameOver && playSFX) {
            this.sound.play('gem_off');
        }
        player.clearTint();
        invincible = false;
    }, 6000);
}

// If tile next to sprite can be walked on the sprite will be aligned with it
window.turnLeft = function turnLeft(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (maze[j][i - 1] != 0) {
        player.y = (j * 32) + 16;
    }
}
window.turnRight = function turnRight(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (maze[j][i + 1] != 0) {
        player.y = (j * 32) + 16;
    }
}
window.turnUp = function turnUp(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (maze[j - 1][i] != 0) {
        player.x = (i * 32) + 16;
    };
}
window.turnDown = function turnDown(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (maze[j + 1][i] != 0) {
        player.x = (i * 32) + 16;
    }
}

// Finds the tile underneath and the tiles around the skeleton as well as getting the alignment coordinates
// Gives an id for the skeleton name to ensure the skeleton makes the decision to turn once and won't run again until a new intersection
window.findTiles = function findTiles(skeleton) {
    let i = Math.floor(skeleton.x/32);
    let j = Math.floor(skeleton.y/32);
    return [
        maze[j - 1][i], // [0] Tile UP
        maze[j][i + 1], // [1] Tile RIGHT
        maze[j + 1][i], // [2] Tile DOWN
        maze[j][i - 1], // [3] Tile LEFT
        ((i * 32) + 16), // [4] Align X
        ((j * 32) + 16), // [5] Align Y
        maze[j][i],     // [6] Current Tile
        i * j           // [7] Unique Tile Id
    ];
}