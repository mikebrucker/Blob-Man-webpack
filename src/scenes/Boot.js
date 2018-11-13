import game_track from '../assets/audio/game_track.mp3';
import blob_death from '../assets/images/blob_death_grayscale.png';
import blob_child from '../assets/images/blob_child_grayscale.png';
import blob_child_color from '../assets/images/blob_child.png';
import blob from '../assets/images/blob_up_down_yellow.png';
import blob_left from '../assets/images/blob_walk_left_yellow.png';
import blob_right from '../assets/images/blob_walk_right_yellow.png';
import gem from '../assets/images/gem.png';
import skeleton from '../assets/images/skeleton_sprite_sheet.png';
import skeleton_rise from '../assets/images/skeleton_rise.png';
import tiles from '../assets/images/tileset.png';
import background from '../assets/images/blobmap.png';
import life from '../assets/images/life.png';
import music_on from '../assets/images/music_on.png';
import music_off from '../assets/images/music_off.png';
import pause_on from '../assets/images/pause_on.png';
import pause_off from '../assets/images/pause_off.png';
import sfx_on from '../assets/images/sfx_on.png';
import sfx_off from '../assets/images/sfx_off.png';
import map from '../assets/images/blobmap.json';
import victory from '../assets/audio/victory.wav';
import death from '../assets/audio/death.wav';
import pop from '../assets/audio/pop.wav';
import gem_on from '../assets/audio/gem_on.wav';
import gem_off from '../assets/audio/gem_off.wav';
import teleport from '../assets/audio/teleport.wav';
import rise from '../assets/audio/rise.wav';
import skeleton_death from '../assets/audio/skeleton_death.wav';

class Boot extends Phaser.Scene {
    
    constructor() {
        super({ key: 'Boot', active: true });
    }

    preload() {
        let progressBox = this.add.graphics(),
        progressBar = this.add.graphics(),
        loadText = this.add.text(320, 320, 'Loading... 0%', { fontSize: '24px', fill: 'gold', fontFamily: 'Arial', stroke: 'black', strokeThickness: 8 }).setOrigin(0.5),
        assetText = this.add.text(320, 400, 'Loading Asset:', { fontSize: '24px', fill: 'gold', fontFamily: 'Arial', stroke: 'black', strokeThickness: 8 }).setOrigin(0.5);
        progressBox.fillStyle(0x444444, 0.8);
        progressBox.fillRect(20, 290, 600, 60);
        
        this.load.on('progress', function(value) {
            progressBar.clear();
            progressBar.fillStyle(0x00FF2D, 1);
            progressBar.fillRect(30, 300, 580 * value, 40);
            loadText.setText(`Loading... ${Math.ceil(value * 100)}%`);
        }, this);
        
        this.load.on('fileprogress', function(file) {
            assetText.setText(`Loading Asset: ${file.key}`);
        });
        
        this.load.audio('game_track', game_track);
        this.load.spritesheet('blob_death', blob_death, { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('blob_child', blob_child, { frameWidth: 26, frameHeight: 32 });
        this.load.spritesheet('blob_child_color', blob_child_color, { frameWidth: 26, frameHeight: 32 });
        this.load.spritesheet('blob', blob, { frameWidth: 34, frameHeight: 34 });
        this.load.spritesheet('blob_left', blob_left, { frameWidth: 34, frameHeight: 34 });
        this.load.spritesheet('blob_right', blob_right, { frameWidth: 34, frameHeight: 34 });
        this.load.spritesheet('gem', gem, { frameWidth: 20, frameHeight: 30 });
        this.load.spritesheet('skeleton', skeleton, { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('skeleton_rise', skeleton_rise, { frameWidth: 32, frameHeight: 48 });
        this.load.image('tiles', tiles);
        this.load.image('background', background);
        this.load.image('life', life);
        this.load.image('music_on', music_on);
        this.load.image('music_off', music_off);
        this.load.image('pause_on', pause_on);
        this.load.image('pause_off', pause_off);
        this.load.image('sfx_on', sfx_on);
        this.load.image('sfx_off', sfx_off);
        this.load.tilemapTiledJSON('map', map);
        this.load.audio('victory', victory);
        this.load.audio('death', death);
        this.load.audio('pop', pop);
        this.load.audio('gem_on', gem_on);
        this.load.audio('gem_off', gem_off);
        this.load.audio('teleport', teleport);
        this.load.audio('rise', rise);
        this.load.audio('skeleton_death', skeleton_death);

        this.load.on('complete', function() {
            this.scene.start('StartScreen');
        }, this);
    }
    
    create() {
        music = this.sound.add('game_track', music_config);

        this.anims.create({
            key: 'idle_color',
            frames: this.anims.generateFrameNumbers('blob_child_color', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('blob_child', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('gem', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'collect',
            frames: this.anims.generateFrameNumbers('blob_death', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('blob_left', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('blob_right', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('blob', { start: 1, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'blob', frame: 0 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'skeleton_down',
            frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'skeleton_up',
            frames: this.anims.generateFrameNumbers('skeleton', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'skeleton_right',
            frames: this.anims.generateFrameNumbers('skeleton', { start: 8, end: 11 }),
            flipX: false,
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'skeleton_left',
            frames: this.anims.generateFrameNumbers('skeleton', { start: 8, end: 11 }),
            flipX: true,
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'skeleton_rise',
            frames: this.anims.generateFrameNumbers('skeleton_rise', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: 'skeleton_turn',
            frames: [ { key: 'skeleton', frame: 1 } ],
            frameRate: 20
        });   
    }
}

export default Boot;