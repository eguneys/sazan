import { NodeTree, EdgeIterator } from './node';

export default function Combination(filters, board, startDepth = 0) {

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

      if (node.isTerminal || !node.hasChildren()) {
        return Visit(node, depth);
      }

      depth++;

      nodeAlreadyUpdated = false;

      var best = -Infinity;

      for (var child of node.edges().range()) {
        const score = -child.value().getN();

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

    if (lastMove && lastMove.terminate) {
      node.makeTerminal('win');
      return;
    }

    if (lastBoard.isMate()) {
      node.makeTerminal('win');
      return;
    }

    let legalMoves = lastBoard.mapLegals(filters(depth));

    if (legalMoves.length === 0) {
      node.makeTerminal('win');
      return;
    }

    node.createEdges(legalMoves);
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
    
  };


  const doBackupUpdate = () => {
    for (var nodeToProcess of minibatch) {
      doBackupUpdateSingleNode(nodeToProcess);
    }
  };

  const doBackupUpdateSingleNode = (nodeToProcess) => {
    let node = nodeToProcess.node;

    let canConvert = node.isTerminal;

    let v = 1;
    for (var n = node, p; n !== rootNode.getParent(); n = p) {
      p = n.getParent();
      
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
  };
  

  const executeOneIteration = () => {
    initializeIteration();

    gatherMinibatch();

    fetchMinibatchResults();

    doBackupUpdate();
  };

  this.Run = () => {
    for (var i = 0; i < 30; i++) {
      executeOneIteration();
    }
  };

  this.lines = () => {
    function step(node) {
      var res = {};
      if (!node) {
        return res;
      }

      for (var child of node.edges().range()) {
        const { move, terminate, include } = child.value().getMove();
        const node = child.value().node;
        if (node && node.isTerminal) {
          res[move] = step(node);
        }
      }
      return res;
    }
    return step(rootNode);
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

export function Continue(include) {
  return (move) => {
    return new CombinationResult(move, false, include);
  };
}

export function Terminate(include) {
  return (move) => {
    return new CombinationResult(move, true, include);
  };
}

function CombinationResult(move, terminate, include) {
  this.move = move;
  this.terminate = terminate;
  this.include = include;

  this.toString = () => {
    return this.move.uci;
  };
}
