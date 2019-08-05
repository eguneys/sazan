import * as util from '../util';

import { scale, sum, mul, WeightedSum, Weights, WeightsWithSized, Compose, Weight } from '../weight';


export default function weightMate(d) {
  
  const { after,
          before,
          afterEval,
          beforeEval,
          usKing,
          themKing,
          us,
          them,
          kingMobility } = d;


  function backrankMate() {

    const mobility = Weights({});

    switch (util.classifyDirection(kingMobility)) {
    case util.Direction.file:
      mobility.add({ file: [Weight(1), 0.3] });
      break;
    case util.Direction.rank:
      mobility.add({ rank: [Weight(1), 0.3] });
      break;
    case util.Direction.rank:
      mobility.add({ diagonal: [Weight(1), 0.3] });
    default:
    }

    

    return Weights({
      mobility
    });
  }


  return Weights({
    backrank: backrankMate()
  });
}
