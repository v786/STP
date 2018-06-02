var theGame = function(game){
  
}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

theGame.prototype = {
    preload: function(){ 
      this.game.load.spritesheet('archer', 'assets/archer.png', 64, 64);
    },
    create: function(){
      //  Modify the world and camera bounds
      this.game.world.setBounds(0,0,6000, 480);
    
      //  We're going to be using physics, so enable the Arcade Physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //  A simple background for our game
      sky = this.game.add.sprite(0, 0, 'sky');
      sky.fixedToCamera = true;
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
      x = 6;
      for(var i = 0; i<x; i++){
        //  Now let's create two ledges
        //adding ledge one
        var ledge = platforms.create(i*950, 250, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.7, 1);

        //adding ledge two
        ledge = platforms.create(i*950+500, 180, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.7, 1);
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

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(player, stars, this.collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
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
  collectStar: function(player, star){
    // Removes the star from the screen
    star.kill();
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
  }
}