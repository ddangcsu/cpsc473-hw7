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

// Include body parser
var parser = require("body-parser");
app.use(parser.json());

// Require hw7 module
var mongoose = require("mongoose");
var dbName = "hw7";
var dbUri = "mongodb://localhost/"  + dbName;

// Define the schema and create a model for it
var siteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true},
    link: String,
    click: Number,
});
// Create the model
var Site = mongoose.model("Site", siteSchema);

// Make connection to Mongodb
mongoose.connect(dbUri);
mongoose.connection.once("open", function () {
    console.log("Database open successfully for DB:" + dbName);
});

// Expose GET on /links
app.get(wsLink, function (request, response) {
    console.log ("Serving GET on " + request.url);

    // Query for all links and exclude the field _id and __v from result
    var query = {};
    var exclude = {_id:0, __v:0};
    Site.find(query).select(exclude).exec(function (err, sites) {
        if (err) {
            console.log("Error finding links: " + err);
            response.status(500).end("Error encountered search");
        } else {
            response.status(200).json(sites).end();
        }
    });

});

// Expose POST on /links
app.post(wsLink, function (request, response) {
    console.log("Serving POST on " + request.url);
    if (! request.hasOwnProperty("body")) {
        console.log("Error: Missing body-parser module or is not configured");
        response.status(500).end("Missing configured");
    }

    try {
        // Initialize a new site to save
        var site = new Site();
        site.title = request.body.title;
        site.link = request.body.link;
        site.click = 0;

        // save it
        site.save(function (err) {
            if (err) {
                console.log("Error saving site" + err);
                response.status(500).end("Error post encountered");
            } else {
                console.log("Save successful");
                response.status(200).json({status:"success"}).end();
            }
        });
    } catch (err) {
        console.log("Error encounter: " + err);
        response.status(500).end("Error post encountered");
    }

});

// Expose GET on /click
app.get(wsClick, function (request, response) {
    var query;
    var updateClick = {$inc: {click: 1}};

    // Retrieve the title clicked
    if (request.params.title !== "undefine") {
        query = {title: request.params.title};
    } else {
        console.log("Missing title");
        response.status(400).end("Missing title");
    }

    // Query the database, update the click by 1 then redirect
    Site.findOneAndUpdate(query, updateClick, function(err, site) {
        if (err) {
            console.log("Error trying to increase click: " + err);
            response.status(500).end("Error encountered");
        } else if ( site === null) {
            // Not found
            console.log("No data for title: " + query.title);
            response.status(400).end("Invalid request. No such title");
        } else {
            // We are good to redirect here
            response.redirect(site.link);
        }
    });

});

// Run the server on the serverPort
app.listen(serverPort);

console.log("Server is running on port " + serverPort);
