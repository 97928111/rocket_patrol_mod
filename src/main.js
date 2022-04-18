/*
    ·Add your own (copyright-free) background music to the Play scene (5)
    ·Create a new scrolling tile sprite for the background (5)
    ·Track a high score that persists across scenes and display it in the UI (5)
    ·Allow the player to control the Rocket after it's fired (5) 

    ·Display the time remaining (in seconds) on the screen (10)
    ·Create a new title screen (e.g., new artwork, typography, layout) (10)

    ·Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20) 
    ·Create a new spaceship type (w/ new artwork) that's smaller, moves faster, 
    and is worth more points (20) 
    ·Implement mouse control for player movement and mouse click to fire (20)

    Jimmy Lu
*/
let config =
{
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

//reserve keyboard vars
let keyF, keyR, keyLEFT,keyRIGHT;

var input, mouse;

// ser UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
