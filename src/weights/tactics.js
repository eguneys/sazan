import { makeDoPosition, exists, isPin, isSkewer, isColor, isKnight, isRook } from './util';

import { mapObj } from '../util2';

import { scale, sum, mul, WeightedSum, Weights, Compose, Weight, WeightsLength, WeightsMix, WeightsArray } from './weight';

const pinWeights = {
  king: 0.4,
  queens: 0.3,
  rooks: 0.2,
  bishops: 0.05,
  knights: 0.04,
  pawns : 0.01
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

  const type = _ => _.type;
  const ev = (__, _) => _.map(afterEval.square);

  const themEval = mapObj(themPieces, ev),
        usEval = mapObj(usPieces, ev);


  const allPinsAndSkewers = (pinnerColor, colorEval) => mapObj(colorEval, (key, value) => {

    const pieceAttackedAndBlockers = value
          .flatMap(_ => {
            const d = _;
            const attacked = _.square;

            return _.attackers
              .filter(_ => isColor(pinnerColor)(after.get(_)))
              .map(afterEval.square)
              .map(_ => {

                const attacker = _.square;
                const attack = _.attacks[attacked];

                if (!attack.blocking ||
                    attack.blocking.length !== 1) {
                  return null;
                }

                const blocker = attack.blocking[0];

                return { attacker, attacked, blocker };
              }).filter(exists);
          });

    const piecePins = {},
          pieceSkewers = {};

    pieceAttackedAndBlockers.forEach(({attacker, attacked, blocker}) => {
      const values = [attacker, attacked, blocker]
            .map(after.get)
            .map(type);

      if (isPin(...values)) {
        piecePins[blocker] = [attacker, attacked];
      } else if (isSkewer(...values)) {
        pieceSkewers[blocker] = [attacker, attacked];
      }
    });

    return { pins: piecePins, skewers: pieceSkewers } ;
  });
  

  function pinsAndSkewers(pinnerColor, colorEval) {
    const allPins = allPinsAndSkewers(pinnerColor, colorEval);

    doPos('position1', 'Bd4', () => {
      console.log(allPins);
    });

    return { pins: Weight(0) };

    const wAllPins = WeightedSum(mapObj(allPins, (key, value) => {
      return [WeightsArray(value), pinWeights[key]];
    }));
    
    return { pins: wAllPins };
  }

  const psUs = pinsAndSkewers(them, usEval),
        psThem = pinsAndSkewers(us, themEval);
  
  return Weights({
    pins: Weights({
      onUs: psUs.pins,
      onThem: psThem.pins
    })
  });

}
