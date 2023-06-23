let app = new PIXI.Application({ width: 640, height: 725 });
document.body.appendChild(app.view);

var score_text = new PIXI.Text("0", {
  font: "100px Arial",
  fill: "white",
});

var highScore = 0;

var highScoreText = new PIXI.Text("High Score: " + highScore, {
  font: "30px Arial",
  fill: "white",
});

let krtek = PIXI.Sprite.from("krtek.png");

let progress_bar = new PIXI.Graphics();
let progressBarHeight = 20;
progress_bar.beginFill(0x8F00FF);
progress_bar.drawRect(0, 0, app.view.width, progressBarHeight);
progress_bar.endFill();
progress_bar.y = 0;

app.stage.addChild(progress_bar);
app.stage.addChild(krtek);
app.stage.addChild(score_text);
app.stage.addChild(highScoreText);

var size = 200;

krtek.width = size;
krtek.height = size;

score_text.x = 313;
score_text.y = progressBarHeight + 5;

highScoreText.x = app.view.width - highScoreText.width - 20;
highScoreText.y = progressBarHeight + 5;

krtek.x = 220;
krtek.y = 300;

var score = 0;
var random_x = 2;
var random_y = 2;
var prev_number_x = 0;
var first_time = true;
var timer; // Declare the timer variable outside the click() function
var gameActive = true;

let first_round = true;

const score_increase = 1;

krtek.interactive = true;
krtek.buttonMode = true;
krtek.on("pointerdown", click);

function click() {
  if (!gameActive) {
    return; // Ignore click when the game is over
  }

  krtek.off("pointerdown", click); // Remove the previous event listener

  // Update the high score if necessary
  if (score + score_increase > highScore) {
    highScore = score + score_increase;
    highScoreText.text = "High Score: " + highScore;
  }

  // Increment the score
  score += score_increase;
  score_text.text = score;
  

  prev_number_x = random_x;
  prev_number_y = random_y;
  [random_x, random_y] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
  let loop = true;
  while (loop == true) {
    if (prev_number_x == random_x && prev_number_y == random_y) {
      [random_x, random_y] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
    } else {
      loop = false;
    }
  }
  krtek.x = [20, 220, 420][random_x];
  krtek.y = [100, 300, 500][random_y];

  if (timer) {
    // Clear the previous timer if it exists
    clearInterval(timer);
  }

  let time_const = 1000; // Total time duration in milliseconds (1 second)
  let interval = 10; // Update interval in milliseconds (adjust for smooth movement)
  let time = time_const;
  let barWidth = app.view.width;
  let progress = barWidth;

  progress_bar.clear();
  progress_bar.beginFill(0x00000);
  progress_bar.drawRect(0, 0, progress, progressBarHeight);
  progress_bar.endFill();
  progress_bar.y = 0;

  const updateProgressBar = () => {  
    // Adjust time duration based on score
    if (score < 15) {
      time_const = 1000; // 1 second
      interval = 10
    } else if (score >= 15 && score <= 50) {
      time_const = 900; // 0.9 seconds
      interval = 9
    } else if (score > 50 && score <= 100) {
      time_const = 750; // 0.75 seconds
      interval = 7.5
    } else if (score > 100 && score <= 250) {
      time_const = 500; // 0.5 seconds
      interval = 0.5
    } else if (score > 250 && score <= 500) {
      time_const = 250; // 0.25 seconds
      interval = 0.25
    } else {
      time_const = 100; // 0.1 seconds
      interval = 0.1
    }

    time -= interval; // Decrement time based on the interval

    if (time <= 0) {
      if (first_round){
        first_round = false
      }
      krtek.off("pointerdown", click);
      clearInterval(timer);
      progress_bar.clear();
      progress_bar.beginFill(0xFF0000); // Change color to red
      progress_bar.drawRect(0, 0, 0, progressBarHeight); // Set width to 0
      progress_bar.endFill();
      progress_bar.y = 0;
      showGameOverPopup();
      gameActive = false; // Set the game state to inactive
      return;
    }

    progress = barWidth - (time / time_const) * barWidth;

    progress_bar.clear();
    progress_bar.beginFill(0x8F00FF);
    progress_bar.drawRect(barWidth - progress, 0, progress, progressBarHeight);
    progress_bar.endFill();
    progress_bar.y = 0;
  };

  function showGameOverPopup() {
    krtek.off("pointerdown", click);
    const gameOverPopup = new PIXI.Graphics();
    gameOverPopup.beginFill(0x000000, 0.8);
    gameOverPopup.drawRect(0, 0, app.view.width, app.view.height);
    gameOverPopup.endFill();
  
    const gameOverText = new PIXI.Text("Game Over", {
      fontFamily: "Arial",
      fontSize: 100,
      fontWeight: "bold",
      fill: "white",
      align: "center",
    });
    gameOverText.alpha = 0;
    gameOverText.anchor.set(0.5);
    gameOverText.x = app.view.width / 2;
    gameOverText.y = app.view.height / 2 - 75;
  
    const scoreText = new PIXI.Text("Score: " + score, {
      fontFamily: "Arial",
      fontSize: 50,
      fill: "white",
      align: "center",
    });
    scoreText.alpha = 0;
    scoreText.anchor.set(0.5);
    scoreText.x = app.view.width / 2;
    scoreText.y = gameOverText.y + 20;
  
    const highScoreGameOverText = new PIXI.Text("High Score: " + highScore, {
      fontFamily: "Arial",
      fontSize: 50,
      fill: "white",
      align: "center",
    });
    highScoreGameOverText.alpha = 0;
    highScoreGameOverText.anchor.set(0.5);
    highScoreGameOverText.x = app.view.width / 2;
    highScoreGameOverText.y = scoreText.y + scoreText.height + 20;
  
    const playAgainButton = new PIXI.Graphics();
    playAgainButton.beginFill(0x8F00FF);
    playAgainButton.drawRoundedRect(
      app.view.width / 2 - 150,
      highScoreGameOverText.y + highScoreGameOverText.height + 150,
      300,
      80,
      10
    );
    playAgainButton.endFill();
    playAgainButton.alpha = 0; // Set initial alpha to 0
    
    const buttonText = new PIXI.Text("Play Again", {
      fontFamily: "Arial",
      fontSize: 50,
      fontWeight: "bold",
      fill: "white",
      align: "center",
    });
    buttonText.anchor.set(0.5);
    buttonText.x = app.view.width / 2;
    buttonText.y = 630;
  
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerdown", startGame);
  
    playAgainButton.addChild(buttonText);
  
    gameOverPopup.addChild(gameOverText);
    gameOverPopup.addChild(scoreText);
    gameOverPopup.addChild(highScoreGameOverText);
    gameOverPopup.addChild(playAgainButton);
    app.stage.addChild(gameOverPopup);
  
    const targetAlpha = 1;
    const fadeInSpeed = 0.01;
    const moveUpSpeed = 1;
  
    const fadeInGameOverText = () => {
      if (gameOverText.alpha < targetAlpha) {
        gameOverText.alpha += fadeInSpeed;
      } else {
        app.ticker.remove(fadeInGameOverText);
        app.ticker.add(moveUpGameOverText);
      }
    };
  
    const moveUpGameOverText = () => {
      if (gameOverText.y > app.view.height / 2 - 150) {
        gameOverText.y -= moveUpSpeed;
      } else {
        app.ticker.remove(moveUpGameOverText);
        app.ticker.add(fadeInScoreText);
      }
    };
  
    const fadeInScoreText = () => {
      if (scoreText.alpha < targetAlpha) {
        scoreText.alpha += fadeInSpeed;
      } else {
        app.ticker.remove(fadeInScoreText);
        app.ticker.add(fadeInHighScoreGameOverText);
      }
    };
  
    const fadeInHighScoreGameOverText = () => {
      if (highScoreGameOverText.alpha < targetAlpha) {
        highScoreGameOverText.alpha += fadeInSpeed;
      } else {
        app.ticker.remove(fadeInHighScoreGameOverText);
        app.ticker.add(fadeInPlayAgainButton); // Add the new fade in animation
      }
    };
  
    const fadeInPlayAgainButton = () => {
      if (playAgainButton.alpha < targetAlpha) {
        playAgainButton.alpha += fadeInSpeed;
      } else {
        app.ticker.remove(fadeInPlayAgainButton);
      }
    };
  
    app.ticker.add(fadeInGameOverText);
  }
  
  
  
  
  

  timer = setInterval(updateProgressBar, interval); // Store the timer reference
  krtek.off("pointerdown", click); // Remove the event listener before adding it again

  // Add the event listener again
  krtek.on("pointerdown", click);
}

function startGame() {
  if (gameActive) {
    return; // Ignore the click if the game is already active
  }

  gameActive = true;
  app.stage.removeChild(app.stage.children[app.stage.children.length - 1]); // Remove the game over popup
  score = 0;
  score_text.text = score;
  random_x = 2;
  random_y = 2;
  prev_number_x = 0;
  first_time = true;
  krtek.x = 220;
  krtek.y = 300;

  krtek.interactive = true;
  krtek.buttonMode = true;
  krtek.on("pointerdown", click);

  if (timer) {
    clearInterval(timer);
  }

  progress_bar.clear();
  progress_bar.beginFill(0x8F00FF);
  progress_bar.drawRect(0, 0, app.view.width, progressBarHeight);
  progress_bar.endFill();
  progress_bar.y = 0;
  
  // Reset the score to 0
  score = 0;
  score_text.text = score;
  highScoreText.text = "High Score: " + highScore; // Reset the high score text
}

// Start the game initially
startGame();
