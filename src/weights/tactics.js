import { makeDoPosition, exists, isColor, isKnight, isRook } from './util';

import { mapObj } from '../util2';

import { scale, sum, mul, WeightedSum, Weights, WeightsWithSized, Compose, Weight, WeightsLength, WeightsMix } from '../weight';

export default function weightTactics(d) {
  
    const {
      opts,
      move,
      after,
      afterEval,
      beforeEval,
      usPieces,
      themPieces,
      us,
      them } = d;

  const doPos = makeDoPosition(opts.position, move);


  const ev = _ => afterEval.square(_);

  const themEval = mapObj(themPieces, ev),
        usEval = mapObj(usPieces, ev);

  function pins() {

    const king = themEval.king;

    

    
    return Weight(0);
  }
  

  return Weights({
    pins: pins()
  });

}
