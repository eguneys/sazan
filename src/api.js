export default function start(ctrl, redraw) {
  return {
  };
}

function anim(state, mutate) {
  const resultP = mutate(state);

  state.redraw();

  return resultP;
}
