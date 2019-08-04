import { Tactics } from '../solvers';

import Combination from '../combination';

import { Continue, Terminate } from '../combination';

import * as util from '../util';

const BackrankMateSolver = (board, startAtDepth = 0) => {
  const ideas = new Set();

  const filters = depth => (board, move) => {
    // const attack = attack => {
    //   const kingMoves = attack.moves(attack.king());
    //   return kingMoves.length === 0;
    // };
    const attack = attack => attack.isCheck();

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
      if (final(board)) {
        return Terminate(true);
      } else {
        return Continue(attack(board));
      }
    case 1:
      return Continue(defense(board));
    case 2:
      if (final(board)) {
        return Terminate(true);
      } else {
        return Continue(aggressive(board));
      }
    case 3:
      defense(board) && collectIdea(move);
      return Terminate(false);
    default: 
      throw new Error("Unreachable depth reached");
    }

  };

  const mateCombination = new Combination(filters, board, startAtDepth);
  
  mateCombination.Run();

  return Tactics.BackrankMate(mateCombination.lines(), ideas);
};

export default BackrankMateSolver;
