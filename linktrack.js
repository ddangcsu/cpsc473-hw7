/* jshint curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true, node: true */

/*
    Name: David Dang
    Section: 1
    Node.js Web Service API to keep track of links and its clicks
 */
"use strict";
// Declare a set of variables to be use
var serverPort = 3000;
var wsClick = "/click/:title";
var wsLink = "/links";

// Include the express module and initiate the app
var express = require("express");
var app = express();

// Expose GET on /links
app.get(wsLink, function (request, response) {
    console.log ("Serving GET on " + request.url);
    response.status(200).end("Serviing GET on " + request.url);
});

// Expose POST on /links
app.post(wsLink, function (request, response) {
    console.log("Serving POST on " + request.url);
    response.status(200).end("Serving POST on " + request.url);
});

// Expose GET on /click
app.get(wsClick, function (request, response) {

    var title = request.params.title;

    if (title === "google") {
        response.redirect("https://google.com");
    } else {
        response.redirect("http://yahoo.com");
    }

    console.log("Serving GET on " + request.url);
});

// Run the server on the serverPort
app.listen(serverPort);

console.log("Server is running on port " + serverPort);
