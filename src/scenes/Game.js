class Game extends Phaser.Scene {
    
    constructor() {
        super('Game');
    }

    create() {
        this.scene.launch('HUDisplay');
        gameOver = false;
        invincible = false;
        victoryMusic = true;

        music.play();

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset', 'tiles');
        const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
        
        worldLayer.setCollisionBetween(1, 213, true, 'World');
        worldLayer.setCollisionBetween(215, 270, true, 'World');
        worldLayer.setCollisionBetween(272, 407, true, 'World');
        worldLayer.setCollisionBetween(409, 512, true, 'World');

        lifeIcons = this.add.group();
        
        if (lives > 1) {
            lifeIcons.create(320, 40, 'life');
        }
        if (lives > 2) {
            lifeIcons.create(320, 64, 'life');
        }
        if (lives > 3) {
            lifeIcons.create(320, 88, 'life');
        }
        
        blobs = this.physics.add.group();
        gems = this.physics.add.group();
        skeletons = this.physics.add.group();
        rises = this.physics.add.group();
        cursors = this.input.keyboard.createCursorKeys();
        
        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze.length; j++) {
                if ( (maze[i][j] === 1) || (maze[i][j] === 8) )  {
                    let col = Phaser.Display.Color.RandomRGB(0,255),
                    randomColor = `0x${rgbToHex(col.r, col.g, col.b)}`;
                    blobs.create((j * 32) + 16, (i * 32) + 16, 'blob_child').setTint(randomColor).setScale(0.75);
                }
                if (maze[i][j] === 2) {
                    gems.create((j * 32) + 16, (i * 32) + 16, 'gem').setScale(0.8);
                }
            }
        }
        let rise_sound = this.sound.add('rise', { volume: 3 });
        createSkeletons = setInterval(function() {
            if (skeletons.countActive(true) + rises.countActive(true) < maxSkeletons) {
                if (pauseOff) {
                    let rise = rises.create(320, 352, 'skeleton_rise');
                    if (invincible) {
                        rise.setTint(0x00DDFF);
                    }
                    rise.displayHeight = 32;
                    rise.displayWidth = 21.333333;
                    rise.anims.play('skeleton_rise');
                    if (playSFX) {
                        rise_sound.play();
                    }
                    rise.on('animationcomplete', function() {
                        rise.disableBody(true, true);
                        let skeleton = skeletons.create(320, 352, 'skeleton');
                        skeleton.displayHeight = 32;
                        skeleton.displayWidth = 21.333333;
                    });
                }
            }
        }, riseTime);
        
        let whatLevel = this.add.text(320, 320, `Level ${level}`, {fontSize: '88px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 8}).setOrigin(0.5),
        duration;

        riseTime < 2000 ? duration = 2000 : duration = riseTime;
        this.add.tween({
            targets: whatLevel,
            ease: 'Sine.easeInOut',
            duration: duration,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            }
        });

        player = this.physics.add.sprite(320, 496, 'blob');
        // player.setCircle(10);
        player.body.setCircle(16, 1, 1);

        this.physics.add.collider(player, worldLayer);
        this.physics.add.collider(skeletons, worldLayer);

        this.physics.add.overlap(player, blobs, collectBlobs, null, this);
        this.physics.add.overlap(player, gems, collectGems, null, this);
        this.physics.add.overlap(player, skeletons, contactSkeletons, null, this);
        
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: 0xffff00, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });

        gems.playAnimation('spin',true);
        // plays half blob_child animations then starts the other half when first half is halfway through the anims
        for (let [i, blob] of blobs.children.entries.entries()) {
            if (i % 2 == 1) {
                blob.anims.play('idle', true);
            } else {
                setTimeout( () => {
                    blob.anims.play('idle', true);
                }, 400);
            }
        }

        this.add.text(480, 16, `Level ${level}`, {fontSize: '24px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 4}).setOrigin(0.5);
        pointsText = this.add.text(160, 16, points, {fontSize: '24px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 4}).setOrigin(0.5);
        timer = this.add.text(320, 16, '0:00', {fontSize: '24px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 4}).setOrigin(0.5);

        let timer_sec = 1,
        timer_min = 0;
        gameTimer = setInterval(function gameTimer() {
            if (pauseOff) {
                if (timer_sec < 10) {
                    timer.setText(`${timer_min}:0${timer_sec}`);
                } else {
                    timer.setText(`${timer_min}:${timer_sec}`);
                }
                finalTime = (timer_min * 60) + timer_sec;
                timer_sec++;
                if (timer_sec === 60) {
                    timer_sec = 0;
                    timer_min++;
                }
            }
        }, 1000);

        game.events.on('blur', function() {
            if (!gameOver) {
                if (this.scene.isActive('Game')) {
                    this.scene.pause();
                    pauseOff = false;
                    pauseButtonRed.setAlpha(1);
                    pauseText.setText('Game Paused');
                }
            }
        }, this);
    }

    update() {
        if (gameOver) {
            music.stop();
            clearInterval(gameTimer);
            clearInterval(createSkeletons);
            this.physics.pause();
            skeletons.playAnimation('skeleton_turn');
            player.anims.play('turn');
            return;
        }

        if (getExtraLife) {
            if (points > 9999) {
                if (lifeIcons.getLength() === 2) {
                    lifeIcons.create(320, 88, 'life');
                } else if (lifeIcons.getLength() === 1) {
                    lifeIcons.create(320, 64, 'life');
                } else {
                    lifeIcons.create(320, 40, 'life');
                }
                lives++;
                getExtraLife = false;
            }
        }

        if (blobs.countActive(true) === 0) {
            console.log(finalTime);
            this.add.text(320, 240, 'You Collected All Blobs In', {fontSize: '40px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6}).setOrigin(0.5);
            this.add.text(320, 320, `${finalTime} Seconds`, {fontSize: '88px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 8}).setOrigin(0.5);

            let graphics = this.add.graphics();
            graphics.fillStyle(0x222222);
            graphics.lineStyle(4, 0x00FF2D);
            graphics.fillRoundedRect(200, 440, 240, 80, 32);
            graphics.strokeRoundedRect(200, 440, 240, 80, 32);

            this.add.text(320, 480, 'Next Level', { fontSize: '40px', padding: 10, fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6 })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerup', function() {
                level++;
                if (level % 2 === 1 && maxSkeletons < 50) {
                    maxSkeletons++;
                }
                if (skeletonSpeed < 120) {
                    skeletonSpeed += 2;
                }
                if (riseTime > 1200) {
                    riseTime -= 100;
                }
                this.sound.stopAll();
                this.scene.restart('StartScreen');
                gameOver = false;
            }, this);

            gameOver = true;
        }
        
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.setVelocityY(0);
            player.anims.play('left', true);
            turnLeft(player);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.setVelocityY(0);
            turnRight(player);
            player.anims.play('right', true);
        } else if (cursors.up.isDown) {
            player.setVelocityY(-160);
            player.setVelocityX(0);
            turnUp(player);
            player.anims.play('up', true);
        } else if (cursors.down.isDown) {
            player.setVelocityY(160);
            player.setVelocityX(0);
            turnDown(player);
            player.anims.play('up', true);
        } else {
            player.setVelocity(0);
            player.anims.play('turn');
        }

        if (player.x < 0) {
            if (playSFX) {
                this.sound.play('teleport');
            }
            player.setX(639).setY(336);
        } else if (player.x > 639) {
            if (playSFX) {
                this.sound.play('teleport');
            }
            player.setX(0).setY(336);
        }

        for (let skeleton of skeletons.getChildren()) {
            if ( (skeleton.body.velocity.x === 0) && (skeleton.body.velocity.y === 0) ) {
                setTimeout(function() {
                    skeleton.setVelocityY(-skeletonSpeed);
                }, 500);
            }

            if (invincible) {
                skeleton.setTint(0x00DDFF);
            } else {
                skeleton.clearTint();
            }

            if (skeleton.body.velocity.x < 0) {
                skeleton.anims.play('skeleton_left', true);
                skeleton.flipX = true;
            } else if (skeleton.body.velocity.x > 0) {
                skeleton.anims.play('skeleton_right', true);
                skeleton.flipX = false;
            } else if (skeleton.body.velocity.y > 0) {
                skeleton.anims.play('skeleton_down', true);
            } else if (skeleton.body.velocity.y < 0) {
                skeleton.anims.play('skeleton_up', true);
            } else {
                skeleton.anims.play('skeleton_turn');
            }

            if (skeleton.x < 0) {
                skeleton.setX(639).setY(336);
            } else if (skeleton.x > 639) {
                skeleton.setX(0).setY(336);
            }

            let tiles = findTiles(skeleton);
            if (tiles[6] != 0) {
                let rand_two = Phaser.Math.Between(1,2),
                rand_three = Phaser.Math.Between(1,3),
                rand_four = Phaser.Math.Between(1,4),
                skeletonTileX = Math.abs(tiles[4] - skeleton.x),
                skeletonTileY = Math.abs(tiles[5] - skeleton.y);

                // Skeleton chooses to go left or right after rising from the crypt
                if ( (tiles[6] === 8) && (skeleton.name === '') && (skeletonTileY < 2) ) {
                    if (rand_two === 1) {
                        skeleton.setVelocity(-skeletonSpeed, 0);
                    } else {
                        skeleton.setVelocity(skeletonSpeed, 0);
                    }
                    skeleton.name = tiles[7];
                }

                // Skeleton chooses a random direction at each intersection
                if ( (skeleton.name != tiles[7]) && (skeletonTileX < 4) && (skeletonTileY < 4) ) {
                    if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                        // 4 way intersection
                        if (rand_four === 1) {
                            skeleton.setVelocity(-skeletonSpeed, 0);
                        } else if (rand_four === 2) {
                            skeleton.setVelocity(skeletonSpeed, 0);
                        } else if (rand_four === 3) {
                            skeleton.setVelocity(0, -skeletonSpeed);
                        } else {
                            skeleton.setVelocity(0, skeletonSpeed);
                        }
                    } else if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] === 0) ) {
                        // 3 way Left is blocked
                        if (rand_three === 1) {
                            skeleton.setVelocity(skeletonSpeed, 0);
                        } else if (rand_three === 2) {
                            skeleton.setVelocity(0, -skeletonSpeed);
                        } else {
                            skeleton.setVelocity(0, skeletonSpeed);
                        }
                    } else if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] === 0) && (tiles[3] != 0) ) {
                        // 3 way Down is blocked
                        if (rand_three === 1) {
                            skeleton.setVelocity(-skeletonSpeed, 0);
                        } else if (rand_three === 2) {
                            skeleton.setVelocity(skeletonSpeed, 0);
                        } else {
                            skeleton.setVelocity(0, -skeletonSpeed);
                        }
                    } else if ( (tiles[0] != 0) && (tiles[1] === 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                        // 3 way Right is blocked
                        if (rand_three === 1) {
                            skeleton.setVelocity(-skeletonSpeed, 0);
                        } else if (rand_three === 2) {
                            skeleton.setVelocity(0, -skeletonSpeed);
                        } else {
                            skeleton.setVelocity(0, skeletonSpeed);
                        }
                    } else if ( (tiles[0] === 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                        // 3 way Up is blocked
                        if (rand_three === 1) {
                            skeleton.setVelocity(-skeletonSpeed, 0);
                        } else if (rand_three === 2) {
                            skeleton.setVelocity(skeletonSpeed, 0);
                        } else {
                            skeleton.setVelocity(0, skeletonSpeed);
                        }
                    } else if ( (tiles[0] === 0) && (tiles[1] === 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                        // 2 way Up & Right is blocked
                        if (rand_two === 1) {
                            skeleton.setVelocity(-skeletonSpeed, 0);
                        } else {
                            skeleton.setVelocity(0, skeletonSpeed);
                        }
                    } else if ( (tiles[0] != 0) && (tiles[1] === 0) && (tiles[2] === 0) && (tiles[3] != 0) ) {
                        // 2 way Right & Down is blocked
                        if (rand_two === 1) {
                            skeleton.setVelocity(-skeletonSpeed, 0);
                        } else {
                            skeleton.setVelocity(0, -skeletonSpeed);
                        }
                    } else if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] === 0) && (tiles[3] === 0) ) {
                        // 2 way Down & Left is blocked
                        if (rand_two === 1) {
                            skeleton.setVelocity(skeletonSpeed, 0);
                        } else {
                            skeleton.setVelocity(0, -skeletonSpeed);
                        }
                    } else if ( (tiles[0] === 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] === 0) ) {
                        // 2 way Left & Up is blocked
                        if (rand_two === 1) {
                            skeleton.setVelocity(skeletonSpeed, 0);
                        } else {
                            skeleton.setVelocity(0, skeletonSpeed);
                        }
                    }

                    if (skeleton.body.velocity.x != 0) {
                        skeleton.y = tiles[5];
                    } else if (skeleton.body.velocity.y != 0) {
                        skeleton.x = tiles[4];
                    } else {
                        skeleton.disableBody(true, true);
                        console.log("skeleton not moving // removed");
                    }

                    skeleton.name = tiles[7];
                }
            }
        }
    }
}

export default Game;