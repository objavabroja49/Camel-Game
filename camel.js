// jshint esversion: 6
//window.$ = require('jquery')(window);
const DRINKS = 6;
const TIREDNESS = 0;
const THIRST = 0;
const ENEMIES_LAGGING = -20; // km behind
const ENDTHIRST = 6;
const ENDTIREDNESS = 8;
const ENDKM = 100;
const MESSAGES = $(".messages");
var currentMessage = "";
var messagePrint = "";

var moderateMessage = ["Only so fast?\n",
                        "What's the hurry? Only a hundred bloodlusty bedouins are chasing you.\n",
                        "Don't break your neck on that speed.\n",
                        "Why not just walk?!\n",
                        "Slow and cowardly!\n",
                        "You'll never win with that attitude.\n",
                        "Your middle name is 'snail'?\n"];
var fastMessage = ["That's the spirit!\n",
                    "Yeah, run like hell!\n",
                    "Your (or rather their) camel hates you.\n",
                    "The desert will remember you, oh the fast one.\n",
                    "Don't ever stop!\n",
                    "They won't catch you while the camel runs. But for how long she will go on?\n",
                    "On a breakneck speed you can... well... break your neck.\n"];

var game = {
  game: true,
  kmEnemy: 0,
  enemiesKmCrossed: ENEMIES_LAGGING,
  message: [],
  endThirst: ENDTHIRST,
  endTiredness: ENDTIREDNESS,
  endKm: ENDKM,
  distance: 0
};

var player = {
  kmCrossed: 0,
  kmPlayerNow: 0,
  drinks: DRINKS,
  tiredness: TIREDNESS,
  thirst: THIRST
};

$("#quit").click(function() {
  game.message.push("You have quit!\n");
  console.log(messagePrint);
  print();
  game.game = false;
  gameEnd();

});

$("#drink").click(function() {
  updateGame("drink");
});

$("#rest").click(function() {
  updateGame("rest");
});

$("#moderate").click(function() {
  updateGame("moderate");
});

$("#full").click(function() {
  updateGame("full");
});

$("#status").click(function() {
  updateGame("status");
});


function updateGame(akcija) {

  switch (akcija) {
    case "moderate":
      // 7 do 1km na sat
      player.kmPlayerNow = Math.round(5 + Math.random() * 12); // 5 do 12
      game.kmEnemy = Math.round(7 + Math.random() * 7); // 7 do 15
      game.enemiesKmCrossed += game.kmEnemy;
      player.kmCrossed += player.kmPlayerNow;
      currentMessage = "You have traveled " + player.kmPlayerNow + " km.\n";
      player.tiredness++;
      player.thirst++;
      game.distance = player.kmCrossed - game.enemiesKmCrossed;
      // random message related to moderate speed
      game.message.push(currentMessage + moderateMessage[Math.round(Math.random() * (moderateMessage.length - 1))]);
      break;
    case "full":
      player.kmPlayerNow = Math.round(10 + Math.random() * 10); // 10 do 20
      game.kmEnemy = Math.round(7 + Math.random() * 7); // 7 do 14
      game.enemiesKmCrossed += game.kmEnemy;
      player.kmCrossed += player.kmPlayerNow;
      player.tiredness += 1 + Math.round(Math.random() * 2); // od 1 do 3 random
      player.thirst++;
      game.distance = player.kmCrossed - game.enemiesKmCrossed;
      currentMessage = "You have traveled " + player.kmPlayerNow + " km.\n";
      game.message.push(currentMessage + fastMessage[Math.round(Math.random() * (fastMessage.length - 1))]);
      break;
    case "status":
      // pokazuje status svih podataka
      //game.distance = player.kmCrossed - game.enemiesKmCrossed;
      game.message.push("Kilometres traveled: " + player.kmCrossed + "\nDrinks in canteen: " + player.drinks + "\nThe natives are " + game.distance + " kilometres behind you.\n");
      break;
    case "drink":
      if (player.drinks >= 1) {
        player.drinks--;
        player.thirst = 0;
        game.message.push("Now, that was sorely needed. You are not thirsty anymore!\n");
      } else {
        game.message.push("No more water in your canteen. You might find an oasis... might... but if not...\n");
      }

      break;
    case "rest":
      player.tiredness = 0;
      game.kmEnemy = Math.round(7 + Math.random() * 7); // 7 do 14
      game.enemiesKmCrossed += game.kmEnemy;
      game.distance = player.kmCrossed - game.enemiesKmCrossed;
      game.message.push("Your camel is happy, and so are you.\nBut your enemies are even happier!\n");
      break;
    default:
      // Quit
      game.game = false;
  }

  randomEvent();

  if (player.thirst === game.endThirst) {
    game.game = false;
    game.message.push("Too late, you die of thirst!\nGAME OVER!\n");
  } else if (player.tiredness >= game.endTiredness) {
    game.game = false;
    game.message.push("Your camel dies, you were running her too hard! You lose!\nGAME OVER!\n");
  } else if (player.kmCrossed <= game.enemiesKmCrossed) {
    game.game = false;
    game.message.push("The bedouins caught you! You lose!\nGAME OVER!\n");
  } else if (player.kmCrossed >= game.endKm) {
    game.game = false;
    game.message.push("You escaped! \nYOU WIN!\n");
  } else if (player.thirst > ENDTHIRST - 2) {
    game.message.push("You are thirsty!\n");
  } else if (player.tiredness > ENDTIREDNESS - 3) {
    game.message.push("Your camel is extremelly tired. Rest now!\n");
  } else if (game.distance < 15) {
    game.message.push("Bedouins are closing in on you!\n");
  }
  print();

  if (!game.game) {
    gameEnd();
  }
}

function randomEvent() {
  // moze da se da desi da naidje oazu, ili da naleti na pescanu oluju
  // sta se desi kad naidje na oazu? osvezi se kamila i popuni se cuturica
  // kad naleti na pescanu oluju, onda se smanji broj predjenih kilometara
  var eventRandom = Math.round(Math.random() * 20);
  if (eventRandom === 20) {
    // naisao je na oazu
    player.tiredness = 0;
    player.drinks = DRINKS;
    // message
    game.message.push("You have found an oasis!\nYour canteen is now full and your camel is ready  to run.\n");
  } else if (eventRandom === 1) {
    player.kmCrossed -= 5;
    game.message.push("You entered into a sand storm!\nYou were slower, 5 km less travelled than you should have.\n");
    // da li moze da se ovde smanji broj kilometara koje je presao u poslednjem koraku
    // a sta ako poslednji korak nije bilo kretanje nego rest ili drink?
  }
}


function print() {
  var i = game.message.length;
  // poslednjih x poruka, ali tako da se poslednja prva ispisuje
  var noOfMessages = 3;
  text = "";
  if (i <= noOfMessages) {
    j = 1;
  } else {
    j = game.message.length - noOfMessages - 1;
  }
  while (i >= j) {
    text = text + game.message[i - 1];
    i--;
  }
  MESSAGES.text(text);

}

function gameEnd() {
  $(".game-play").off(); // trebalo bi da ukine eventlistener
  $(".game-play").addClass("game-play-no");
  $(".game-play").removeClass("game-play");

  // napraviti prozor i dodeliti mu dugme sa porukom
  $("#end").addClass("game-play");
  $("#end").removeClass("game-play-no");

  // mozda pre ovoga iskljuciti sve event listenere?
  //ili uciniti invisible sve druge dugmice osim new game
  // i uciniti new game dugeme vrlo velikim. pozicija?

  $(".game-play").click(function() {

    window.location = "";
  });

}
