
/* Module dependencies. */
var db = require('../accessDB');

module.exports = {

    // JSON REST blahblah for flows
    jsonItems: function(request, response){

        // define the fields you want to include in your json data
        includeFields = ['_id','itemName','itemDesc','itemType','itemCost','itemCalories','itemAdded'];

        // query for all blog
        queryConditions = {}; //empty conditions - return everything
        var query = db.Items.find( queryConditions, includeFields);

        query.sort('date',-1); //sort by most recent
        query.exec(function (err, items) {

            // render the card_form template with the data above
            jsonData = {
              'status' : 'OK',
              'JSONtitle' : 'All Items',
              'items' : items
            };

            response.json(jsonData);
        });
    }

};