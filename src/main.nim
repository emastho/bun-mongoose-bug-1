import Runtime

struct User {
    id Int
    name String
}

users : List User
users = [
    {
        id 0;
        name "John"
    },
    {
        id 1;
        name "Rick"
    }
]



main : IO String
main =
    users
    map Runtime.print