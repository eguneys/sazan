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
  constructor(name) {
    this.name = name;
  }
}

class SimpleTactic extends Tactic {
  constructor(name, combination) {
    super(name);
    this.combination = combination;
  }
}

class StrategicTactic extends SimpleTactic {
  constructor(name, combination, sequel) {
    super(name, combination);
    this.sequel = sequel;
  }
}

export const Tactics = {
  BackrankMate(combination) {
    return new SimpleTactic('backrankMate', combination);
  },
  ForcedMate(combination) {
    return new SimpleTactic('forcedMate', combination);
  }
};

export const Tactics2 = {
  RemovalOfDefender(combination, sequel) {
    return new StrategicTactic('removalOfDefender', combination, sequel);
  }
};

export const Tactic2Solver = {
  removalOfDefender(board) {
    
  }
};

export const TacticSolver = {
  solve(board) {
    return TacticSolvers
      .flatMap(_ => _(board))
      .filter(_ => !!_);
  }
};

export const TacticSolvers = [
  (board) => {
    const filters = depth => board => {
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

      switch (depth) {
      case 0:
        return attack(board);
      case 1:
        return defense(board);
      case 2:
        return final(board);
      default: return false;
      }

    };

    const mateCombination = new Combination(filters, board);
    

    mateCombination.Run();

    return nullIfEmpty(mateCombination.lines(), Tactics.BackrankMate);
  },
  (board) => {
    const attack = depth => attack => attack.isMate();

    const mateCombination = new Combination(attack, board);
    mateCombination.Run();
    
    return nullIfEmpty(mateCombination.lines(), Tactics.ForcedMate);
  }
];
