var boot = function(game){
  console.log("%cStarting my awesome game", "color:white; background:red");
};
  
boot.prototype = {
  preload: function(){
          this.game.load.image("loading","assets/sky.png"); 
  },
    create: function(){
    this.game.state.start("Preload");
  }
}