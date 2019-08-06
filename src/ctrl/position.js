import play from '../play';
import Board from '../board';

function makeStorage(name) {
  return {
    get() {
      return window.localStorage.getItem(name);
    },
    set(value) {
      window.localStorage.setItem(name, value);
    }
  };
}


export default function ctrl(ctrl, position, redraw) {
  this.posStore = makeStorage(position);
  if (!this.posStore.get()) {
    this.posStore.set('hookMate3');
  }
  
  this.position = this.posStore.get();

  this.data = {
    li: ctrl.data.li
  };

  const init = () => {
    evaluatePosition();
  };

  this.fen = () => {
    return this.data.li[this.position].fen;
  };

  this.move1 = () => {
    return this.data.li[this.position].move;
  };

  this.setPosition = (key) => {
    this.posStore.set(key);
    this.position = key;

    evaluatePosition();
    if (this.ground) {
      this.setGround(this.ground);
    }
    redraw();
  };

  this.setGround = (ground) => {
    this.ground = ground;
    this.ground.set({
      fen: this.fen()
    });
  };

  const evaluatePosition = () => {
    const board = new Board(this.fen()),
          p = play(board, 0, { position });

    let w2,
        w1 = p.weights
        .filter(_ => _.uci === this.move1())[0];

    w2 = p.best;

    if (!w1 || !w2) {
      throw new Error("Can't find moves");
    }

    this.data.move1 = makeMove(w1);
    this.data.move2 = makeMove(w2);
  };

  this.toggle = (node) => {
    node.collapsed = !node.collapsed;
    redraw();
  };

  function makeMove(m) {
    let root = m.w.json();

    richWeight(root);

    return {
      uci: m.uci,
      root
    };
  }

  function richWeight(node, depth = 0) {
    if (node.children) {
      for (var key in node.children) {
        richWeight(node.children[key], depth + 1);
      }
      node.collapsed = depth > 2 || node.w < 0.01;
    }

    return node;
  }

  init();
}
