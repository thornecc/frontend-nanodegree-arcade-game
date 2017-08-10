// some global parameter and helper functions
const numRows = 6,
      numCols = 5,
      numEnemies = 3;

// constrain a value to a given range
// [min, max)
const sanitize = (x, min, max) => {
  if (min <= max) {
    x = x < min ? min : x;
    x = x >= max ? max-1 : x;
  }
  return x;
}

const sanitizeRow = x => sanitize(x, 0, numRows),
      sanitizeCol = x => sanitize(x, 0, numCols);

const randomInt = n => Math.floor(Math.random() * n);

// superclass of all in game objects
const Entity = function(sprite, x, y) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
}
Entity.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// entity which moves square by square, not freely
const GridEntity = function(sprite, row, col) {
  Entity.call(this, sprite);
  this.row = row;
  this.col = col;
  this.update();
}
GridEntity.prototype = Object.create(Entity.prototype);
GridEntity.prototype.constructor = GridEntity;

// update pixel coordinates using row,col values
GridEntity.prototype.update = function() {
  this.x = this.col * 100;
  this.y = -10 + (numRows - 1 - this.row) * 83;
}

// Enemies our player must avoid
const Enemy = function() {
  Entity.call(this, sprite='images/enemy-bug.png', 0, 0);
  this.reset();
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// reset the enemy, choosing a new speed and row
Enemy.prototype.reset = function() {
  this.row = 2 + randomInt(3);
  this.x = -100.0;
  this.speed = 400.0 + Math.random() * 300.0;
}

// get enemy's closest column for collision detection
Enemy.prototype.col = function() {
  return Math.floor(this.x / 100);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  this.x += dt * this.speed;
  if (this.x > (numRows + 1) * 100.0) {
    this.reset();
  }
  this.y = -20.0 + (numRows - 1 - this.row) * 83.0;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(sprite) {
  GridEntity.call(this, sprite=sprite);
  this.reset();
}
Player.prototype = Object.create(GridEntity.prototype);
Player.prototype.constructor = Player;

// reset player to a starting position
Player.prototype.reset = function() {
  this.row = 0;
  this.col = randomInt(numCols);
}


// update player row/column based on input
// row,col position is constrained to remain on the board
Player.prototype.handleInput = function(dir) {
  switch (dir) {
    case 'left':
      this.col--;
      break;
    case 'right':
      this.col++;
      break;
    case 'up':
      this.row++;
      break;
    case 'down':
      this.row--;
      break;
  }
  this.row = sanitizeRow(this.row);
  this.col = sanitizeCol(this.col);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [];
for (let i=0; i<numEnemies; ++i) {
  allEnemies.push(new Enemy());
}
const player = new Player('images/char-boy.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
