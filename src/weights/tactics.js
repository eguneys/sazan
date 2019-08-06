import { makeDoPosition, exists, isColor, isKnight, isRook } from './util';

import { mapObj } from '../util2';

import { scale, sum, mul, WeightedSum, Weights, Compose, Weight, WeightsLength, WeightsMix, WeightsArray } from './weight';

const pinWeights = {
  king: 0.4,
  queens: 0.3,
  rooks: 0.2,
  bishops: 0.05,
  knights: 0.04,
  pawns: 0.01
};

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


  const ev = (__, _) => _.map(afterEval.square);

  const themEval = mapObj(themPieces, ev),
        usEval = mapObj(usPieces, ev);

  function pins(sideEval) {

    const allPins = mapObj(sideEval, (key, value) => {

      const piecePins = value
            .flatMap(_ => {
              const attacked = _.square;
              return _.attackers
                .map(afterEval.square)
                .flatMap(_ => {
                  const attack = _.attacks[attacked],
                        blocking = attack.blocking?
                        attack.blocking:[];

                  return blocking
                    .filter(_ => 
                      isColor(them)(after.get(_))
                    );
                });
            });
      return piecePins;
    });
    
    const wAllPins = WeightedSum(mapObj(allPins, (key, value) => {
      return [WeightsArray(value), pinWeights[key]];
    }));

    doPos('backrankMate1', 'Kf1', () => {
      console.log(wAllPins);
    });



    
    return wAllPins;
  }
  

  return Weights({
    pins: Weights({
      us: pins(usEval),
      them: pins(themEval)
    })
  });

}
