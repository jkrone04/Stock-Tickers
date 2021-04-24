// stock_ticker_query.js

var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb+srv://jkrone04:fDRhnCaS3!@cluster0.lrujr.mongodb.net/stock_ticker?retryWrites=true&w=majority";

function main()
{
	// Set up server on port 8080 using Express
	const express = require('express');
	const bodyParser = require('body-parser');
	const app = express();

	app.use(bodyParser.urlencoded({ extended: true })); 

	app.listen(8080, () => {
	  console.log('Server running on port 8080');
	});

	app.post('/query', (req, res) => {
		// Collect form input from request
		var input = req.body.input;
		var s_or_c = req.body.s_or_c;

		// Run the query and send a response
		run_query(input, s_or_c, function(output) {
			res.send(output);
		});
	});
}

// Run a query in mongo with the given input and send response through callback function
function run_query(input, s_or_c, callback)
{
	// Set up mongo connection
	MongoClient.connect(url, {useUnifiedTopology : true}, function(err, db) {
		if(err) { return console.log(err); return;}
		  
	    var dbo = db.db("stock_ticker");
		var collection = dbo.collection('companies');

		// Set up query in mongo format
		var query, output = "";
		if(s_or_c == "stock_ticker")
			query = {stockTicker : input};
		else
			query = {companyName : input};

		// Run query
		collection.find(query).toArray(function(err, items) {
			if (err) {
				console.log("Error: " + err);
			}
			else 
			{
				// Format output
				var len = items.length;
				if(len == 0 && s_or_c == "company_name")
					output += "There are no matching companies with the company name " + input + ".";
				else if(len == 0 && s_or_c == "stock_ticker")
					output += "There are no matching companies with the stock ticker " + input + ".";
				else if(s_or_c == "company_name")
					output += "There is a matching company with the name " + input + ".";
				else {
					if(len == 1)
						output += "There is 1 matching company with the stock ticker " + input + ".";
					else
						output += "There are " + len + " matching companies with the stock ticker " + input + ".";
				}

				output += "<br><br>";

				for (i=0; i<items.length; i++) {
					var item = items[i];
					var company_name = item.companyName;
					var stock_ticker = item.stockTicker;
					output += company_name + " -- " + stock_ticker + "<br><br>";
				}

				// Send response through callback function
				callback(output);
			}
		});
		
		// Close the database (still unsure how to do this with async/await)
		// db.close();
	});
}

main();

