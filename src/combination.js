import { NodeTree, EdgeIterator } from './node';

import play from './play';

export default function Combination(board) {

  let minibatch = [];
  
  const tree = new NodeTree();
  tree.resetToPosition(board, []);

  const rootNode = tree.getCurrentHead();

  const pickNodeToExtend = () => {
    let node = rootNode,
        bestEdge;

    let depth = 0,
        nodeAlreadyUpdated = true;

    let possibleMoves = 0;

    while (true) {

      if (!nodeAlreadyUpdated) {
        node = bestEdge.getOrSpawnNode(node);
      }

      depth++;

      if (node.isTerminal || !node.hasChildren()) {
        return Visit(node, depth);
      }

      nodeAlreadyUpdated = false;

      const cpuct = 1;
      const puctMult = 
            cpuct * Math.sqrt(Math.max(node.getChildrenVisits(), 1));
      var best = -Infinity;
      const fpu = 1;

      for (var child of node.edges().range()) {
        const Q = child.value().getQ(fpu);
        const score = child.value().getU(puctMult) + Q;
        if (score > best) {
          best = score;
          bestEdge = child;
        }
      }
    }
  };

  const extendNode = (nodeToProcess) => {
    const { node, depth } = nodeToProcess;
    
    let lastMove;
    let lastBoard = board;

    let cur = node;
    let prev = cur.getParent();

    if (prev) {
      lastMove = prev.getEdgeToNode(cur).getMove();
      lastBoard = lastMove.move.after;
    }

    if (lastBoard.isMate()) {
      node.makeTerminal('win');
      return;
    }

    let { values } = play(lastBoard);

    node.createEdges(values);
  };

  const initializeIteration = () => {
    minibatch = [];
  };
  
  const gatherMinibatch = () => {
    minibatch.push(pickNodeToExtend());
    const pickedNode = minibatch.slice(-1)[0];

    if (pickedNode.isExtendable()) {
      extendNode(pickedNode);
    }
  };

  const fetchMinibatchResults = () => {
    for (var nodeToProcess of minibatch) {
      fetchSingleNodeResult(nodeToProcess);
    }
  };

  const fetchSingleNodeResult = (nodeToProcess) => {
    const { node } = nodeToProcess;
    nodeToProcess.v = node.getQ();

    if (node.getParent()) {
      nodeToProcess.v = node.getOwnEdge().getMove().v;
    }

    let total = 0;
    for (var iEdge of node.edges().range()) {
      var edge = iEdge.value();
      var p = edge.getMove().v;
      edge.edge.setP(p);
      total += edge.getP();
    }


    if (total > 0) {
      const scale = 1 / total;
      for (iEdge of node.edges().range()) {
        edge = iEdge.value();
        edge.edge.setP(edge.getP() * scale);
      }
    }
  };


  const doBackupUpdate = () => {
    for (var nodeToProcess of minibatch) {
      doBackupUpdateSingleNode(nodeToProcess);
    }
  };

  const doBackupUpdateSingleNode = (nodeToProcess) => {
    let node = nodeToProcess.node;

    let canConvert = node.isTerminal;


    let v = nodeToProcess.v;
    for (var n = node, p; n !== rootNode.getParent(); n = p) {
      p = n.getParent();

      if (n.isTerminal) {
        v = n.getQ();
      }

      n.finalizeScoreUpdate(v);

      if (!p) {
        break;
      }

      canConvert = canConvert && p != rootNode && !p.isTerminal;

      if (canConvert) {
        for (var iEdge of p.edges().range()) {
          var edge = iEdge.value();
          canConvert = canConvert && edge.isTerminal();
        }
      }

      if (canConvert) {
        p.makeTerminal('win');
      }
    }
    console.log(node.toTailString(), n.getQ());
    if (node.getParent()) {
      console.log(node.getOwnEdge().getMove().move.uci);
    }
  };
  

  const executeOneIteration = () => {
    initializeIteration();

    gatherMinibatch();

    fetchMinibatchResults();

    doBackupUpdate();
  };

  this.Run = () => {
    for (var i = 0; i < 100; i++) {
      executeOneIteration();
    }
  };

  this.lines = () => {
    const edges = [];

    console.log(rootNode.toShortString(10));

    for (var iEdge of rootNode.edges().range()) {
      var edge = iEdge.value();
      edges.push({ n: edge.getN(), q: edge.getQ(0), p: edge.getP(), value: edge });
    }
    edges.sort((a, b) => {
      let n = b.n - a.n,
          p = n;

      if (p === 0) {
        p = b.q - a.q;
        if (p === 0) {
          p = b.p - a.p;
        }
      }
      return p;
    });

    edges.reduce((acc, edge) => {
      if (edge.q > acc.mq) {
        return acc;
      }
      return { mq: edge.q };
    }, { mq: 1 });

    var res = edges.map(_ => _.value.getMove());
    return res;
  };
}

function Visit(node, depth) {
  return new NodeToProcess(node, depth, false);
}

function Collision(node, depth) {
  return new NodeToProcess(node, depth, true);
}

function NodeToProcess(node, depth, isCollision) {

  this.node = node;

  this.depth = depth;

  this.nnQueried = false;

  this.isExtendable = () => {
    return !isCollision && !node.isTerminal;
  };
  this.isCollision = () => {
    return isCollision;
  };
}
