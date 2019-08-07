Project
=

Sazan is about evaluating a chess position like a human, identifying situations such as openings, tactics, and other ideas. It also weights possible moves, and gives the best move. It doesn't use an engine, in fact it could be used to make an engine. It only relies on [chess.js](https://github.com/jhlywa/chess.js).

Goals
=

One goal is to find tactics that involve 7-8 move combinations.

Another goal is to find strong moves and play decent.

I try to avoid searching deep move trees. But weight specific ideas for the position, and possibly limit the search based on these ideas or don't search at all.

Inspiration is that humans can't search like engines, but can find the best moves with limited calculation capacity. If an engine could think like a human and filter correct moves, it could play like a human without making a mistake. Also it would comment on the position like a human.

https://www.reddit.com/r/chess/comments/cjqif5/is_it_possible_to_make_a_software_that_can/

Answers
=

* https://chess.stackexchange.com/questions/25046/can-it-be-useful-for-a-player-block-with-a-hanging-piece-in-a-back-rank-mate-sitt2
* https://chess.stackexchange.com/questions/25081/is-it-still-back-rank-mate-when-there-arent-friendly-pieces-blocking
* https://chess.stackexchange.com/questions/25052/hanging-square-and-deflection-tactic-leading-to-a-back-rank-checkmate

Thanks
=

* Varuzhan Akobian for [SLCC lectures](https://www.youtube.com/watch?v=YT4M1u1c3ok)
* [lichess](lichess.org)
* [chesstempo](chesstempo.com)
