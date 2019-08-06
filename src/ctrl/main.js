import positionCtrl from './position';

export default function ctrl(state, redraw) {
  this.data = state;

  this.position1 = new positionCtrl(this, this.data.position1, redraw);
  this.position2 = new positionCtrl(this, this.data.position2, redraw);

}
