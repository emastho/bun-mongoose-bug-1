import { pipe } from "fp-ts/function"

// const ap = f => a => f(a)

// console.log(


//     ap(x => x + 1)(5)

// )

// const a = 5
// const b = x => x + 1

// b(a)

// pipe(
//     5,
//     ap(x => x + 1),
//     console.log
// )

// x => x + 1 $ 5
// (x => x + 1)(5)
// ap(x => x + 1)(5)

// x => x + 1 $ x => x + 1 $ 5
// (x => x + 1)((x => x + 1)(5))
// ap(x => x + 1)(ap(x => x + 1)(5))

// const apR = a => f => f(a)

// 5 & x => x + 1 & x => x + 1
// apR(apR(5)(x => x + 1))(x => x + 1)

const func = x => (
    console.log(x), x
)

console.log(func(5))

// const func = x => {
//     console.log(x)
//     return x
// }

// console.log(func(5))