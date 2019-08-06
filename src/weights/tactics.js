import { WeightedSum, Weights, Compose, Weight, WeightsLength, WeightsMix, WeightsArray } from './weight';

import weightPinsAndSkewers from './pins';
import weightForks from './forks';

export default function weightTactics(d) {
  const {
    usEval,
    themEval,
    us,
    them } = d;

  const pAndSOnUs = weightPinsAndSkewers(d, them),
        pAndSOnThem = weightPinsAndSkewers(d, us);

  return Weights({
    onUs: Weights({
      pins: pAndSOnUs.pins,
      forks: weightForks(d, them)
    }),
    onThem: Weights({
      pins: pAndSOnThem.pins,
      forks: weightForks(d, them)
    })
  });

}
