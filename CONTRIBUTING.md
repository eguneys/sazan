
Idea
====

Define and weight ideas for a position. 

An idea with other ideas is a `WeightedSum` like this:

    // sum of all weights should be between 1 and -1
    let Idea1 = new WeightedSum({
      idea1: [Idea11, weight1],
      idea2: [Idea12, weight2]
    })


or a single idea

    // weight should be between 1 and -1
    let Idea = new Weight(weight)

Board Evaluation
=====

Use `usEval` and `themEval` to evaluate the board. `us` is color to play, `them` is the opponent.

Use `usEval.square` to get a square evaluation:

    {
      square, // the square
      holds,  // the piece on square
      moves,  // squares piece can move to
      attacks, // squares piece can attack to
      attackers // attackers to this square ['a1', 'a2']
    }

`squares` that the square can move/attack:

    {
      blocking, // squares that block the move/attack
      interpose, // squares that can interpose the move/attack
      danger // squares that attack the king when move/attack is played
    }
