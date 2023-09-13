import { pipe } from "fp-ts/function";
import * as R from "fp-ts/Reader";
import * as S from "fp-ts/State";
import * as O from "fp-ts/Option"

// const one = (x: number): S.State<string, number> => s => [x + 1, s + "!"]

// const d = pipe(5, one, S.chain(one))
// console.log(d("initial"))

// const fraction: (numerator: number) => R.Reader<ReaderConfig, number> =
//   (numerator) => (config) =>
//     numerator / config.denominator;

// const fractionThreeTimes = (numerator: number) =>
//   pipe(numerator, fraction, R.chain(fraction), R.chain(fraction));

// console.log(fractionThreeTimes(10)({ denominator: 2 }));

// const fraction: (numerator: string) => S.State<string, string> =
// (numerator) => (s) =>
// [s, numerator + "!"];

// const mewo = pipe("mewo", fraction)("heo");

// console.log(mewo);

// const statie = () => "meow"

// const statie = () => {
//   ok: true
// }

// const someting: S.State<string, string> = (s) => ["", s + "!"];

// const teoder: S.State<string, string> = (s) => {
//   console.log(s);
//   return ["", s + "!"];
// };

// const emow = pipe(
//   someting,
//   S.chain(() => teoder)
// )("state");

function unknown(): O.Option<string> {
    if (Math.round(Math.random())) {
        return O.some("aha")
    } else {
        return O.none
    }
}

pipe(
    unknown(),
    x => {
        switch (x._tag) {
            case "Some":
                `wow thats some ${x.value}`
            case "None":
                `uh oh, none`
        }
    }
)
