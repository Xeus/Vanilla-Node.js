
/* Module dependencies. */
var db = require('../accessDB');
var _ = require('underscore');

module.exports = {

    // app.get('/'...)
    // userRoute.index
    index: function(request, response) {
      
        templateData = {}
        response.render('index.html', templateData);
    },

    about: function(request, response) {

        // will show admin nav edit links if logged in
        if (request.user) { var loggedIn = true; } else { var loggedIn = false; }
        
        var templateData = {
            pageTitle : "What's All This About?",
            admin : false,
            loggedIn : loggedIn
        };

        response.render("about.html", templateData);
    }

};