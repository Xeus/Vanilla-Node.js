module.exports.configureSchema = function(Schema, mongoose) {

	var Items = new Schema({
		itemName : String,
		itemCost : Number,
		itemDesc : String,
		itemCalories : Number,
		itemType : String,
		itemAdded : { type : Date, default : Date.now },
		embeds : [Embeds]
	});

	var Embeds = new Schema({ 
		embedName : String,
		embedCost : { type : Number, default : 0 },
		embedDesc : String,
		embedAdded : { type : Date, default : Date.now },
		id : String
	}); 

	// add schemas to Mongoose
	mongoose.model('Embeds', Embeds);
	mongoose.model('Items', Items);


};