# Vanilla Node.js Express Server

Ben Turner ([@Xeus](http://twitter.com/Xeus))

## Description

Barebones Express server code with admin CRUD functions, common libs in place in the package.json as well as in the HTML HEAD.

Front-end uses [jQuery](http://jquery.com/) 1.7.1, [jQuery UI](http://jqueryui.com/) 1.8.18, and [Underscore.js](http://documentcloud.github.com/underscore/) (latest version) hosted on Google and Github.  [Keymaster.js](https://github.com/madrobby/keymaster) (from 05 May 12) also sourced in front-end.

An example [Google Web Fonts](http://www.google.com/webfonts) source is linked.

## Modules Used

    { "name": "vanillanode",
        "version": "0.0.1",
        "dependencies": {
            "express": "2.x"
          , "mongoose" : ""
          , "request" : ""
          , "ejs" : ""
          , "emailjs" : ""
          , "moment" : ""
          , "underscore" : ""
          , "mongodb" : ""
          , "connect-mongodb": ""
          , "bcrypt" : ""
          , "passport" : ""
          , "passport-local" : ""
          , "socket.io" : ""
        } }

## Credits

- [French Vanilla palette](http://www.colourlovers.com/palette/45488/french_vanilla) by [despise](http://www.colourlovers.com/lover/despise) from [colourlovers](colourlovers.com)
- John Schimmel's [Dynamic Web Dev code](http://github.com/johnschimmel/)

## Installation

Clone my git repo. Open your Terminal and go to the directory parent you want to install to.  Then type `git clone git@github.com:Xeus/Vanilla-Node.js`.

Navigate to the `./Vanilla-Node.js` directory.

See `package.json` for dependencies.  Type `npm install` to install them. Uses
MongoDB and the Heroku toolbelt.

- http://www.mongodb.org/downloads
- https://toolbelt.heroku.com/

Set up your `.env` file to include your `MONGOLAB_URI` variable, which has your
user/pass to connect to MongoDB.

It should look like this:

    MONGOLAB_URI=mongodb://username:password@127.0.0.1:27017/vanillanode

Finally, type `foreman start` to start up the node.js express server.  You could also create a bash alias like this: `alias vanilla='foreman start --env .env -f procfile.dev'` to start up the server with `.env` variables as well as use another node.js module like `forever` or `nodemon` to keep the server running/updated.

## Links

- [Github](https://github.com/Xeus/Vanilla-Node.js)

## Metadata

Last update 05 May 12: Partially done with CRUD operations, tons to fix though.

Search for "TODO:" throughout the code to find things requiring more work/fixes.
- Add Embedded Item: incomplete
- Remove Embedded Item: incomplete
- Update Item: incomplete
- Update Embedded Item: incomplete
- Admin Stats: incomplete
- JSON: complete
- Add Item: complete
- Remove Item: complete
- User auth: complete
- Login form validation: complete
- Register form validation: complete
