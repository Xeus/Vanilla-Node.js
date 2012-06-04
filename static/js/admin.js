var addItemStatus = $("#addItemStatus");
var singleItemStatus = $("#singleItemStatus");
var addEmbedStatus = $("#addEmbedStatus");
var updated = $("#updated");
var itemList = $("#itemList");
var textBoxes = $("input[name='itemName'], input[name='itemCalories'], input[name='itemCost'], input[name='itemDesc'], input[name='embedName'], input[name='embedCost'], input[name='embedDesc'], textarea");

var addItem = function(formData) {
  return $.ajax({
    url: "/admin/items/add",
    type: "POST",
    data: formData,
    dataType: "json",
    success: function(response) {
      if (response.status == "OK") {
          $("#embedList").prepend('<OPTION ID="belongsTo_' + response.itemID + '" VALUE="' + response.itemID + '">' + response.itemName + '</OPTION>');
          itemList.load('/admin/list'); // refreshes left list
          addItemStatus.html(response.msg).fadeToggle(300).delay(3000).fadeToggle(300);
          textBoxes.val('');
          $("input").css('background','white');
          itemIDToManipulate = response.itemID;
      }
      else {
          addItemStatus.html("There was an error adding the item.").fadeToggle(300).delay(3000).fadeToggle(300);
      }
    }, 
    error : function(error) {
      console.log("There was an error updating the item.");
      console.log(error);
      addItemStatus.html("There was an error adding the item.").fadeToggle(300).delay(3000).fadeToggle(300);
    }
  });
};

var addEmbed = function(formData) {
  return $.ajax({
    url : '/admin/items/addEmbed',
    type : 'POST',
    data : formData, 
    dataType : 'json',
    success : function(response) {
      if (response.status == "OK") {
        addEmbedStatus.html(response.msg).fadeToggle(300).delay(3000).fadeToggle(300);
        //clear the form
        textBoxes.val('');
        embedIDToManipulate = response.embedID;
        //$("input").css('background','white');
        // TODO: append instead of load
        itemList.load('/admin/list'); // refreshes left list
      }
      else {
        addEmbedStatus.html("There was a partial error adding the embed.").fadeToggle(300).delay(3000).fadeToggle(300);
      }
    }, 
    error : function(error) {
      console.log("There was an error");
      console.log(error);
      addEmbedStatus.html("There was an error adding the embed.").fadeToggle(300).delay(3000).fadeToggle(300);
    }
  });
};

var updateItem = function(formData) {
  return $.ajax({
    url: "/admin/items/update",
    type: "POST",
    data: formData,
    dataType: "json",
    success: function(response) {
      if (response.status === "OK") {
        singleItemStatus.fadeToggle(300).html(response.msg).delay(3000).fadeToggle(300);
      }
      else {
        singleItemStatus.fadeToggle(300).html("There was a partial error updating the item.").delay(3000).fadeToggle(300);
      }
    }, 
    error : function(error) {
      console.log("There was an error updating the item.");
      console.log(error);
      singleItemStatus.fadeToggle(300).html("There was an error updating the item.").delay(3000).fadeToggle(300);
    }
  });
};

var updateEmbed = function(formData) {
  return $.ajax({
    url: "/admin/items/updateEmbed",
    type: "POST",
    data: formData,
    dataType: "json",
    success: function(response) {
      if (response.status == "OK") {
        singleItemStatus.fadeToggle(300).html(response.msg).delay(3000).fadeToggle(300);
      }
      else {
        singleItemStatus.fadeToggle(300).html("Error!").delay(3000).fadeToggle(300);
      }
    }, 
    error : function(error) {
      console.log(error);
      singleItemStatus.fadeToggle(300).html("There was an error updating the embed!").delay(3000).fadeToggle(300);
    }
  });
};

var deleteItem = function(formData) {
  return $.ajax({
    url: "/admin/items/delete",
    type: "POST",
    data: formData,
    dataType: "json",
    success: function(response) {
      if (response.status === "OK") {
        $("#bullet" + response.itemID).remove();
        singleItemStatus.fadeToggle(300).html(response.msg).delay(3000).fadeToggle(300);
        $("OPTION#belongsTo_" + formData.itemID).remove();
      }
      else {
        console.log("There was a partial error deleting the item.");
      }
    }, 
    error : function(error) {
        console.log("There was an error deleting the item.");
        console.log(error);
    }
  });
};

var deleteEmbed = function(formData) {
  return $.ajax({
    url: "/admin/items/deleteEmbed",
    type: "POST",
    data : formData,
    dataType: "json",
    success: function(response) {
      if (response.status == "OK") {
        $("#embed" + response.embedID).remove();
        singleItemStatus.fadeToggle(300).html(response.msg).delay(3000).fadeToggle(300);
      }
      else {
        console.log("There was a partial error deleting the embed.");
      }
    }, 
    error : function(error) {
      console.log("There was an error deleting the embed.");
      console.log(error);
    }
  });
};

// TODO: change validation to on submit instead of using field.focus()?

// is name blank?
var validateName = function(field, formType) {
  if(field.val() !== "") {
    field.css('background', 'green');
  }
  else {
    field.focus();
    $("add" + formType + "Status").html("You cannot leave the name field blank.").fadeToggle(300).delay(3000).fadeToggle(300);
    field.css('background', 'red');
  }
};

// is this a legit number or dollar/decimal amount?
var validateNum = function(field) {
  var numericExpression = /^[ ,.,0-9]+$/;
  if(field.val().match(numericExpression) || (field.val() == "")){
    field.css('background', 'green');
  }
  else {
    field.focus();
    addItemStatus.html("You didn't enter a number!").fadeToggle(300).delay(3000).fadeToggle(300);
    field.css('background', 'red');
  }
};

var itemIDToManipulate = 'test'; // for unit testing
var embedIDToManipulate = ''; // for unit testing

$(function() {
  itemList.load('/admin/list'); // refreshes left list
  
  $('#addItem').click(function(e) {
    var formData = $('#itemForm').serialize();
    if ($('#itemName').val() != '') {
      addItem(formData);
    }
    else {
      addItemStatus.html("You didn't enter a name.").fadeToggle(300).delay(3000).fadeToggle(300);
    }
    e.preventDefault();
    return false;
  });
  // TODO: embed code for embedded docs not working yet but will look similar to code for adding items
  $("#addEmbed").click(function(e) {
    var formData = $("#embedForm").serialize();
    if ($('#embedList').val() == "") {
      addEmbedStatus.html("ERROR: The embed must belong to an existing item!").fadeToggle(300).delay(3000).fadeToggle(300);
    }
    else if ($('#embedName').val() != '') {
      addEmbed(formData);
    }
    else {
      addEmbedStatus.html("You didn't enter a name.").fadeToggle(300).delay(3000).fadeToggle(300);
    }
    e.preventDefault();
    return false;
  });
  $('.editItem').live('click', function(e) {
    var idToEdit = $(this).attr('title');
    $('#itemContents' + idToEdit).toggle();
    $('#embedContents' + idToEdit).toggle();
    if ($(this).html() === "edit") {
      $(this).html("hide");
      $("#itemContents" + idToEdit).load("/admin/items/" + idToEdit + "/edit");
      $("#embedContents" + idToEdit).load("/admin/embeds/" + idToEdit + "/edit");
    }
    else {
        $(this).html("edit");
    }
    e.preventDefault();
    return false;
  });
  $('.deleteItem').live('click', function(e) {
    var deletedEntry = this;
    $("#dialog-confirm").toggle();
    $("#dialog-confirm").dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Delete This Item": function() {
          $(this).dialog( "close" );
          var idToDelete = $(deletedEntry).attr('title');
          var formData = {
            itemID : idToDelete
          }
          deleteItem(formData);
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $("#dialog-confirm").toggle();
    e.preventDefault();
    return false;
  });

  $('.deleteEmbed').live('click', function(e) {
    var deletedEntry = this;
    $("#dialog-confirm").toggle();
    $("#dialog-confirm").dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Delete This Embed": function() {
          $(this).dialog("close");
          var idToDelete = $(deletedEntry).attr('title');
          var formData = $("#embedForm" + idToDelete).serialize();
          deleteEmbed(formData);
        },
        Cancel: function() {
          $(this).dialog("close");
        }
      }
    });
    $("#dialog-confirm").toggle();
    e.preventDefault();
    return false;
  });
  $('#updateItem').live('click', function(e) {
    formData = $('#singleItemForm').serialize();
    updateItem(formData);
    e.preventDefault();
    return false;
  });
  $('.updateEmbedButton').live('click', function(e) {
    var formID = $(this).attr("title");
    formData = $("#embedForm" + formID).serialize();
    updateEmbed(formData);
    e.preventDefault();
    return false;
  });

//unitTests(); // comment out to stop tests

}); // end document ready