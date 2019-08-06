const mates = {
  backrankMate1: { fen: '6k1/4Rppp/8/8/8/8/5PPP/6K1 w - - 0 1', move: 'Re8#' },
  backrankMate2: { fen: '2r1r1k1/5ppp/8/8/Q7/8/5PPP/4R1K1 w - - 0 1', move: 'Rxe8+' },
  backrankMate4: { fen: '6k1/3qb1pp/4p3/ppp1P3/8/2PP1Q2/PP4PP/5RK1 w - - 0 1', move: 'Qf7+' },
  hookMate1: { fen: 'R7/4kp2/5N2/4P3/8/8/8/6K1 w - - 0 1', move: 'Re8#' },
  hookMate3: { fen: '5r1b/2R1R3/P4r2/2p2Nkp/2b3pN/6P1/4PP2/6K1 w - - 0 1', move: 'Rg7+' },
  hookMate4: { fen: '2b1Q3/1kp5/p1Nb4/3P4/1P5p/p6P/K3R1P1/5q2 w - - 0 1', move: 'Qxc8+' }
};

const pins = {
  absolute1: { fen: '7k/8/8/4n3/4P3/8/8/6BK w - - 0 1', move: 'Bd4' },
  absolute2: { fen: '5k2/p1p2pp1/7p/2r5/8/1P3P2/PBP3PP/1K6 w - - 0 1', move: 'Ba3' }
};

const tactics = {
  ...pins
};

const li = {
  ...mates,
  ...tactics
};

export default li;
