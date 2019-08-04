function Strategy(name, move, evaluation, depth) {
  this.name = name;
  this.move = move;
  this.evaluation = evaluation;

}

export function Deflection(move, depth = 0) {
  const { after } = move;

  const evaluation = () => 0;

  return new Strategy('deflection', move, evaluation, depth);
}

export function ForcedMate(move, depth = 0) {
  const { after } = move;

  const evaluation = () => 1;

  if (!after.isMate()) {
    return null;
  }

  return new Strategy('forced_mate', move, evaluation, depth);
};

export function Default(move, depth = 0) {
  const evaluation = () => 0;

  return new Strategy('default', move, evaluation, depth);
}

export function NoStrategy(depth = 0) {

  const evaluation = () => -1;

  return new Strategy('none', null, evaluation, depth);
}

export const all = [
  Deflection,
  ForcedMate,
  Default
];
