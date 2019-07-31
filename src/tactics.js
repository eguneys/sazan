class Tactic {
  constructor(name, combination) {
    this.name = name;
    this.combination = combination;
  }

  apply(engine) {
    throw new Error("Unimplemented tactic.");
  }
}

export class ForcedMateTactic extends Tactic {
  constructor(combination) {
    super('forcedmate', combination);
  }
}

export const Tactics = {
  forcedmate(board) {

    const legals = board.legals();

    const mates = legals.filter(_ => board.apply(_).isMate());

    return mates.map(_ => new ForcedMateTactic(_));
  }
};
