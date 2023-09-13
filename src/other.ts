let app = []

app.push({
    method: "get",
    route: "/",
    handler: (req: Request) => {
        return new Response("hey")
    }
})

createServer(app)