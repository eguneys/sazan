import { NodeTree, EdgeIterator } from './node';

export default function Combination(filters, board) {

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

      // console.log(node.toTailString());

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
    
    let lastBoard = board;

    let cur = node;
    let prev = cur.getParent();

    if (prev) {
      lastBoard = prev.getEdgeToNode(cur).getMove().after;
    }

    let legalMoves;
    const isMate = lastBoard.isMate();


    legalMoves = lastBoard.legals(filters(depth));

    if (isMate) {
      node.makeTerminal('lose');
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

    let v = 1;
    for (var n = node, p; n !== rootNode.getParent(); n = p) {
      p = n.getParent();
      
      n.finalizeScoreUpdate(v);

      if (!p) {
        break;
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
        const move = child.value().getMove();
        res[move] = step(child.value().node);
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
