module.exports = {
    servers: [
        {
            url: "http://localhost:5000/api", // url
            description: "Local server", // name
        },
        {
            url: "https://survival-book.herokuapp.com/api", // url
            description: "Release test server", // name
        },
        {
            url: "http://62.113.96.206:5000/",
            description: "Release server",
        }
    ],
}