var preload = function(game){}

preload.prototype = {
  preload: function(){ 
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('platform', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  },
    create: function(){
    this.game.state.start("TheGame");
  }
}