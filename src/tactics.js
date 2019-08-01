import { Vision, square } from './util';
import * as util from './util';

function nullIfEmpty(obj, maker) {

  if (Object.entries(obj).length > 0) {
    return maker(obj);
  }
  return null;
}

class Tactic {
  constructor(name, solver) {
    this.name = name;
    this.solver = solver;
  }
}

export class SimpleTactic extends Tactic {
  constructor(name, combination, solver, ideas) {
    super(name, solver);
    this.lines = combination;
    this.ideas = ideas;
  }

  solved() {
    return this.ideas.size === 0 &&
      Object.entries(this.lines).length > 0;
  }
}

export class StrategicTactic extends SimpleTactic {
  constructor(name, combination, sequel, solver) {
    super(name, combination, solver);
    this.sequel = sequel;
  }
}
