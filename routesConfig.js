var passport = require('passport');

// Route methods

var mainRoute = require('./routes/main');
var adminRoute = require('./routes/admin');
var jsonRoute = require('./routes/json');
var userRoute = require('./routes/user');

// If user is authenticated, redirect to 
function ensureAuthenticated(request, response, next) {
  if (request.isAuthenticated()) { return next(); }

  request.flash("redirect",request.originalUrl);
  response.redirect('/login');
}

module.exports = function(app) {
    
    // ROUTES: main.js
    app.get('/', mainRoute.index);
    app.get('/about', mainRoute.index);
   
    
    // ROUTES: admin.js
    app.get("/admin", adminRoute.admin);
    // CRUD
    app.get("/admin/items/edit", adminRoute.editAllItems);
    app.get("/admin/items/:itemID", adminRoute.showItem);
    app.get("/admin/items/:itemID/edit", adminRoute.editItem);
    app.post('/admin/items/add', adminRoute.addItem);
    app.post('/admin/items/addEmbed', adminRoute.addEmbed);
    app.post("/admin/items/update", adminRoute.updateItem);
    app.post("/admin/items/updateEmbed", adminRoute.updateEmbed);
    app.post('/admin/items/delete', adminRoute.deleteItem);
    app.get('/admin/reset', adminRoute.reset);
    app.get('/admin/list', adminRoute.displayList);
    app.get('/admin/belongs', adminRoute.belongs);


    // ROUTES: json.js
    app.get('/items/json', jsonRoute.jsonItems);
    app.get('/all/json', jsonRoute.jsonAll);



    // ROUTES: user.js
    app.get('/register', userRoute.getRegister); // Register User - display page
    app.post('/register', userRoute.postRegister); //Register User - receive registration post form
    app.get('/login', userRoute.login); // Display login page
    // Login attempted POST on '/local'
    // Passport.authenticate with local email and password, if fails redirect back to GET /login
    // If successful, redirect to /account
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        function(request, response) {
            if (request.param('redirect') != "") {
                //redirect to page that initiated Login request
                response.redirect( request.param('redirect') );
            } else {
                response.redirect('/account');
            }
            //response.redirect('/account');
    });
    app.get('/account', ensureAuthenticated, userRoute.getAccount); // Display account page
    app.post('/account/changepassword', ensureAuthenticated, userRoute.postChangePassword),
    app.get('/logout', userRoute.logout); // Logout user
    app.get('/getusers', userRoute.getUsers);
    
}