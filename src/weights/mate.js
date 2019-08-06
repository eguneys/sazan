import * as util from '../util';

import { scale, sum, mul, WeightedSum, Weights, WeightsWithSized, Compose, Weight } from '../weight';

import { filterObj } from '../util2';


export default function weightMate(d) {
  
  const { after,
          before,
          afterEval,
          beforeEval,
          usKing,
          themKing,
          us,
          them } = d;

  const {
    wKingAttacks
  } = d;


  function backrankMate() {
    const king = afterEval.square(themKing);

    const freeMoves = Object.keys(
      filterObj(king.moves, (key, value) => {
        return !value.blocking;
      }));


    let wFree;

    switch(util.classifyDirection(freeMoves)) {
    case util.Direction.file:
      wFree = Weight(1);
      break;
    case util.Direction.rank:
      wFree = Weight(1);
      break;
    case util.Direction.diagonal:
      wFree = Weight(1);
      break;
    default:
      wFree = Weight(0);
    }
    

    

    return Weights({
      free: wFree
    });
  }


  return Weights({
    backrank: backrankMate()
  });
}
