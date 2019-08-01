import { Vision, square } from './util';
import * as util from './util';

import Combination from './combination';

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

class SimpleTactic extends Tactic {
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

class StrategicTactic extends SimpleTactic {
  constructor(name, combination, sequel, solver) {
    super(name, combination, solver);
    this.sequel = sequel;
  }
}

export const Tactics = {
  BackrankMate(combination, ideas = new Set()) {
    return new SimpleTactic('backrankMate', combination, BackrankMateSolver, ideas);
  },
  ForcedMate(combination, ideas = new Set()) {
    return new SimpleTactic('forcedMate', combination, ForcedMateSolver, ideas);
  }
};

export const Tactics2 = {
  RemovalOfDefender(combination, sequel) {
    return new StrategicTactic('removalOfDefender', combination, sequel, RemovalOfDefenderSolver);
  }
};


export const TacticSolver = {
  solve(board) {
    return TacticSolvers
      .flatMap(_ => _(board))
      .filter(_ => !!_);
  }
};

export const Tactic2Solver = {
  solve(tactic, board) {
    return Tactic2Solvers
      .flatMap(_ => _(tactic, board))
      .filter(_ => !!_);
  }
};

const RemovalOfDefenderSolver = (tactic, board) => {
  console.log(tactic.solver);
};

const BackrankMateSolver = (board) => {
  const ideas = new Set();

  const filters = depth => (board, move) => {
    const attack = attack => {
      const kingMoves = attack.moves(attack.king());
      return kingMoves.length === 0;
    };
    const defense = defense => {
      const king = defense.king(false);
      const kingMobility = defense.mobility(king);
      const kingMobilityDirection = util.classifyDirection(kingMobility);

      const kingColor = defense.get(king).color;

      const attackersWithOnlyBlocker = defense.attackersWith((key, o) => {

        const sameColor = defense.get(key).color === kingColor;
        const onlyBlocker = o.blocking && o.blocking.length === 1;
        
        if (sameColor) return false;

        if (onlyBlocker) {
          const blocker = defense.get(o.blocking[0]);
          return blocker.color === kingColor;
        } else {
          return false;
        }          
      }, king, kingMobilityDirection);

      for (let key in attackersWithOnlyBlocker) {
        let o = attackersWithOnlyBlocker[key];
        let blocker = o.blocking[0];
        if (defense.hanging(blocker)) {
          return false;
        }
      }
      return true;
    };

    const final = final => final.isMate();

    const aggressive = aggressive => aggressive.isCheck();

    const collectIdea = move => {
      ideas.add(move.to);
    };

    switch (depth) {
    case 0:
      return attack(board);
    case 1:
      return defense(board);
    case 2:
      return final(board) || aggressive(board);
    case 3:
      defense(board) && collectIdea(move);
    default: return false;
    }

  };

  const mateCombination = new Combination(filters, board);
  

  mateCombination.Run();

  return Tactics.BackrankMate(mateCombination.lines(), ideas);
};

const ForcedMateSolver = (board) => {

  const ideas = new Set();

  const attack = depth => attack => attack.isMate();

  const mateCombination = new Combination(attack, board);
  mateCombination.Run();

  return Tactics.ForcedMate(mateCombination.lines(), ideas);
};

export const Tactic2Solvers = [
  RemovalOfDefenderSolver
];

export const TacticSolvers = [
  BackrankMateSolver,
  ForcedMateSolver
];
