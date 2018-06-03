var theGame = function(game){
  
}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;
var orcs;
var arrows;
var faceLeft;

var gameOver = true;

theGame.prototype = {
    preload: function(){ 
      this.game.load.spritesheet('archer', 'assets/archer.png', 64, 64);
      this.game.load.spritesheet('orc', 'assets/orc.png', 64, 64);
      this.game.load.spritesheet('goblin', 'assets/goblin.png', 64, 64);
      this.game.load.spritesheet('arrow', 'assets/arrow.png', 64, 64);
    },
    create: function(){
      //  Modify the world and camera bounds
      this.game.world.setBounds(0,0,6000, 480);
    
      //  We're going to be using physics, so enable the Arcade Physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //  A simple background for our game
      sky = this.game.add.sprite(0, 0, 'sky');
      sky.fixedToCamera = true;

      //creating Orcs group
      orcs = this.game.add.group();
      orcs.enableBody = true;

      //creating group for arrows
      arrows = this.game.add.group();
      arrows.enableBody = true;

      //  The platforms group contains the ground and the 2 ledges we can jump on
      platforms = this.game.add.group();

      //  We will enable physics for any object that is created in this group
      platforms.enableBody = true;

      x = 6;

      //creating fixed bottom ground 
      for(var i = 0; i<x;i++){
        // Here we create the ground.
        var ground = platforms.create(0+i*950, this.game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
      }

      // add no. of ledges
      x = 1;
      for(var i = 0; i<x; i++){
        //  Now let's create two ledges
        //adding ledge one
        //adding slight variance to the hights in the ledges
        var posX = i*950 + Math.round(Math.random()*20);
        var posY = 180 + Math.round(Math.random()*50);
        var ledge = platforms.create(posX, posY+50, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.7, 1);
        this.spawnGoblin(posX+60, posY-75, orcs);

        //adding ledge two
        ledge = platforms.create(posX+500, posY, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.7, 1);
        this.spawnOrc(posX+560, posY-75, orcs);
      }

      // The player and its settings
      player = this.game.add.sprite(32, this.game.world.height - 150, 'archer');

      //  We need to enable physics on the player
      this.game.physics.arcade.enable(player);

      //  Player physics properties. Give the little guy a slight bounce.
      player.body.bounce.y = 0.2;
      player.body.gravity.y = 300;
      player.body.collideWorldBounds = true;

      //setting player body collision
      player.body.setSize(35,54,15,6);

      //  Our two animations, walking left and right.
      var foo = []
      for(var i = 117; i<126;i++){
        foo.push(i);
      }
      player.animations.add('left', foo, 10, true);
      var foo = []
      for(var i = 143; i<151;i++){
        foo.push(i);
      }
      player.animations.add('right', foo, 10, true);
      var foo = []
      for(var i = 221; i<230;i++){
        foo.push(i);
      }
      shootLeft = player.animations.add('shootLeft', foo, 10, false);
      shootLeft.onComplete.add(this.shoot, this);

      var foo = []
      for(var i = 247; i<256;i++){
        foo.push(i);
      }
      shootRight = player.animations.add('shootRight', foo, 10, false);
      shootRight.onComplete.add(this.shoot, this);
      //add camer and allow it to follow player
      this.game.camera.follow(player);

      //  Finally some stars to collect
      stars = this.game.add.group();

      //  We will enable physics for any star that is created in this group
      stars.enableBody = true;

      //  Here we'll create 12 of them evenly spaced apart
      for (var i = 0; i < 12; i++)
      {
          //  Create a star inside of the 'stars' group
          var star = stars.create(i * 70, 0, 'star');

          //  Let gravity do its thing
          star.body.gravity.y = 300;

          //  This just gives each star a slightly random bounce value
          star.body.bounce.y = 0.7 + Math.random() * 0.2;
      }

      //  The score
      scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

      //  Our controls.
      cursors = this.game.input.keyboard.createCursorKeys();
  },
  update: function(){
    //  Collide the player and the stars with the platforms
    var hitPlatform = this.game.physics.arcade.collide(player, platforms);
    this.game.physics.arcade.collide(stars, platforms);
    this.game.physics.arcade.collide(orcs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
    this.game.physics.arcade.overlap(arrows, orcs, this.killOrc, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');

        faceLeft = true;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');

        faceLeft = false;
    }
    else if(cursors.down.isDown){
      //allowing the player to shoot arrows
      if(faceLeft)
        player.animations.play('shootLeft');
      else
        player.animations.play('shootRight');
    }
    else
    {
        //  Stand still
        player.animations.stop();
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
  },
  render: function(){
    this.game.debug.body(player);
  },
  shoot: function(){
    if(faceLeft){
      this.spawnArrow(player.x,player.y-15,-300);
    }
    else{
      this.spawnArrow(player.x,player.y-15,300);
    }
  },
  collectStar: function(player, star){
    // Removes the star from the screen
    star.kill();
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
  },
  spawnArrow: function(x,y, speed){
    if(speed > 0){
      arrow = arrows.create(x+60,y+100,'arrow');
      arrow.angle += 180;
      arrow.body.setSize(30,5,-50,-50);
    }
    else{
      arrow = arrows.create(x,y,'arrow');
      arrow.body.setSize(30,5,20,45);
    }
    arrow.body.velocity.x = speed;
  },
  spawnOrc: function(x,y){
    orc = orcs.create(x,y,'orc');
    orc.body.gravity.y = 300;
    orc.body.setSize(35,54,15,6);
    
    //  Our two animations, walking left and right.
    var foo = []
    for(var i = 117; i<126;i++){
      foo.push(i);
    }
    orc.animations.add('left', foo, 10, true);
    var foo = []
    for(var i = 143; i<151;i++){
      foo.push(i);
    }
    orc.animations.add('right', foo, 10, true);

    this.game.time.events.loop(Phaser.Timer.SECOND, this.orcPath, this, orc);
  },
  spawnGoblin: function(x,y){
    goblin = orcs.create(x,y,'goblin');
    goblin.body.gravity.y = 300;
    goblin.body.setSize(35,54,15,6);
    goblin.scale.setTo(0.7, 0.7);
    //  Our two animations, walking left and right.
    var foo = []
    for(var i = 117; i<126;i++){
      foo.push(i);
    }
    goblin.animations.add('left', foo, 10, true);
    var foo = []
    for(var i = 143; i<151;i++){
      foo.push(i);
    }
    goblin.animations.add('right', foo, 10, true);

    this.game.time.events.loop(Phaser.Timer.SECOND, this.orcPath, this, goblin);
  },
  orcPath: function(orc){
    if(orc.body.velocity.x > 0){
      orc.body.velocity.x = -100;
      orc.animations.play('left');
    }
    else if(orc.body.velocity.x <= 0){
      orc.body.velocity.x = 100;
      orc.animations.play('right');
    }
  },
  killOrc: function(arrow, orc){
    console.log('Inside Kill');
    orc.kill();
    arrow.kill();
  },
  killPlayer: function(player, orc){
    console.log('Inside KillPLayer');
    player.kill();
    orc.kill();
  }
}