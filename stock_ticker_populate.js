var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb+srv://jkrone04:fDRhnCaS3!@cluster0.lrujr.mongodb.net/stock_ticker?retryWrites=true&w=majority";

function main()
{
	// Set up mongo connection
	MongoClient.connect(url, {useUnifiedTopology : true}, function(err, db) {
		  if(err) { return console.log(err); return;}
		  
		    var dbo = db.db("stock_ticker");
			var collection = dbo.collection('companies');

			var readline = require('readline');
			var fs = require('fs');

			// Take in companies file
			var companies_file = readline.createInterface({
			  input: fs.createReadStream('companies.csv')
			});

			// Read information from file and populate database
			read_and_insert(companies_file, collection);

			// Close the database (still unsure how to do this with async/await)
			// db.close();
	});
}

// Reads information from file and stores data in mongo collection
function read_and_insert(file, collection)
{
	file.on('line', function (line) {
		var company_name = line.split(",")[0];
		var stock_ticker = line.split(",")[1];
		var newData = {"companyName": company_name, "stockTicker" : stock_ticker};

		if(company_name != "Company") { // Make sure it is not default line
			collection.insertOne(newData, function(err, res) {
				if(err) { return console.log(err); return;}
				console.log('Inserted "' +  company_name + '", ' + stock_ticker);
			});
		}
	});
}

main();


