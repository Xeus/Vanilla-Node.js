// TODO: learn how to use response.send, response.flash
// TODO: just use json feed?
// TODO: instead of partials, use JS templating?

/* Module dependencies. */
var db = require('../accessDB');

var itemTypeList = ['Beer','Food','Liquor','Wine'];

module.exports = {

    // ******** ADMIN STUFF *************
    // admin stuff all below

    admin: function(request, response) {
        db.Items.find({}, {}, { sort: { menuName : 'ascending' } }, function (err, items) {

            if (err) {
                //an error occurred
                console.log("Something went wrong.");
            }
            else {

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
                console.log("Something went wrong.");
            }
            else {
                templateData = {
                    items : items,
                    layout : false
                };
                response.render('item_list.html', templateData);
            }
        });
    },

    addItem: function(request, response) {
        console.log("addItem fired");
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
        item.save();
        
        if (request.xhr) {
            response.json({
                status : 'OK',
                msg : 'New item added!',
                itemName : request.body.itemName,
                itemID : item._id
            });
        }
        else {
            response.render('admin_dashboard.html');
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
        db.Items.findOne({ _id : request.body.itemID }, function (err, delItem) {
            console.log("fired");
            if (err) {
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
                    }
                });
            }
        
        });
    },

    deleteEmbed: function(request, response) {
        db.Items.findOne({ _id : request.body.itemID }, function (err, delEmbed) {
            console.log("deleteEmbed fired");
            if (err) {
                console.log("Failed to find embed.");
            }
            else {
                // hacky way to get rid of embeds
                for (var i=0; i<delEmbed.embeds.length; i++) {
                    if (delEmbed.embeds[i]._id == request.body.embedID) {
                        delEmbed.embeds.splice(i, 1);
                    }
                }
                delEmbed.markModified("embeds");
                delEmbed.save(function() {
                    response.json({
                        status : 'OK',
                        msg : 'Embed deleted.'
                    });
                });
            }
        
        });
    },

    // edit one item via ajax
    editItem: function(request, response) {
        db.Items.findOne({ _id : request.params.itemID }, function (err, items) {

            if (err) {
                console.log("Something went wrong.");
                console.log(err);
            }
            else {
                var templateData = {
                    items : items,
                    itemTypeList : itemTypeList
                }
                response.partial('item_single_edit.html', templateData);
            }
        });
    },

    // edit one embed via ajax
    editEmbed: function(request, response) {
        db.Items.findOne({ _id : request.params.itemID }, function (err, items) {

            if (err) {
                console.log("Something went wrong.");
                console.log(err);
            }
            else {
                var templateData = {
                    items : items
                }
                response.partial('embed_single_edit.html', templateData);
            }
        });
    },

    // creates belongsTo list
    belongs: function(request, response) {
        db.Items.find({}, function (err, items) {

            if (err) {
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
        var requestedItem = request.body.itemID;

        // find the requested document
        db.Items.findOne({ _id : requestedItem }, function(err, item) {
            if (err) {
                console.log("Something went wrong!");
                console.log(err);
            }
            else if (item === null) {
                console.log('Item not found.');
                if (request.xhr) {
                    response.json({
                        status : 'OK',
                        msg : 'Item not found!'
                    });
                }
            }
            else {
                item.itemName = request.body.itemName;
                item.itemDesc = request.body.itemDesc;
                item.itemCost = request.body.itemCost;
                item.itemCalories = request.body.itemCalories;
                item.save();
                if (request.xhr) {
                    response.json({
                        status : 'OK',
                        msg : 'Item updated!'
                    });
                }
            }
        });

    },

    updateEmbed: function(request, response){
        var itemID = request.body.itemID;
        var embedID = request.body.embedID;

        db.Items.findOne({ _id : itemID }, function(err, items) {
            if (err) { console.log(err); }
            else {
                for (var i=0;i<items.embeds.length;i++) {
                    if (items.embeds[i]._id == request.body.embedID) {
                        var newCost = parseFloat(request.body.embedCost);
                        items.embeds[i].embedName = request.body.embedName;
                        items.embeds[i].embedDesc = request.body.embedDesc;
                        items.embeds[i].embedCost = newCost;
                    }
                }
                items.markModified("embeds");
                items.save();
                if (request.xhr) { // if request sent via AJAX
                    console.log("Update succeeded.");
                    response.json({
                        status : "OK",
                        msg : "Embed updated!"
                    });
                }
                else {
                    console.log("hi");
                }
            }
        });

    }


};