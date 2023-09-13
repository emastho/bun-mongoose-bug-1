import vixeny from "vixeny/fun";

const seed = "123123"

const app = vixeny()
    ([
        // A simple "Hello World" petition
        {
            path: "/",
            f: () => "Hello world"
        },
        // Petitions imported from other modules using the spread operator 
    ])

export default {
    port: 3000,
    hostname: "127.0.0.1",
    fetch: app

}
