class Card {
  constructor(idx, deckIdx, color, value) {
    this.index = idx;          // index into the m_cardImages - an individual card image
    this.deckIndex = deckIdx;  // index into m_decks[] - which deck is this part of
    this.color = color;
    this.value = value;
    this.x = 0;                // x, y get calculated every time we draw
    this.y = 0;
    this.selected = false;
    this.played = false;
  }

  show() {
    if (!m_thisPlayer) return;

    noStroke(); noFill();
    image(m_cardImages[this.index], this.x, this.y, m_cw, m_ch);

    // if (this.commStatus && this.commStatus != COMM_UNK) {
    //   let ts = 32*m_s;
    //   textSize(ts); fill(0), stroke(0);
    //   let x = this.x+m_cw/2-ts/2*m_s - 5*m_s;
    //   let y = this.y + ts/2 + 10*m_s;  // top
    //   if (this.commStatus == COMM_MID) y = this.y + m_ch/2 + ts/2*m_s;
    //   if (this.commStatus == COMM_BOT) y = this.y + m_ch;
    //   text("🟢", x, y);
    // } else if (this.taskStatus) {
    //   push();
    //   textAlign(CENTER, CENTER);
    //   let ts = 32*m_s;
    //   textSize(ts); fill(0), stroke(0);
    //   // let x = this.x+m_cw/2-ts/2*m_s - 5*m_s;
    //   // let y = this.y + ts/2 + 10*m_s;  // top
    //   let x = this.x + m_cw/2;
    //   let y = this.y + m_ch/2;  
    //   text("⚪", x, y);
    //   text(m_taskMarkers[this.taskStatus], x, y);
    //   pop();
    // }

    if (this.selected) {
      // let deck = m_decks[this.deckIndex];
      stroke(0, 255, 0);
      strokeWeight(4);
      noFill();
      rect(this.x-2, this.y-2, m_cw, m_ch);
      strokeWeight(1);
    }

  }

  reset() {
    this.selected = false;
    this.played = false;
  }

  // data: a Card object
  copyFromServerData(data) {
    this.index = data.index;
    this.deckIndex = data.deckIndex;
    this.color = data.color;
    this.value = data.value;
    this.x = data.x;
    this.y = data.y;
    this.selected = data.selected;
    this.played = data.played;
  }

}