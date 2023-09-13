
const context = () =>
  new Promise<{}>((resolve) => resolve({ something: true }));

const second = (context: {}) =>
  new Promise<string>((resolve) => resolve("url"));

const third = (context: {}) => (url: string) =>
  new Promise<string>((resolve) => resolve("code"));

const fourth = (context: {}) => (code: string) =>
  [code, context] as [string, {}];


const chain = (ctx: {}) =>
  second(ctx) //
    .then(third(ctx))
    .then(fourth(ctx));

const program = async () => {
  const thingy = await chain(await context());
  console.log(thingy);
};

program();
