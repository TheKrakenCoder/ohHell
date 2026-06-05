var m_socket;
var m_initButton, m_nameInputButton, m_initialPlayer;
var m_players = [];  
let m_thisPlayer = null;
var m_initialized = false;
var m_mySocketId;
var m_messageP, m_oldMessage = "&nbsp";
var m_colors = ['#000000', '#FF0000', '#55AA55', '#0000FF'];
var m_colorNum = 0;
let m_s = 1.0;
let m_cardBackImage, m_cardImages= [], m_feltGoldImage;
let m_backgroundImage, m_tableImage;
let m_playerImages = [];
let m_playCardsUnshuffled = [];  // Card objects
let m_playDeck;  // Deck object
let m_decks = [];  // Decks
let m_cardsUnshuffled = [];  // each element is a Card[]
const DECK_PLAY = 0;  // index into m_decks and m_cardsUnshuffled
var m_debugDeck=-1;
let m_cw = 100, m_ch = 150;
let m_bw = 50, m_bh = 50;
let m_allButtons = [];
let m_trickCards = [];  // Cards
let m_standalone = false;
let m_currentRound = 0;
let m_showLastTrick = false;
let m_showScorecard = false;
let m_buttonPlayCard, m_buttonTakeTrick;
const BUTTON_DEAL = 0, BUTTON_CALC_SCORE = 1;
let m_lastButtonPressed = BUTTON_CALC_SCORE;
let m_warningMessage = "";

// xstart, ystart are offset from the entire canvas.  xplay, yplay are offset from table (325, 275)
let m_spots = [
   {xstart: 400, ystart:650, xplay:375, yplay:200},  // 0 (self)
   {xstart:   0, ystart:500, xplay:  0, yplay:200},  // 1
   {xstart:   0, ystart:325, xplay:  0, yplay:100},  // 2
   {xstart:   0, ystart:150, xplay:  0, yplay:  0},  // 3
   {xstart: 400, ystart:  0, xplay:225, yplay:  0},  // 4
   {xstart: 600, ystart:  0, xplay:375, yplay:  0},  // 5
   {xstart: 800, ystart:  0, xplay:550, yplay:  0},  // 6
   {xstart:1200, ystart:150, xplay:750, yplay:  0},  // 7
   {xstart:1200, ystart:325, xplay:750, yplay:100},  // 8
   {xstart:1200, ystart:500, xplay:750, yplay:200}   // 9
]
 

function preload() {
  let suits = ['clubs', 'hearts', 'spades', 'diamonds'];
  let pictures = ['jack', 'queen', 'king', 'ace'];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 2; j <= 10; j++) {
      m_cardImages.push(loadImage('Assets/' + j + '_of_' + suits[i] + '.png'));
    }
    for (let j = 0; j < pictures.length; j++) {
      m_cardImages.push(loadImage('Assets/' + pictures[j] + '_of_' + suits[i] + '.png'));
    }
  }
  // let suits = ['blue', 'green', 'pink', 'yellow'];
  // for (let i = 0; i < suits.length; i++) {
  //   for (let j = 1; j <= 9; j++) {
  //     m_cardImages.push(loadImage('Assets/' + suits[i] + j + '.jpg'));
  //   }
  // }
  // for (let i = 1; i <= 4; i++) m_cardImages.push(loadImage('Assets/' + 'rocket' + i + '.jpg'));
  m_cardBackImage = loadImage('Assets/cardBack.jpg')
  m_feltGoldImage = loadImage('Assets/feltGold.jpg')
  m_backgroundImage = loadImage('Assets/tableBackground.jpg');
  m_tableImage = loadImage('Assets/feltRed.jpg');

  // load player images
  m_playerImages['amanda'] = loadImage('Assets/picAmanda.jpg');
  m_playerImages['amelia'] = loadImage('Assets/picAmelia.jpg');
  m_playerImages['charlie'] = loadImage('Assets/picCharlie.jpg');
  m_playerImages['cyndi'] = loadImage('Assets/picCyndi.jpg');
  m_playerImages['danny'] = loadImage('Assets/picDanny.jpg');
  m_playerImages['jake'] = loadImage('Assets/picJake.jpg');
  m_playerImages['jessica'] = loadImage('Assets/picJessica.jpg');
  m_playerImages['joe'] = loadImage('Assets/picJoe.jpg');
  m_playerImages['john'] = loadImage('Assets/picJohn.jpg');
  m_playerImages['justin'] = loadImage('Assets/picJustin.jpg');
  m_playerImages['liz'] = loadImage('Assets/picLiz.jpg');
  m_playerImages['lou'] = loadImage('Assets/picLou.jpg');
  m_playerImages['matt'] = loadImage('Assets/picMatt.jpg');
  m_playerImages['matthew'] = loadImage('Assets/picMatthew.jpg');
  m_playerImages['melissa'] = loadImage('Assets/picMelissa.jpg');
  m_playerImages['micaela'] = loadImage('Assets/picMicaela.jpg');
  m_playerImages['michael'] = loadImage('Assets/picMichael.jpg');
  m_playerImages['rebecca'] = loadImage('Assets/picRebecca.jpg');
  m_playerImages['steffanie'] = loadImage('Assets/picSteffanie.jpg');
  m_playerImages['steve'] = loadImage('Assets/picSteve.jpg');
  m_playerImages['steven'] = loadImage('Assets/picSteven.jpg');
}

function setup() {
  createCanvas(1600, 900);

  /////////////////////////////////////////////
  // Create decks and Cards
  /////////////////////////////////////////////
  let cnt = 0;
  for (let i = 1; i <= 4; i++) {
    // 2 thru ace
    for (let j = 2; j <= 14; j++) {
      m_playCardsUnshuffled.push(new Card(cnt++, DECK_PLAY, i, j));
    }
  }

  m_cardsUnshuffled[DECK_PLAY] = m_playCardsUnshuffled;

  m_playDeck = new Deck(DECK_PLAY, 100, 150);

  // We don't need to add Cards, because the shuffle will take care of that
  m_playDeck.shuffle();

  m_decks.push(m_playDeck);

  console.log('m_decks[0].cards.length = ' , m_decks[0].cards.length);
  
  /////////////////////////////////////////////
  // GUI
  /////////////////////////////////////////////
  // Temporary Buttons

  // Init Button
  m_initButton = createSpan('Type Name and hit Enter');
  // m_initButton.mousePressed(initPlayerToServer);
  m_nameInputButton = createInput();
  m_nameInputButton.changed(initPlayerToServer);

  //////////////////////////////////////////////
  // Permanent buttons on top of canvas
  //////////////////////////////////////////////

  // let buttonNewHand = createNormalButton2("New Hand", 1500, 0, m_bw, m_bh);
  // buttonNewHand.mousePressed(() => {    newHand(7);  });

  // // let buttonP0 = createNormalButton2("P0", 1500, 50, m_bw, m_bh);
  // // buttonP0.mousePressed(() => {    m_thisPlayer = m_players[0];  });
  // // let buttonP1 = createNormalButton2("P1", 1550, 50, m_bw, m_bh);
  // // buttonP1.mousePressed(() => {    m_thisPlayer = m_players[1];  });
  // // let buttonP2 = createNormalButton2("P2", 1500, 100, m_bw, m_bh);
  // // buttonP2.mousePressed(() => {    m_thisPlayer = m_players[2];  });
  // // let buttonP3 = createNormalButton2("P3", 1550, 100, m_bw, m_bh);
  // // buttonP3.mousePressed(() => {    m_thisPlayer = m_players[3];  });
  let buttonDeal1 = createNormalButton2("Deal 1", 1500, 50, m_bw, m_bh);
  buttonDeal1.mousePressed(() => newHand(1) );
  let buttonDeal2 = createNormalButton2("Deal 2", 1550, 50, m_bw, m_bh);
  buttonDeal2.mousePressed(() => newHand(2) );
  let buttonDeal3 = createNormalButton2("Deal 3", 1500, 100, m_bw, m_bh);
  buttonDeal3.mousePressed(() => newHand(3) );
  let buttonDeal4 = createNormalButton2("Deal 4", 1550, 100, m_bw, m_bh);
  buttonDeal4.mousePressed(() => newHand(4) );
  let buttonDeal5 = createNormalButton2("Deal 5", 1500, 150, m_bw, m_bh);
  buttonDeal5.mousePressed(() => newHand(5) );
  let buttonDeal6 = createNormalButton2("Deal 6", 1550, 150, m_bw, m_bh);
  buttonDeal6.mousePressed(() => newHand(6) );
  let buttonDeal7 = createNormalButton2("Deal 7", 1500, 200, m_bw, m_bh);
  buttonDeal7.mousePressed(() => newHand(7) );

  let buttonBid1 = createNormalButton2("Bid 1", 1500, 300, m_bw, m_bh);
  buttonBid1.mousePressed(() => playerBid(1) );
  let buttonBid2 = createNormalButton2("Bid 2", 1550, 300, m_bw, m_bh);
  buttonBid2.mousePressed(() => playerBid(2)  );
  let buttonBid3 = createNormalButton2("Bid 3", 1500, 350, m_bw, m_bh);
  buttonBid3.mousePressed(() => playerBid(3)  );
  let buttonBid4 = createNormalButton2("Bid 4", 1550, 350, m_bw, m_bh);
  buttonBid4.mousePressed(() => playerBid(4)  );
  let buttonBid5 = createNormalButton2("Bid 5", 1500, 400, m_bw, m_bh);
  buttonBid5.mousePressed(() => playerBid(5)  );
  let buttonBid6 = createNormalButton2("Bid 6", 1550, 400, m_bw, m_bh);
  buttonBid6.mousePressed(() => playerBid(6)  );
  let buttonBid7 = createNormalButton2("Bid 7", 1500, 450, m_bw, m_bh);
  buttonBid7.mousePressed(() => playerBid(7)  );
  let buttonBid0 = createNormalButton2("Bid 0", 1550, 450, m_bw, m_bh);
  buttonBid0.mousePressed(() => playerBid(0)  );

  // let buttonBidLock = createNormalButton2("Lock Bid", 1500, 500, m_bw, m_bh);
  // buttonBidLock.mousePressed();

  let buttonCalcScore = createNormalButton2("Calc Score", 1500, 600, m_bw, m_bh);
  buttonCalcScore.mousePressed(calcScore);

  let buttonShowLastTrick = createNormalButton2("Show Last", 1500, 700, m_bw, m_bh);
  buttonShowLastTrick.mousePressed(function() {
    m_showLastTrick = !m_showLastTrick;
    if (m_showLastTrick) buttonShowLastTrick.style('background-color', "#00FF00");
    else buttonShowLastTrick.style('background-color', "#F0F0F0");
  });

  let buttonShowScorecard = createNormalButton2("Score Card", 1550, 700, m_bw, m_bh);
  buttonShowScorecard.mousePressed(() => m_showScorecard = !m_showScorecard);


  let buttonUntakeTrick = createNormalButton2("Untake Trick", 1500, 850, m_bw*2, m_bh);
  buttonUntakeTrick.mousePressed(untakeTrick);

  // this player buttons
  m_buttonPlayCard = createNormalButton2("Play Card", 700, 650, m_bw, m_bh);
  m_buttonPlayCard.mousePressed(playSelectedCard);
  let buttonUnplayCard = createNormalButton2("Unplay Card", 800, 650, m_bw, m_bh);
  buttonUnplayCard.style('padding', '5px 0px');
  buttonUnplayCard.mousePressed(unplaySelectedCard);
  m_buttonTakeTrick = createNormalButton2("Take Trick", 900, 650, m_bw, m_bh);
  m_buttonTakeTrick.mousePressed(takeTrick);

  // Below canvas
  m_messageP = createDiv('Message here');

  /////////////////////////////////////////////
  // Network communication
  /////////////////////////////////////////////
  
  // socket
  m_socket = io();
  console.log('m_socket = ' , m_socket);
  

  // For Standalone play, we don't need a socket connection and we don't even have a server running.
  if (m_socket) {

    // initPlayer message //
    // After the sketch sends the 'start' message, by pressing the Init button, the server responds with the 'initPlayer' message.
    // By the time this gets called, we should have our m_socket.id and this m_players[0].socketId
    // data: a single Player, and it should be ourselves
    m_socket.on('initPlayer', function(data) {
      console.log('initPlayer message: We got ' , data);
      // Only the player who sent the start message to the server wants to process
      // the initPlayer message
      if (m_mySocketId === data.socketId) {
        console.log('initPlayer message: found player');
        m_initialPlayer.copyFromServerData(data);
        m_players.push(m_initialPlayer);
        m_initialized = true;
        m_initButton.hide();
        m_nameInputButton.hide();
      } else {
        console.log('initPlayer message: This message intended for another player');
      }

    });

    // heartbeat message //
    // data: object containing a Player array and a Table
    m_socket.on('heartbeat', function(data) {
      if (!m_initialPlayer) return;
      console.log('heartbeat message: We got ' , data);
      createPlayersFromServerData(data.players);
      setMessageFromServerData(data.message);
      createDecksFromServerData(data.decks);
      createTrickCardsFromServerData(data.trickCards);
      m_currentRound = data.currentRound;
      m_lastButtonPressed = data.lastButtonPressed;
      // createTaskCardsFromServerData(data.taskCards);
      // m_distress = data.distress
      // m_firewood = data.firewood;
      // m_isOpenSeason = data.isOpenSeason;
      // m_difficulty = data.difficulty;

      // // Note I wasn't able to pass in m_discards into the function here and fill it in 
      // // using the function argument.  I had to directly specify m_discards in the function.
      // // This is probably because I keep changing what m_discards is.
      // // createCardArrayFromServerData(data.discards, m_discards);
    });
 }

}

////////////////////////////////////////////
// NETWORK FUNCTIONS
////////////////////////////////////////////

// called when user presses the Init button
function initPlayerToServer() {
  if (m_nameInputButton.value().length <= 0) {
    // m_messageP.style('color', '#000000');
    m_messageP.html("Enter a real name, buddy");
    return;
  }

  ///////////////////////////////////////
  // For solo play there should be 4 numbers indicating which classes to play
  let name = m_nameInputButton.value();
  if (name.startsWith('SA')) {
  // if (name.length > 0) {
    m_standalone = true;
    const result = name.slice('SA'.length);
    console.log('result = ' , result);
    let names = result.trim().split(/\s+/);
    console.log('names = ' , names);
    
    // if (classes.length != 4) {
    //   m_messageP.html("You have to enter exactly 4 integers after the string STANDALONE");
    //   return;
    // }
    for (let i = 0; i < names.length; i++) {
      m_players[i] = new Player(i, names[i]);
    }
    m_thisPlayer = m_players[0];
    m_initialized = true;
    // m_socket.close();

    m_initButton.hide();
    m_nameInputButton.hide();
    // m_classRadio.hide();

    return;
  }

  ///////////////////////////////////////
  // Regular internet play
  console.log("INITPLAYER");
  m_initialPlayer = new Player(-1, m_nameInputButton.value());
  // m_initialPlayer.dealer = true;
  m_initialPlayer.socketId = '/#' + m_socket.id; 
  m_thisPlayer = m_initialPlayer;
  m_socket.emit('start', m_initialPlayer);
}  // initPlayerToServer()

// called when we get a heartbeat from the server
// data: array of Player objects
function createPlayersFromServerData(data) {
  console.log('player data = ' , data);
  
  let playersTemp = [];
  for (p of data) {
    let player = new Player(p.seatPos, p.name);
    player.copyFromServerData(p);
    playersTemp.push(player);
  }
  // sort the array by seatPos, so advancing and changing dealer (next hand) work properlu
  // javascript sort converts to strings first, so returning a.seatPos - b.seatPos correctly sorts numbers
  // playersTemp.sort((a, b) => {return a.seatPos > b.seatPos});
  playersTemp.sort((a, b) => {return a.seatPos - b.seatPos});
  m_players = playersTemp;

}  // createPlayersFromServerData()

// data: String
function setMessageFromServerData(data) {
  // m_messageP.style('background-color', 'FF0000');
  if (m_oldMessage != data) {
    m_oldMessage = data;
    m_colorNum++;
    if (m_colorNum >= m_colors.length) m_colorNum = 0;
  }
  m_messageP.style('color', m_colors[m_colorNum]);
  m_messageP.html(data);
}  //setMessageFromServerData()

// data: array of Deck objects
function createDecksFromServerData(data) {
  console.log('deck data = ' , data);
  // this line prevents us from overwriting our decks when we first come up and the server
  // doesn't have any decks yet.  This messes things up for the first person and subsequently everyone
  // has no decks.
  if (data.length == 0) return;

  let decksTemp = [];
  for (d of data) {
    let deck = new Deck();
    deck.copyFromServerData(d);
    decksTemp.push(deck);
  }
  m_decks = decksTemp;

}  // createDeckFromServerData()

// data: array of Cards
function createTrickCardsFromServerData(data) {
  let tricksTemp = [];

  for (c of data) {
    let card = new Card();
    card.copyFromServerData(c);
    tricksTemp.push(card);
  }
  m_trickCards = tricksTemp;

}

// // data: array of Cards
// function createTaskCardsFromServerData(data) {
//   let tasksTemp = [];

//   for (c of data) {
//     let card = new Card();
//     card.copyFromServerData(c);
//     tasksTemp.push(card);
//   }
//   m_taskCards = tasksTemp;

// }

function setGlobalsFromPlayerInfo() {
  m_thisPlayer = m_players.find(plr => plr.socketId === m_mySocketId);
  // I really should not use m_taskDeck and m_playDeck, but only use the m_decks array
  m_playDeck = m_decks[DECK_PLAY];
}

// emit all the players and the table to the server
function update() {
  if (m_initialized && m_socket) {
    let msg = m_messageP.html();
    let data = {
      players: m_players,
      message: msg,
      decks: m_decks,
      trickCards: m_trickCards,
      currentRound: m_currentRound,
      lastButtonPressed: m_lastButtonPressed,
      // shipTokens: m_shipTokens,
      // numSandLeft: m_numSandLeft,
    };
    m_socket.emit('update', data);
  }
}

////////////////////////////////////////////
// GUI
////////////////////////////////////////////

function createNormalButton2(name, x, y, w, h) {
  let button = createButton(name);
    button.style('width',  w+'px');
    button.style('height', h+'px');
    button.position(x, y);
    button.style('font-size', '16px');
    button.style('background-color', "#F0F0F0");
    button.style('borderRadius', "8px");
    if (name !== "Show Last") {
      button.mouseOver(() => button.style('background-color', 'lightblue'));
      button.mouseOut(() => button.style('background-color', '#F0F0F0'));
    }
    // button.style('box-shadow', '3px 3px 8px rgba(0, 0, 0, 0.3)');
    m_allButtons.push(new Button(button, x, y, w, h));
    return button;
}  // createNormalButton()
// function hoverOn() {
//   btn.style('background-color', 'lightblue');
// }
// function hoverOff() {
//   btn.style('background-color', 'white');
// }

////////////////////////////////////////////
// Game Play
////////////////////////////////////////////
function mousePressed() {
  console.log('mousePressed ', mouseX, mouseY);
  if (mouseX > 1500*m_s) return;
  if (!m_thisPlayer) return;

  // check this player's cards
  let foundCard = null;
  for (let card of m_thisPlayer.cards) {
    if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
      foundCard = card;
    }
  }
  // // let foundTableTaskCard = false;
  // for (let card of m_taskCards) {
  //   if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
  //     foundCard = card;
  //     // foundTableTaskCard = true;
  //   }
  // }
  // for (let card of m_thisPlayer.taskCards) {
  //   if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
  //     foundCard = card;
  //   }
  // }

  if (foundCard) foundCard.selected = !foundCard.selected;
  if (foundCard) update();
  // if (foundTableTaskCard) update();

  // if we didn't click on a card, deselect all cards
  if (!foundCard) {
    const sel1 = m_thisPlayer.cards.filter(card => card.selected == true);
    if (sel1.length > 0) for (let card of m_thisPlayer.cards) card.selected = false; 
    if (sel1.length > 0) update();

    // const sel2 = m_taskCards.filter(card => card.selected == true);
    // if (sel2.length > 0) for (let card of m_taskCards) card.selected = false; 

    // const sel3 = m_thisPlayer.taskCards.filter(card => card.selected == true);
    // if (sel3.length > 0) for (let card of m_thisPlayer.taskCards) card.selected = false; 

    // if (sel1 || sel2 || sel3) update();
  }

}

// We need to prevent people from forgetting to Calc Score before dealing a new hand.
// Method 1 is to have m_lastButonPressed (m_lBP) set to either NEW_HAND or CALC_SCORE.  If
// a player hits Deal X and m_lBP is NEW_HAND, then a warning with an "Are You Sure" message
// and Yes/No buttons would bw shown.  In this case m_lBP is a server variable.
// Method 2 is similar. If a player hits Deal X and m_lBP
// is NEW_HAND then we set m_warningMessage to be "You may have forgotten to Calc Score.  Press
// Deal again to deal a new hand."  We set m_lBP to CALC_SCORE (even though we are in newHand())
// and return.  Now of the same player presses Deal X again, the deal will happen since m_lBP 
// is CALC_SCORE.
// We are using Method 2.
// Note that we use an entirely different method to make sure calcScore() is not executed twice
// in a row. See calcScore() for details.

function newHand(numCards = 7) {
  if (m_lastButtonPressed == BUTTON_DEAL) {
    m_warningMessage = "You may have forgotten to Calc Score.\nIf not, press Deal again."
    m_lastButtonPressed = BUTTON_CALC_SCORE;
    return;
  }
  m_warningMessage = "";

  m_lastButtonPressed = BUTTON_DEAL;

  for (plr of m_players) plr.reset();
  for (deck of m_decks) {
    deck.reset();
    deck.shuffle();
  }
  m_trickCards = [];
  m_thisPlayer.isDealer = true;

  // start dealing with the player to the dealers left
  let leftPlayer = (m_thisPlayer.seatPos + 1)%m_players.length;
  console.log('m_thisPlayer.seatPos= ' , m_thisPlayer.seatPos);
  console.log('m_players.length = ' , m_players.length);
  console.log('leftPlayer = ' , leftPlayer);
  console.log('numCards = ' , numCards);
  
  if (m_players.length * numCards > 52) {
    m_messageP.html('Not enough cards in dec.');
    update();
    return;
  }

  for (let i = 0; i < numCards; i++) {
    for (let p = 0; p < m_players.length; p++) {
      let player = leftPlayer + p;
      // if (player > m_players.length-1) player = 0;
      if (player > m_players.length-1) player = player % m_players.length;
      // console.log('dealing to player ' + player)
      let crd = m_decks[DECK_PLAY].dealCard();
      m_players[player].addCard(crd);
    }
  }

  for (let player of m_players) {
    player.cards.sort((a,b) => (a.color-b.color || a.value-b.value));
  }

  update();
}

function playerBid(bid) {
  m_thisPlayer.bids[m_currentRound] = bid;
  update();
}

function calcScore() {
  let tricksTaken = 0;
  for (let player of m_players) {
    if (player.cards.length > 0) {
      m_messageP.html('All cards must be played before the score for this round can be calculated.');
      update();
      return;
    }
    tricksTaken += player.tricksTakens[m_currentRound];
  }
  // if no tricks were taken, this wasn't a legitimate round
  if (tricksTaken == 0) {
    m_messageP.html('Do not hit Calc Score until a new hand as been played.');
    update();
    return;
  }

  m_lastButtonPressed = BUTTON_CALC_SCORE;
  m_warningMessage = "";

  m_currentRound++;
  // set these defaults so that we don't end up with undefined before each players
  // sets a bid and takes a trick
  for (let player of m_players) {
    player.bids.push(0);
    player.tricksTakens.push(0);
  }
  update();
}

function playSelectedCard() {
  for (let card of m_thisPlayer.cards) {
    if (card.played) {
      m_messageP.html('You have already played a card.');
      card.selected = false;
      update();
      return;
    }
  }
  for (let card of m_thisPlayer.cards) {
    if (card.selected) {
      card.played = true;
      card.selected = false;
      update();
      break;
    }
  }
}

function unplaySelectedCard() {
  for (let card of m_thisPlayer.cards) {
    if (card.played) {
      card.played = false;
      card.selected = false;
      update();
      break;
    }
  }
}

function takeTrick() {
  let numCards = 0;
  for (let player of m_players) {
    for (let card of player.cards) {
      if (card.played) numCards++;
    }
  }
  if (numCards != m_players.length) {
    m_messageP.html('Each player must play one card before the trick can be taken');
    update();
    return;
  }
  for (let player of m_players) {
    for (let c = 0; c < player.cards.length; c++) {
      if (player.cards[c].played) {
        let cards = player.cards.splice(c, 1);
        m_trickCards.push(cards[0]);
        break;
      }
    }
  }

  m_thisPlayer.tricksTakens[m_currentRound]++;
  update();

}

function untakeTrick() {
  // make sure a trick has been taken
  if (m_trickCards/length == 0) {
    m_messageP.html('You cannot untake a trick before a trick has been taken');
    update();
    return;
  }

  // make sure no cards have been played on the table
  let numCards = 0;
  for (let player of m_players) {
    for (let card of player.cards) {
      if (card.played) numCards++;
    }
  }
  if (numCards != 0) {
    m_messageP.html('You cannot untake a trick after cards have been played in the next round');
    update();
    return;
  }

  m_thisPlayer.tricksTakens[m_currentRound]--;

  for (let i = 0; i < m_players.length; i++) {
    let len = m_trickCards.len-1;
    let cards = m_trickCards.splice(len, 1);
    cards[0].played = true;
    m_players[i].addCard(cards[0]);
  }
  update();
}

// function dealTaskCard() {
//   let card = m_taskDeck.dealCard();
//   if (card) {
//     m_taskCards.push(card);
//     update();
//   }
// }

// // ts: task status integer
// function markTaskCard(ts) {
//   let cards = m_taskCards.filter(card => card.selected == true) 
//   if (cards.length != 1) {
//     m_messageP.html('You must select exactly one task card on the table to mark');
//     update();
//     return;
//   }
//   cards[0].taskStatus = ts;
//   update();
// }
// // ts: task status integer
// function markTaskCardComplete(ts) {
//   let cards = m_thisPlayer.taskCards.filter(card => card.selected == true) 
//   if (cards.length != 1) {
//     m_messageP.html('You must select exactly one of your task cards to complete');
//     update();
//     return;
//   }
//   cards[0].taskStatus = ts;
//   cards[0].selected = false;
//   update();
// }

////////////////////////////////////////////
// Draw
////////////////////////////////////////////

function draw() {
  // The m_socket doesn't get an actual ID until after we are out of setup();
  // Hopefully by the time we receive our first message from the socket, we
  // have executed the lie of code below
  // m_players[0].socketId = '/#' + m_socket.id;
  if (m_standalone == false) {
    m_mySocketId = '/#' + m_socket.id;
    if (m_players.length > 0) setGlobalsFromPlayerInfo();
  }
  
  // background(220);
  image(m_backgroundImage, 0, 0, width, height);
  image(m_tableImage, 325*m_s, 275*m_s, 850*m_s, 350*m_s);

  if (m_warningMessage.length > 0) {
    stroke(255), fill(255), textSize(32*m_s);
    text(m_warningMessage, 325*m_s, 450*m_s);
  }

  for (p of m_players) {
    p.show();
  }

  // for (let i = 0; i < m_taskCards.length; i++) {
  //   let x = 500*m_s + (i%5)*m_cw;
  //   let y = 250*m_s;
  //   if (i >= 5) y += m_ch;
  //   let card = m_taskCards[i];
  //   card.x = x;
  //   card.y = y;
  //   card.show();

  // }

  if (m_showScorecard) showScorecard();
  else {
    m_buttonPlayCard.show();
    m_buttonTakeTrick.show();
  }

  if (m_debugDeck != -1) debugDrawDeck(m_debugDeck);

}

function showScorecard() {
  m_buttonPlayCard.hide();
  m_buttonTakeTrick.hide();
  let xs = 400*m_s, w = 800*m_s, h = 900*m_s;
  noStroke(); fill(200);
  rect(xs, 9, w, 900*m_s);
  let y = 0;
  let xoff = 100*m_s, yoff = 50*m_s;
  stroke(0), fill(0), textSize(24*m_s);
  // vertical lines
  for (let i = 0; i < 7; i++) {
    line(xs+(i+1)*xoff, 0, xs+(i+1)*xoff, h);
  }
  // horizontal lines
  for (let j = 0; j < 13; j++) {
    line(xs, (j+1)*yoff, xs+w, (j+1)*yoff);
  }
  // names on the top
  for (let i = 0; i < m_players.length; i++) {
    text(m_players[i].name, xs+(i+1)*xoff, yoff);
  }
  let numRounds = m_players[0].bids.length;
  let totalScores = new Array(m_players.length).fill(0); 
  // since we prefill the bids and tricksTakens with 0s, we have one too many rounds
  for (let round = 0; round < numRounds-1; round++) {
    // figure out how many tricks were taken this round.  This is drawn on the left
    let tricksThisRound = 0;
    for (let player of m_players) tricksThisRound += player.tricksTakens[round];
    if (tricksThisRound > 0) text(tricksThisRound, xs, (round+2)*yoff);
    // loop thru each player and calculate his score for this round and update his total scrore
    for (let i = 0; i < m_players.length; i++) {
      let score = 0;
      if (m_players[i].bids[round] == m_players[i].tricksTakens[round]) score = (5 + m_players[i].bids[round]);
      else                                      score = -1*abs(m_players[i].bids[round]-m_players[i].tricksTakens[round]);
      totalScores[i] += score;
      let str = '' + m_players[i].tricksTakens[round] + '/' + m_players[i].bids[round] + ' ' + score + '/' + totalScores[i];
      text(str, xs+(i+1)*xoff, (round+2)*yoff);
    }

  }
}

function windowResized() {
  // if (true) {
  // if (windowWidth >= 1600 && windowHeight>= 900) {
    let oldms = m_s;
    let newW, newH;
    let xScale = windowWidth/1600;
    let yScale = windowHeight/900;
    if (xScale <= yScale) {
      newW = windowWidth;
      newH = windowWidth*(900/1600);
      m_s = windowWidth/1600;
    } else {
      newH = windowHeight;
      newW = windowHeight*(1600/900);
      m_s = windowHeight/900;
    }

    for (let b of m_allButtons) {
      b.btn.size(b.w * m_s, b.h * m_s);
      b.btn.position(b.x * m_s, b.y * m_s);
    }

    // A few remaining variables
    m_cw = m_cw / oldms * m_s;
    m_ch = m_ch / oldms * m_s;
    m_bw = m_bw / oldms * m_s;
    m_bh = m_bh / oldms * m_s;

    resizeCanvas(newW, newH);
  // }
}

// I need a separate class that stores all the original informaiton.  I tried using the
// button's stats (x, y, w, h) from button.size() and button.position(), but those are
// integers and I quickly lose precision as I resize the window
class Button {
  constructor(btn, x, y, w, h) {
    this.btn = btn;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

// Setting m_debugSet to soemthing other than -1 causes this function to be called in draw();
function debugDrawDeck(deckIdx) {
  // console.log("debugDrawDeck :", deckIdx);
  let xpos = 0;
  let ypos = -m_ch;
  let deck = m_decks[deckIdx];
  for (let i = 0; i < deck.cards.length; i++) {
    let card = deck.cards[i];
    let idx = card.index;
    if (i % 10 == 0) {xpos = 0; ypos += m_ch}
    image(m_cardImages[idx], xpos, ypos, m_cw, m_ch);
    xpos += m_cw;
  }
}