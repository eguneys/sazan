

How to play
=

Play is to filter possible moves with the play hint

Hints are filter functions that filters possible moves.

Play hint, backrankMate hint

Mate hint, filters moves that mates.

Backrank mate hint, if backrank is weak, control the rank squares hint.
Control the rank squares hint, for all squares control the square
Control the square hint, if hanging return false otherwise deflect the square hint.
deflect the square hint, for defender squares [capture the square hint, attack the square hint]

capture the square hint, filters moves that captures the square
attack the square hint, filters moves that attacks the square
move to the square hint, filters moves that moves to the square

In [this situation](6k1/3qb1pp/4p3/ppp1P3/8/2PP1Q2/PP4PP/5RK1 w - - 0 1), Hint is to take f8 square but it's not hanging, so a child hint is to deflect a black piece from it's defense in this case it's bishop or the king.

Deprecated Ideas
=

~
A strategy is a move that has an evaluation, and ideas.

Given a position, to play, find an opponent strategy if possible (by calling Play on the same position with opponent to act) and return a favorable strategy hinted by opponent's strategy. If making an opponent strategy is not possible (king is in check, or maximum depth is reached), return a favorable strategy with no hint.

A favorable strategy with a hint is, from all possible moves filtered by the hint; make a strategy for each move and return the strategy where opponent counter strategy (found by calling Play on the position after making the move) has the lowest evaluation, or if the maximum depth is reached return the first strategy.

Given a move, a strategy is made by, using pattern search against the position after making the move.
~

~
In this [position](https://lichess.org/practice/checkmates/checkmate-patterns-i/fE4k21MW/EiaJcoV6)
How to find `Qf7+` with the tactic `Removal of the defender of f8 square`. Or if `Removal of the defender of d8 square` tactic works, this line could be achieved `Qa8+ Bd8 Qxd8#`.

Tactics will try lines where the idea is executed even though it doesn't work. For example for Backrank mate tactic, a check on the back rank will be tried even though it results in a capture, or block. This line will give the relevant square idea for the tactic Removal of the defender of relevant square.
~

Special Thanks
=

Varuzhan Akobian for [SLCC lectures](https://www.youtube.com/watch?v=YT4M1u1c3ok)
[lichess](lichess.org)
[chesstempo](chesstempo.com)
