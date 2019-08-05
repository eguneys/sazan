export default function ctrl(state, redraw) {
  this.data = state;

  this.data.move1 = makeMove(this.data.weights.w1);
  this.data.move2 = makeMove(this.data.weights.w2);

  this.groundConfig = {
    fen: this.data.fen
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
      node.collapsed = depth > 3;
    }

    return node;
  }
}
