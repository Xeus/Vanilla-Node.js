module.exports.configureSchema = function(Schema, mongoose) {

	var Items = new Schema({
		itemName : { type : String, default : "Unnamed!" },
		itemCost : Number,
		itemDesc : String,
		itemCalories : Number,
		itemType : String,
		itemAdded : { type : Date, default : Date.now },
		embeds : [Embeds]
	});

	var Embeds = new Schema({ 
		embedName : { type : String, default : "Unnamed!" },
		embedCost : Number,
		embedDesc : String,
		embedAdded : { type : Date, default : Date.now },
		id : String
	}); 

	// add schemas to Mongoose
	mongoose.model('Embeds', Embeds);
	mongoose.model('Items', Items);

};