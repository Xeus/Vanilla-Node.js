  var unitTests = function() {

  module("Sinon.js Setup");

  test("Using spies", function () {
      var spy = sinon.spy();
      spy();

      ok(spy.called);
      ok(spy.calledOnce);
  });

  test("Stubbing global environments", function () {
      this.stub(jQuery, "ajax");
      jQuery.ajax("/url", {});

      ok(jQuery.ajax.called);
  });

  test("Some timing stuff", function () {
      var spy = this.spy();
      setTimeout(spy, 150);

      this.clock.tick(149);
      ok(!spy.called);

      this.clock.tick(1);
      ok(spy.called);
  });

  // thx http://stackoverflow.com/questions/941133/qunit-with-ajax-qunit-passes-the-failing-tests
  // also http://stackoverflow.com/questions/9431597/unit-testing-ajax-requests-with-qunit

  // create a function that counts down to `start()`
  function createAsyncCounter(count) {
      count = count || 1; // count defaults to 1
      return function () { --count || start(); };
  }

  module("Testing vanilla server");

  var X = function () {
    this.fire = function () {
      return $.ajax({
        type: 'GET',
        url: X.url
      });
    };
  };

  asyncTest("Server response", function() {
    var countDown = createAsyncCounter(1)
    var x = new X;
    x.url = "http://localhost:5000/"; // the production url
    x.fire().done(function(data, status, jqXHR) {
      ok(status, "success");
      equal(jqXHR.status, "200", "Server responded with Code 200.");
    }).always(countDown); // call `countDown` regardless of success/error
  });

  module("CRUD Functions");

  asyncTest("Add Item", function() {
    var countDown = createAsyncCounter(1)
    var addItemTest = function(formData) {
      this.fire = function(formData) {
        return addItem(formData);
      };
    };
    var addItemTestRun = new addItemTest;
    var formData = 'itemType=Beer&itemName=testItem&itemDesc=testDesc&itemCost=10&itemCalories=100';
    addItem(formData).done(function(data, status, jqXHR) {
      //console.log(jqXHR);
      var responseText = jQuery.parseJSON(jqXHR.responseText);
      equal(responseText.status, "OK", "Server responded with 'OK'.");
      equal(responseText.msg, "New item added!", "Server responded with correct add-item text.");
      equal(responseText.itemName, "testItem", "Server responded with correct add-item name.");
      ok($("#belongsTo_" + responseText.itemID).length > 0, "New item added to embed belongsTo list.");
      equal(addItemStatus.html(), responseText.msg, "Status message assigned.");
      equal(textBoxes.val(), '', "Text boxes cleared out.");
      $("input").css('background','white');
    }).always(countDown); // call `countDown` regardless of success/error
  });

  asyncTest("Add Embed", function() {
    var countDown = createAsyncCounter(1)
    var addEmbedTest = function(formData) {
      this.fire = function(formData) {
        return addEmbed(formData);
      };
    };
    var addEmbedTestRun = new addEmbedTest;
    var formData = 'embedList=' + itemIDToManipulate + '&embedName=testEmbed&embedDesc=testDesc&embedCost=10';
    addEmbed(formData).done(function(data, status, jqXHR) {
      var responseText = jQuery.parseJSON(jqXHR.responseText);
      equal(responseText.status, "OK", "Server responded with 'OK'.");
      equal(responseText.msg, "New embed added!", "Server responded with correct add-embed text.");
      equal(responseText.embedName, "testEmbed", "Server responded with correct add-embed name.");
      ok(addEmbedStatus.html(responseText.msg), responseText.msg, "Status message assigned.");
      equal(textBoxes.val(), '', "Text boxes cleared out.");
    }).always(countDown); // call `countDown` regardless of success/error
  });

  asyncTest("Update Embed", function() {
    var countDown = createAsyncCounter(1)
    var updateEmbedTest = function(formData) {
      this.fire = function(formData) {
        return updateEmbed(formData);
      };
    };
    var updateEmbedTestRun = new updateEmbedTest;
    var formData = 'itemID=' + itemIDToManipulate + '&embedName=testUpdateEmbed&embedDesc=updatetestDesc&embedCost=20';
    updateEmbed(formData).done(function(data, status, jqXHR) {
      var responseText = jQuery.parseJSON(jqXHR.responseText);
      equal(responseText.status, "OK", "Server responded with 'OK'.");
      ok(addEmbedStatus.html(responseText.msg), responseText.msg, "Status message assigned.");
      equal(responseText.msg, "Embed updated!", "Server responded with correct update-embed text.");
    }).always(countDown); // call `countDown` regardless of success/error
  });

  asyncTest("Update Item", function() {
    var countDown = createAsyncCounter(1)
    var updateItemTest = function(formData) {
      this.fire = function(formData) {
        return updateItem(formData);
      };
    };
    var updateItemTestRun = new updateItemTest;
    var formData = 'itemID=' + itemIDToManipulate + '&itemType=Beer&itemName=testUpdateItem&itemDesc=updatetestDesc&itemCost=102&itemCalories=105';
    updateItem(formData).done(function(data, status, jqXHR) {
      var responseText = jQuery.parseJSON(jqXHR.responseText);
      equal(responseText.status, "OK", "Server responded with 'OK'.");
      ok(addItemStatus.html(responseText.msg), responseText.msg, "Status message assigned.");
      equal(responseText.msg, "Item updated!", "Server responded with correct update-item text.");
    }).always(countDown); // call `countDown` regardless of success/error
  });

  asyncTest("Delete Embed", function() {
    var countDown = createAsyncCounter(1)
    var deleteEmbedTest = function(formData) {
      this.fire = function(formData) {
        return deleteEmbed(formData);
      };
    };
    var deleteEmbedTestRun = new deleteEmbedTest;
    var idToDelete = embedIDToManipulate;
    var formData = 'itemID=' + itemIDToManipulate + '&embedID=' + embedIDToManipulate;
    deleteEmbed(formData).done(function(data, status, jqXHR) {
      var responseText = jQuery.parseJSON(jqXHR.responseText);
      equal(responseText.status, "OK", "Server responded with 'OK'.");
      ok(addEmbedStatus.html(responseText.msg), responseText.msg, "Status message assigned.");
      equal(responseText.msg, "Embed deleted.", "Server responded with correct delete-embed text.");
      ok($("#embed" + responseText.embedID).length == 0, "Embed deleted from DOM.");
    }).always(countDown); // call `countDown` regardless of success/error
  });

  asyncTest("Delete Item", function() {
    var countDown = createAsyncCounter(1)
    var deleteItemTest = function(formData) {
      this.fire = function(formData) {
        return deleteItem(formData);
      };
    };
    var deleteItemTestRun = new deleteItemTest;
    var formData = {
      itemID : itemIDToManipulate
    };
    deleteItem(formData).done(function(data, status, jqXHR) {
      var responseText = jQuery.parseJSON(jqXHR.responseText);
      equal(responseText.status, "OK", "Server responded with 'OK'.");
      equal(responseText.msg, "Item deleted.", "Server responded with correct delete-item text.");
      $("#bullet" + formData.itemID).remove();
      ok($("#bullet" + responseText.itemID).length == 0, "Item deleted from DOM.");
      ok(addItemStatus.html(responseText.msg), responseText.msg, "Status message assigned.");
      ok($("OPTION#belongsTo_" + responseText.itemID).length == 0, "belongsTo option deleted from DOM.");
    }).always(countDown); // call `countDown` regardless of success/error
  });

}; // end unitTests()