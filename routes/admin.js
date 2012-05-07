// TODO: learn how to use response.send, response.flash
// TODO: just use json feed?
// TODO: instead of partials, use JS templating?

/* Module dependencies. */
var db = require('../accessDB');

module.exports = {

    // ******** ADMIN STUFF *************
    // admin stuff all below

    admin: function(request, response) {
        db.Items.find({}, {}, { sort: { menuName : 'ascending' } }, function (err, items) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }
            else {
                var itemTypeList = ['Beer','Food','Liquor','Wine'];

                templateData = {
                    pageTitle : "Admin Dashboard",
                    items : items,
                    itemTypeList : itemTypeList
                };
                response.render('admin_dashboard.html', templateData);

            }
        });
    },

    // will refresh list of items in alphabetical order
    displayList: function(request, response) {
        db.Items.find({}, {}, { sort: { itemName : 'ascending' } }, function (err, items) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }
            else {
                templateData = {
                    items : items
                };
                response.render('item_list.html', templateData);
            }
        });
    },

    addItem: function(request, response) {
        console.log("additem fired");
        // Prepare the blog post entry form into a data object
        var itemData = {
            itemName : request.body.itemName,
            itemCost : request.body.itemCost,
            itemDesc : request.body.itemDesc,
            itemCalories : request.body.itemCalories,
            itemType : request.body.itemTypeList
        };

        // create a new menu item
        var item = new db.Items(itemData);

        // save the item
        item.save();
        
        if (request.xhr) {
            response.json({
                status : 'OK',
                msg : 'New item added!'
            });
        }
        else {
            response.render('/menu');
        }

    },

    addEmbed: function(request, response) {

        db.Items.findOne({_id : request.body.embedList}, function(err, items){
            // Prepare the blog post entry form into a data object
            var embedCost = request.body.embedCost;
            if (embedCost == null || embedCost == "undefined" || embedCost == "") {
                embedCost = 0;
            }
            var embedData = {
                embedName : request.body.embedName,
                embedCost : embedCost,
                embedDesc : request.body.embedDesc
            };

            // create a new option
            var embedItem = new db.Embeds(embedData);

            // save the item
            items.embeds.push(embedItem);
            items.save();
            
            if (request.xhr) {
                response.json({
                    status : 'OK',
                    msg : "New embed added!"
                });
            }
        });

    },

    deleteItem: function(request, response) {
        console.log(response);
        db.Items.findOne({ _id : request.body.itemID }, function (err, delItem) {
            console.log("fired");
            if (err) {
                //an error occurred
                console.log("Failed to remove item.");
            }
            else {
                db.Items.remove({ "_id" : delItem._id }, function (err, success) {
                    if (err) {console.log("Failed to remove item.");}
                    else {
                        response.json({
                            status : 'OK',
                            msg : 'Item deleted.'
                        });
                        console.log(response);
                    }
                });
            }
        
        });
    },

    deleteEmbed: function(request, response) {
        console.log(response);
        db.Embeds.findOne({ _id : request.body.embedID }, function (err, delEmbed) {
            console.log("fired");
            if (err) {
                //an error occurred
                console.log("Failed to remove embed.");
            }
            else {
                db.Embeds.remove({ "_id" : delEmbed._id }, function (err, success) {
                    if (err) {
                        response.json({
                            status : 'FAIL',
                            msg : 'There was an error deleting the embed.'
                        });
                    }
                    else {
                        response.json({
                            status : 'OK',
                            msg : 'Embed deleted.'
                        });
                    }
                });
            }
        
        });
    },

    // edit one flow via ajax
    editItem: function(request, response) {
        db.Items.findOne({ itemID: request.params.itemID }, function (err, items) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
                console.log(err);
            }
            else {
                if (request.xhr) {
                    response.json({
                        status :'OK'
                    });
                }
                else {
                    request.flash('updated', 'Item updated!');
                }
            }
        });
    },

    // edit one flow via ajax
    belongs: function(request, response) {
        db.Items.find({}, function (err, items) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
                console.log(err);
            }
            else {
                if (request.xhr) {
                    var templateData = {
                        layout : false,
                        items : items
                    };
                    response.partial('belongs.html', templateData);
                }
                else {
                    response.render('/admin');
                }
            }
        });
    },

    // updates one flow via ajax
    updateItem: function(request, response) {
        var requestedItem = request.body.data.itemID;

        // find the requested document
        db.Item.findOne({ itemID: requestedItem }, function(err, item) {
            if (err) {
                //an error occurred
                console.log("Something went wrong!");
                console.log(err);
            }
            else if (item === null ) {
                console.log('Item not found.');
                response.send("Uh oh, can't find that item.");
            }
            else {
                var newData = request.body.data;
                item.itemName = newData.itemName;
                item.itemDesc = newData.itemDesc;
                item.itemCost = newData.itemCost;
                item.itemCalories = newData.itemCalories;
                item.save(function(err) {
                    if (err) { console.log(err); }
                    else if (request.xhr) {
                        response.json({
                            status : 'OK',
                            msg : 'Item updated!'
                        });
                    }
                });
            }
        });

    },

    updateEmbed: function(request, response){
        var itemID = request.body.itemID;
        var embedID = request.body.embedID;

        db.Items.findById(itemID, function(err, items) {
            if (err) { console.log(err); }
            else {
                for (var i=0;i<items.embeds.length;i++) {
                    if (items.embeds[i].embedName == request.body.embedOld) {
                        var newCost = parseFloat(request.body.optionCost);
                        items.embeds[i].embedName = request.body.embedName;
                        items.embeds[i].embedDesc = request.body.embedDesc;
                        items.embeds[i].embedCost = newCost;
                    }
                }
                items.markModified("embeds");
                items.save(function(err) {
                    if (err) { console.log(err); }
                    else if (request.xhr) { // if request sent via AJAX
                        console.log("Update succeeded.");
                        response.json({
                            status : "OK",
                            msg : "Embed updated!"
                        });
                    }
                });
            }
        });

    },

    reset : function(request, response) {
        
        //reset the main processing document
        // this example app uses a single document named 'main'
        // each time Processing opens, we will reset this document for example purposes only.
        
        var conditions = { name: 'main' }
        var options = { upsert: true, multi: false };
          
        var theCircles = [];
        theCircles.push({
              color : 'FF0000'
            , xpos : 10
            , ypos : 10
            , size : 10
        });

        theCircles.push({
              color : '000FF0'
            , xpos : 45
            , ypos : 100
            , size : 30
        });
        
        
        
        var updateData = {
            name : 'main',
            circles : theCircles,
            texts : ['apple','turtle','zebra'],
            updated: Date.now()
        }
        
        db.Processing.update(conditions, updateData, options, function(err, numAffected) {
            if (err) {
                console.error("an error occurred");
                console.error(err);
            }
            
            if (numAffected) {
                data = {'status' : 'reset'};
                response.json(data);
            }
        });
    }


};