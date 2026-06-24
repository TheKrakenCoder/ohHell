// Player should have a seatPosition, that never changes.  When a new Player
// comes on board, we (the server) pick the lowest unused seat position.
//         2
//     1       3
//         0
// When we draw the players, we always draw a player at the bottom of the screen
// in seat position 0.  So we draw based on a relative seat position.
class Player {
  constructor(idx, name) {
    // index will end up getting set by the server
    this.socketId = 0;       // string
    this.seatPos = idx;      // integer
    this.name = name;        // string
    this.cards = []; // Card objects
    // this.taskCards = []  // Card objects
    this.isDealer = false;
    this.bids = [-1];
    this.tricksTakens = [0];
  }  // xtor

  show() {
    let relativeSeatPos = this.seatPos;
    if (!m_thisPlayer) return;
    relativeSeatPos = relativeSeatPos - m_thisPlayer.seatPos;
    if (relativeSeatPos < 0) relativeSeatPos += m_players.length;
    // console.log('relativeSeatPos = ' , relativeSeatPos);
    

    let name = this.name;
    if (this.isDealer) name += " (Dealer)";

    // player image
    let imgName = this.name.toLowerCase();
    imgName = imgName.replace(/\s/g, '');

    ///////////
    // myself
    if (relativeSeatPos == 0) {
      let spot = m_spots[0];
      fill(128), noStroke();
      // rect(0, 650*m_s, 1500*m_s, 250*m_s);
      image(m_feltGoldImage, spot.xstart*m_s, spot.ystart*m_s, 700*m_s, 250*m_s);
      stroke(0), fill(0), textSize(32*m_s);
      text(name, spot.xstart*m_s, spot.ystart*m_s + 32*m_s);
      const unplayed = this.cards.filter(card => card.played == false);
      // const comms = this.cards.filter(card => card.commStatus != 0 && card.played == false);
      const played = this.cards.filter(card => card.played == true);
      // text(unplayed.length, spot.xstart*m_s, spot.ystart*m_s + 2*32*m_s);
      // taken/bid
      text(this.tricksTakens[m_currentRound] + '/' + this.bids[m_currentRound], spot.xstart*m_s, spot.ystart*m_s + 2*32*m_s);
      // score
      let score = this.calculateScore();
      text(score, spot.xstart*m_s + 150*m_s, spot.ystart*m_s + 2*32*m_s);
      // player image
      if (m_playerImages[imgName]) {
        image(m_playerImages[imgName], (spot.xstart+700)*m_s - 75*m_s, spot.ystart*m_s, 75*m_s, 75*m_s);
      }

      // regular cards
      let space = 700*m_s;
      let offset = Math.min(space / unplayed.length, m_cw);
      // console.log('offset = ' , offset);
      
      // regular
      for (let i = 0; i < unplayed.length; i++) {
        unplayed[i].x = spot.xstart*m_s + i*offset;
        unplayed[i].y = (spot.ystart+100)*m_s;
        unplayed[i].show();
      }

      // played
      if (played.length > 0) {
        played[0].x = (325+spot.xplay)*m_s;  // 700*m_s;
        played[0].y = (275+spot.yplay)*m_s;  // 480*m_s;
        played[0].show();
      }

      // draw the cards in the last trick, if the button is pressed and
      // there are no cards currently on the table
      let anyCardsOnTable = false;
      for (let player of m_players) {
        for (let card of player.cards) {
          if (card.played) anyCardsOnTable = true;
        }
      }
      if (m_showLastTrick && !anyCardsOnTable && m_trickCards.length > 0) {
        for (let i = 0; i < m_players.length; i++) {
          let len = m_trickCards.length;
          let card = m_trickCards[len-1-i];
          image(m_cardImages[card.index], 350*m_s + i*m_cw, 375*m_s, m_cw*0.75, m_ch*0.75);
          noStroke(); fill(155, 155, 255, 130);
          rect(350*m_s + i*m_cw, 375*m_s, m_cw*0.75, m_ch*0.75);
        }
        // let len = m_trickCards.length;
        // let y = 900*m_s-m_ch*0.67;
        // let xoff = 1;
        // for (let i = 0; i < m_players.length; i++) {
        //   let card = m_trickCards[len-1-i];
        //   if (i >= 4) y = 900*m_s-2*m_ch*0.67;
        //   if (i >= 4) xoff = 1;
        //   image(m_cardImages[card.index], 1500*m_s-m_cw*(xoff)*0.67, y, m_cw*0.67, m_ch*0.67);
        //   xoff ++;
        // }
      }

      // if dealer, draw the next card in the deck, which is the trump card
      if (this.isDealer) {
        // image(m_decks[0].cards[m_decks[0].cards.length-1], x, spot.ystart, m_cw, m_ch);
        let x = spot.xstart*m_s-m_cw;
        let y = spot.ystart*m_s + m_ch/2;
        m_decks[0].cards[m_decks[0].cards.length-1].x = x;
        m_decks[0].cards[m_decks[0].cards.length-1].y = y;
        m_decks[0].cards[m_decks[0].cards.length-1].show();
        fill(0, 255, 0), stroke(0, 255, 0), textSize(32*m_s);
        push();
        textAlign(CENTER, CENTER);
        text("trump", x+m_cw/2, y + m_ch/2);
        pop();
      }

      return;
    }  // if this player

    /////////////////////////////////////////
    // Draw someone who is not this player
    let tablePos = this.findSpot(relativeSeatPos);
    // console.log('tablePos = ' , tablePos);
    let spot = m_spots[tablePos];
    
    image(m_feltGoldImage, spot.xstart*m_s, spot.ystart*m_s, 300*m_s, 250*m_s);
    stroke(0), fill(0), textSize(32*m_s);
    text(this.name, spot.xstart*m_s, spot.ystart*m_s + 32*m_s);

    // player image
    if (m_playerImages[imgName]) {
      image(m_playerImages[imgName], (spot.xstart+300)*m_s - 75*m_s, spot.ystart*m_s, 75*m_s, 75*m_s);
    }


    // Calculate the spot to draw the card back.
    let xx = spot.xstart*m_s + 100*m_s;
    let yy = spot.ystart*m_s + 100*m_s;

    // If the player is the dealer, draw the trump card and move the normal card position over
    if (this.isDealer) {
      let x = spot.xstart*m_s;
      // let y = spot.ystart*m_s + 50*m_s;
      m_decks[0].cards[m_decks[0].cards.length-1].x = x;
      m_decks[0].cards[m_decks[0].cards.length-1].y = yy;
      m_decks[0].cards[m_decks[0].cards.length-1].show();
      fill(0, 255, 0), stroke(0, 255, 0), textSize(32*m_s);
      push();
      textAlign(CENTER, CENTER);
      text("trump", x+m_cw/2, yy + m_ch/2);
      pop();
      // move the normal card over
      xx += 50*m_s;
    }
    // regular card (if player has any)
    if (this.cards.length > 0) {
      const unplayed = this.cards.filter(card => card.played == false);
      image (m_cardBackImage, xx, yy, m_cw, m_ch);
      fill(0, 255, 0), stroke(0, 255, 0), textSize(32*m_s);
      push();
      textAlign(CENTER, CENTER);
      text(unplayed.length, xx+m_cw/2, yy+m_ch/2);
      pop();
    } 

    // played
    const played = this.cards.filter(card => card.played == true);
    if (played.length > 0) {
      played[0].x = (325+spot.xplay)*m_s;  // 700*m_s;
      played[0].y = (275+spot.yplay)*m_s;  // 480*m_s;
      played[0].show();
    }

    // taken/bid
    stroke(0), fill(0), textSize(32*m_s);
    text(this.tricksTakens[m_currentRound] + '/' + this.bids[m_currentRound], spot.xstart*m_s, spot.ystart*m_s + 2*32*m_s);
    // score
    let score = this.calculateScore();
    text(score, spot.xstart*m_s + 150*m_s, spot.ystart*m_s + 2*32*m_s);

  }

  findSpot(relativeSeatPos) {
    let numP = m_players.length;
    if (numP == 2 && relativeSeatPos == 1) return 5;

    if (numP == 3 && relativeSeatPos == 1) return 2;
    if (numP == 3 && relativeSeatPos == 2) return 8;

    if (numP == 4 && relativeSeatPos == 1) return 2;
    if (numP == 4 && relativeSeatPos == 2) return 5;
    if (numP == 4 && relativeSeatPos == 3) return 8;

    if (numP == 5 && relativeSeatPos == 1) return 2;
    if (numP == 5 && relativeSeatPos == 2) return 4;
    if (numP == 5 && relativeSeatPos == 3) return 6;
    if (numP == 5 && relativeSeatPos == 4) return 8;

    if (numP == 6 && relativeSeatPos == 1) return 1;
    if (numP == 6 && relativeSeatPos == 2) return 3;
    if (numP == 6 && relativeSeatPos == 3) return 5;
    if (numP == 6 && relativeSeatPos == 4) return 7;
    if (numP == 6 && relativeSeatPos == 5) return 9;

    if (numP == 7 && relativeSeatPos == 1) return 1;
    if (numP == 7 && relativeSeatPos == 2) return 3;
    if (numP == 7 && relativeSeatPos == 3) return 4;
    if (numP == 7 && relativeSeatPos == 4) return 6;
    if (numP == 7 && relativeSeatPos == 5) return 7;
    if (numP == 7 && relativeSeatPos == 6) return 9;

  }

  // returns the player's current score
  calculateScore() {
    let score = 0;
    // the extra -1 is because we always have 0s in as placeholders for the bid and the tricks taken
    for (let i = 0; i < this.bids.length-1; i++) {
      if (this.bids[i] == this.tricksTakens[i]) score += (5 + this.bids[i]);
      else                                      score -= (abs(this.bids[i]-this.tricksTakens[i]));
    }
    return score
  }

  // card is a Card
  addCard(card) {
    this.cards.push(card);
  }

  // card is a Card
  addTaskCard(card) {
    this.taskCards.push(card);
  }

  reset() {
    this.cards = [];
    this.isDealer = false;
  }

  // data: a Player object
  copyFromServerData(data) {
    this.socketId = data.socketId;
    this.seatPos = data.seatPos;
    this.name = data.name;
    this.isDealer = data.isDealer;
    this.bids = data.bids;
    this.tricksTakens = data.tricksTakens;

    if (data.cards) {
      for (let c of data.cards) {
        let card = new Card();
        card.copyFromServerData(c);
        this.cards.push(card);
      }
    } else {
      this.cards = [];
    }
  }  // copyFromServerData

}  // class Player