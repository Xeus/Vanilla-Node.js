module.exports.configureSchema = function(Schema, mongoose) {

	var Items = new Schema({
		itemName : { type : String, required : true },
		itemCost : Number,
		itemDesc : String,
		itemCalories : Number,
		itemType : String,
		itemAdded : { type : Date, default : Date.now },
		embeds : [Embeds]
	});

	var Embeds = new Schema({ 
		embedName : { type : String, required : true },
		embedCost : type : Number,
		embedDesc : String,
		embedAdded : { type : Date, default : Date.now },
		id : String
	}); 

	// add schemas to Mongoose
	mongoose.model('Embeds', Embeds);
	mongoose.model('Items', Items);

};