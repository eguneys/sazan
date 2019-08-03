import { deep_is, is, ok, not, log } from 'testiz/browser';

import { best_is } from './util';

import * as Strategy from '../strategy';

export default function run() {

  best_is('backrank mate #4', '6k1/3qb1pp/4p3/ppp1P3/8/2PP1Q2/PP4PP/5RK1 w - - 0 1', 'Qf7+');



  // play_is('Qxf7#', '3qk3/3ppp2/8/8/2B5/5Q2/3K4/8 w - - 0 1', 
  //         'Qxf7#');

  // play_is('Rxa1#', '8/1p6/kp6/1p6/8/8/5PPP/5RK1 w - - 0 1', 
  //         'Ra1#');

  
  // play_is('mate in 2', '2r1r1k1/5ppp/8/8/Q7/8/5PPP/4R1K1 w - - 1 3', 'Qxe8+');

  // play_is('backrank mate #4', '6k1/3qb1pp/4p3/ppp1P3/8/2PP1Q2/PP4PP/5RK1 w - - 0 1', 'Qf7+');

}




// function removeDefender() {

//   tactic_is('backrank 3', '6k1/3qb1pp/4p3/ppp1P3/8/2PP1Q2/PP4PP/5RK1 w - - 1 3',
//             [Tactics2.RemovalOfDefender(
//               {
//                 'Qf7+': {}
//               })
//             ]);
// }

// function forcedMates() {
//   // log('one move mate tactics');

//   // tactic_is('no mate', 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3', []);

//   // tactic_is('Qxf7#', '3qk3/3ppp2/8/8/2B5/5Q2/3K4/8 w - - 0 1', [new ForcedMateTactic('Qxf7#')]);

//   // tactic_is('Nf7#', '6rk/6pp/7P/6N1/8/8/3K4/8 w - - 0 1', [new ForcedMateTactic('Nf7#')]);

//   // tactic_is('Rh8#', 'R7/8/7k/2r5/5n2/8/6Q1/3K4 w - - 0 1', [new ForcedMateTactic('Rh8#')]);

//   // tactic_is('Ne8#', '2rb4/2k5/5N2/1Q6/8/8/3K4/8 w - - 0 1', [new ForcedMateTactic('Ne8#')]);

//   // tactic_is('Bxf3#', '8/pk1N4/n7/b7/1r4B1/5b2/7K/1RR5 w - - 0 1', [new ForcedMateTactic('Bxf3#')]);

//   // tactic_is('Qe7#', 'r1b5/ppp5/2N2kpN/5q2/8/Q7/7K/4B3 w - - 0 1', [new ForcedMateTactic('Qe7#')]);

 
// }

// function backrankMate() {

//   log('backrank mate');
//   tactic_is('backrank', '6k1/4Rppp/8/8/8/8/5PPP/6K1 w - - 1 3',
//             [Tactics.BackrankMate({
//               'Re8#': {}
//             }),
//              Tactics.ForcedMate({
//                'Re8#': {}
//              })
//             ]);

//   tactic_is('backrank 2', '2r1r1k1/5ppp/8/8/Q7/8/5PPP/4R1K1 w - - 1 3',
//             [Tactics.BackrankMate({
//               'Qxe8+': {
//                 'Rxe8': {
//                   'Rxe8#': {}
//                 }
//               },
//               'Rxe8+': {
//                 'Rxe8': {
//                   'Qxe8#': {}
//                 }
//               }
//             })]);


//   tactic_is('backrank file', '8/1p6/kp6/1p6/8/8/5PPP/5RK1 w - - 1 3',
//             [Tactics.BackrankMate({ 'Ra1#': {} }),
//              Tactics.ForcedMate({ 'Ra1#': {} })]);

//   tactic_is('backrank 3 helper', '7k/3qbQpp/4p3/4P3/8/8/6PP/5RK1 w - - 1 3',
//             [Tactics.BackrankMate({ 
//               'Qf8+': {
//                 'Bxf8': {
//                   'Rxf8#': {}
//                 }
//               }
//             })]);
// }
