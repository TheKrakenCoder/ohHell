// In the deck, the bottom cards is [0] and the top card is [len-1]
// For spread out decks, the left card is [0] and the right is [len-1]
class Deck {
  constructor(deckIndex, cw, ch) {
    this.deckIndex = deckIndex; // index into m_decks (is this really needed?)
    // this.cw = cw;     // card width of cards in this deck
    // this.ch = ch;     // card height of cards in this deck
    // this.unscaledCw = cw;     // card width of cards in this deck
    // this.unscaledCh = ch;     // card height of cards in this deck
    this.cards = [];  // Card objects
    // this.shuffle();
  }

  // card: a Card object
  addCard(card) {
    // make sure this card is in this deck
    card.deckIndex = this.deckIndex;
    this.cards.push(card);
  }

  // // card: a Card object
  // addCardToBottom(card) {
  //   // make sure this card is in this deck
  //   card.deckIndex = this.deckIndex;
  //   this.cards.unshift(card);
  // }

  shuffle() {
    this.reset();
    let deck = [];  // integer indexes into the unshuffled Deck

    for (let i = 0; i < m_cardsUnshuffled[this.deckIndex].length; i++) {
      deck.push(i);
      m_cardsUnshuffled[this.deckIndex][i].reset();
    }

		while (deck.length > 0) {
			let index = floor(random(deck.length));
      this.cards.push(m_cardsUnshuffled[this.deckIndex][deck[index]]);
      deck.splice(index, 1);
		}

  }

  // // This shuffle assumes all the cards are in the deck, like in SetAWatch.  In this case we
  // // want to start from the original unshuffled array of cards (like in OnlinePoker).
  // // We just want to randomly select a card that's already in the list, so it's pretty easy.
  // // If we have 5 cards, we have indexes from 0 to 4.  the index inside the card itself is not needed.
  // shuffle() {
  //   let indexes = [];
  //   let cards = [];
  //   for (let i = 0; i < this.cards.length; i++) indexes[i] = i;
	// 	while (indexes.length > 0) {
	// 		let index = floor(random(indexes.length));
  //     // console.log('index = ' , index);
      
  //     cards.push(this.cards[indexes[index]]);
  //     indexes.splice(index, 1);
	// 	}
  //   this.cards = cards;

  // }


  // returns top card of the deck as Card
  dealCard() {
    let len = this.cards.length;
    if (len == 0) {
      m_messageP.style('color', '#FF0000');
      m_messageP.html('The deck is empty.  Better shuffle.')
      return undefined;
    }

    let cards = this.cards.splice(len-1, 1);
    return cards[0];
  }

  // // otherDeck: index of a Deck object
  // moveTopCardToDeck(otherDeckIndex) {
  //   // console.log("this.moveTopCardToDeck");
  //   let otherDeck = m_decks[otherDeckIndex];
  //   // console.log('otherDeck.setIndex, this.setIndex = ' , otherDeck.setIndex, this.setIndex);
    
  //   if (otherDeck.setIndex != this.setIndex) {
  //     return;
  //   }
  //   let card = this.dealCard();
  //   if (card) {
  //     card.deckIndex = otherDeck.deckIndex;
  //     otherDeck.addCard(card);
  //   }
  // }

  reset() {
    this.cards = [];
  }

  // returns an index into a deck's cards array of a passed in card
  findIndexInDeck(card) {
    let indexInDeck = -1;
    for (let j = 0; j < this.cards.length; j++) {
      if (this.cards[j] == card) {
        indexInDeck = j;
      }
    }
    return indexInDeck;
  }

  // data: a Deck object
  copyFromServerData(data) {
    this.deckIndex = data.deckIndex;
    // this.cw = data.unscaledCw * m_s;
    // this.ch = data.unscaledCh * m_s;
    // this.unscaledCw = data.unscaledCw;
    // this.unscaledCh = data.unscaledCh;
    if (data.cards) {
      this.cards = [];
      for (let c of data.cards) {
        // let card = new Card(c.setIndex, c.index, c.setIndex);  unneeded since copyFromServerData will set all this stuff
        let card = new Card();
        card.copyFromServerData(c);
        this.cards.push(card);
      }
    } else {
      this.cards = [];
    }

  }
}