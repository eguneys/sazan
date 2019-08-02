import { Vision, square } from './util';
import * as util from './util';

function nullIfEmpty(obj, maker) {

  if (Object.entries(obj).length > 0) {
    return maker(obj);
  }
  return null;
}

function depthOf(lines) {
  var level = 0;
  var key;
  for(key in lines) {
    if (!lines.hasOwnProperty(key)) continue;

    if(typeof lines[key] == 'object'){
      var depth = depthOf(lines[key]) + 1;
      level = Math.max(depth, level);
    }
  }
  return level;
}

class Tactic {
  constructor(name, solver) {
    this.name = name;
    this.solver = solver;
  }
}

export class SimpleTactic extends Tactic {
  constructor(name, combination, combo, solver, ideas = new Set()) {
    super(name, solver);
    this.lines = combination;
    this.ideas = ideas;
    this.combo = combo;
  }

  solved() {
    return depthOf(this.lines) <= this.combo &&
      depthOf(this.lines) > 0;
  }

  hasIdea() {
    return !this.solved() && this.ideas.size  > 0;
  }
}

export class StrategicTactic extends SimpleTactic {
  constructor(name, combination, combo, solver) {
    super(name, combination, combo, solver, new Set());
  }
}
