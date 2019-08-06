import { mapObj, filterObj, groupObj } from '../util2';

import * as util from '../util';

import { makeDoPosition, exists, isColor, isKnight, isRook } from './util';

import { movementVector } from '../chess/util';

import { scale, sum, mul, WeightedSum, Weights, WeightsWithSized, Compose, Weight, WeightsLength, WeightsMix } from './weight';

export default function weightMate(d) {

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

  const kingEval = afterEval.square(usPieces.king);

  const m = _ => movementVector.direction(themPieces.king, _);

  const kingMoves = m('kings'),
        kingDiagonals = m('kingDiagonals'),
        kingFiles = m('kingFiles'),
        kingRanks = m('kingRanks'),
        kingUps = m('kingUps'),
        kingDowns = m('kingDowns'),
        kingLefts = m('kingLefts'),
        kingRights = m('kingRights');


  const l = (_, l = 0) => _.length === l;


  function backrankMate() {

    const knightOnEdge = WeightsMix({
      up: l(kingUps),
      down: l(kingDowns),
      left: l(kingLefts),
      right: l(kingRights)
    });

    let opposite = [];

    if (l(kingUps)) {
      opposite = kingDowns;
    } else if (l(kingDowns)) {
      opposite = kingUps;
    } else if (l(kingLefts)) {
      opposite = kingRights;
    } else if (l(kingRights)) {
      opposite = kingLefts;
    }

    const friendlyBlocks = opposite
          .map(after.get)
          .filter(exists)
          .filter(isColor(them));

    return Weights({
      onEdge: knightOnEdge,
      friendlyBlocks: Weight(friendlyBlocks.length/3)
    });
  }

  function hookMate() {

    const knight = kingDiagonals
          .filter(_ => {
            const p = after.get(_);
            return exists(p) && isKnight(us)(p);
          });

    const protects = knight.flatMap(_ => movementVector.move(_, 'n'));

    const kingEscape = protects.filter(_ => kingMoves.indexOf(_)!== -1);

    const hasARook = kingEscape
          .map(after.get)
          .filter(exists)
          .filter(isRook(us));

    return WeightsLength({
      knight,
      protects,
      kingEscape,
      hasARook
    });
  }


  return Weights({
    backrank: backrankMate(),
    hook: hookMate()
  });
}
