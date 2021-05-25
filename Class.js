class player{
    constructor(player_id, amount, choice)
    {
        this.player_id = player_id;
        this.amount = amount;
        this.choice = choice;
    }
}

class pari {
    constructor(message, choices, id) {
      this.pari_id = id;    
      this.message = message;
      this.choices = choices;
      this.players = [];
    }
}