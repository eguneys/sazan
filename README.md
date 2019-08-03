

How to play
=

A strategy is a move that has an evaluation, and ideas.

Given a position, to play, find an opponent strategy if possible (by calling Play on the same position with opponent to act) and return a favorable strategy hinted by opponent's strategy. If making an opponent strategy is not possible (king is in check, or maximum depth is reached), return a favorable strategy with no hint.

A favorable strategy with a hint is, from all possible moves filtered by the hint; make a strategy for each move and return the strategy where opponent counter strategy (found by calling Play on the position after making the move) has the lowest evaluation, or if the maximum depth is reached return the first strategy.

Given a move, a strategy is made by, using pattern search against the position after making the move.

Consider
=

Choosing a strategy among multiple strategies in favorable strategy


Deprecated
=
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
