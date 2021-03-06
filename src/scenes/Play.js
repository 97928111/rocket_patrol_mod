class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
        this.rocket;
    }

    preload()
    {
        // load image
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('specialship', './assets/specialspaceship.png')
        this.load.image('starfield', './assets/starfield.png');
        
        // lode spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create()
    {
        //add event for mouse control
        this.addEvents();
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize *2, 0x00FF00).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //mouse control
        input = this.input;
        mouse = this.input.mousePointer;

        // add spaceships(x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0);
        this.specialShip = new Spaceship2(this, game.config.width, borderUISize * 8 + borderPadding * 4, 'specialship', 0, 50).setOrigin(0,0);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        })
        
        //----------------------------------------------------------------------
        //timer
        this.gameTime = game.settings.gameTimer;
        let gameTimeConfig = 
        {
            fontFamily: 'Courier',
            fontSize: '22px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                botton: 5,
            },
            fixedWidth:150
        }

        this.timeLeft = this.add.text(410, 54, "Timer: "+ this.formatTime(this.gameTime), gameTimeConfig);
        //code from https://phaser.discourse.group/t/countdown-timer/2471
        this.timeEvent = this.time.addEvent({
            delay: 1000, callback:() => {this.gameTime -= 1000;
                                         this.timeLeft.text = "Timer: "+ this.formatTime(this.gameTime);},
            scope: this,
            loop: true
        });

        //----------------------------------------------------------------------

        //initialize score
        this.p1Score = 0
        // Save the Highest score
        this.bScore = parseInt(localStorage.getItem("score")) || 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                botton: 5,
            },
            fixedWidth:150
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        this.bestScore = this.add.text(225,54,"Best: " + this.bScore, scoreConfig);
        
       // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this); 
    }
    //Code from https://www.youtube.com/watch?v=9wvlAzKseCo&t=7s
    // Mouse control rocket after shooting
    addEvents()
    {
        this.input.on( 'pointermove', pointer => {
            this.p1Rocket.x = pointer.x;
        });
    }
   
    update()
    {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;

        if(!this.gameOver)
        {
            this.p1Rocket.update();
            // update spaceship(x3)
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.specialShip.update();
        }
        
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.specialShip))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.specialShip);
        }
    }

    checkCollision(rocket, ship)
    {
        // simple AABB checking
        if(rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x
           && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y)
           {
               return true;
           }
           else
           {
               return false;
           }
    }

    shipExplode(ship)
    {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        // play explode animation
        boom.anims.play('explode');
        // callback after anim completes
        boom.on('animationcomplete', () => {
            ship.reset();           //reset ship position
            ship.alpha = 1;           //make ship visible again
            boom.destroy();           // remove explosion sprite
        });
        
        // score add and repaint
        this.p1Score += ship.points;
        // highest score compare and save
        if(this.p1Score > this.bScore)
        {
            this.bScore = this.p1Score;
            localStorage.setItem("score", this.bScore);
            this.bestScore.text = "Best: " + this.bScore;
        }
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    //code from https://phaser.discourse.group/t/countdown-timer/2471
    formatTime(second)
    {
        let s = second/1000;
        let min = Math.floor(s/60);
        let seconds = s%60;
        seconds = seconds.toString().padStart(2, "0");
        return `${min}:${seconds}`;
    }
    
}