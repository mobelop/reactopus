const path = require("path");

module.exports = require('@reactopus/webpack')({
    webAppPath: path.resolve(__dirname + "/client/", "entry.tsx"),
    cwd: process.cwd()
})
