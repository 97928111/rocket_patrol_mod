class Menu extends Phaser.Scene
{
    constructor()
    {
        super("menuScene");
    }
    
    preload()
    {
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('bgm', './assets/rocketpatrolbgm.mp3')
        this.load.image('menu','./assets/menubackground.png');
    }
    
    create()
    {
        /*
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL MOD', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        */
        this.menu = this.add.image(game.config.width / 2, game.config.height / 2, "menu");
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //code idea from https://stackoverflow.com/questions/34210393/looping-audio-in-phaser
        var music = this.sound.add('bgm');
        music.setLoop(true);
        music.play();
    }

    update() 
    {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        // easy Mode
            game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
        }
            this.sound.play('sfx_select');
            this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
            game.settings = {
            spaceshipSpeed: 6,
            gameTimer: 45000    
        }
            this.sound.play('sfx_select');
            this.scene.start("playScene");    
        }
    }
}



