var fs = require("fs");
var querystring = require('querystring');
var request = require('request').defaults({
		maxRedirects:20,
		jar: true
	});


var url = 'http://api.feedzilla.com/v1/categories.json';
var headers = { 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Content-Type' : 'application/x-www-form-urlencoded' 
};

var couch_header = 
{
    'Content-Type' : 'application/json'
}

var z_header = 
{
    'Content-Type' : 'application/json', 
    'X-Zomato-API-Key' : '7749b19667964b87a3efc739e254ada2'
}



// request({
//     	headers : {
//     		'Content-Type' : 'application/json'
//     	},
//     	uri : 'http://127.0.0.1:5984/test/87faa29914250597eee456911c001e24',
//     	method : 'GET'
//     }, function(err, res, body){
//     	console.log(body);
//     	var data = JSON.parse(body).data;
//     	data.map(function(entry){
//     		console.log(entry.category_id);
//     		fetchCategoryArticles(entry.category_id);
//     	});
//     });	


fetchAllRestaurantsInAllZones = function(){
	    request({
	    	headers : couch_header,
	    	uri : "http://127.0.0.1:5984/z_zones_copy/_design/view/_show/fizz/303b30e5ada45b2c188464ffe10007af",
	    	method : 'POST'
	    }, function(err, res, body){
	    	JSON.parse(body).forEach(function(el){
	    		console.log(el);
	    		// fetchRestaurantsInZone(el);
	    	});
	    	// saveToCouch('http://127.0.0.1:5984/z_restaurants_zone/', body);
	    });
};

f = function(){
		start = start + batch;
		console.log('start -> ' + start);
		request({
		headers : z_header,
		uri : "https://api.zomato.com/v2/search.json?zone_id="+zoneid+"&start="+start+"&count="+batch,
		method : 'POST'
	    }, function(err, res, body){
	    	console.log(body);
	    	saveToCouch('http://127.0.0.1:5984/z_restaurants_zone/', body);
	    });

	    if(start > count){
	    	clearInterval(interval);
	    }
}

fetchAllRestaurantsInZone = function(zone_id){
		zoneid = zone_id;
		count = 0;
		start = 0;
		var param = count>0?"&start="+start:"";
		batch = 50;

		request({
	    	headers : z_header,
	    	uri : "https://api.zomato.com/v2/search.json?zone_id="+zoneid+"&count="+batch,
	    	method : 'POST'
	    }, function(err, res, body){
	    	console.log(body);
	    	saveToCouch('http://127.0.0.1:5984/z_restaurants_zone/', body);
	    	
	    	body = JSON.parse(body);
	    	console.log("results_found --> " + body.results_found);

	    	count = body.results_found;
	    	
	    	interval = setInterval(f, 5000);
	    });
}(2400);


fetchSubZones = function(cityid){
	    request({
	    	headers : z_header,
	    	uri : "https://api.zomato.com/v2/subzones.json?city_id="+cityid,
	    	method : 'POST'
	    }, function(err, res, body){
	    	console.log(body);
	    	saveToCouch('http://127.0.0.1:5984/z_subzones/', body);
	    });
};


fetchZones = function(cityid){
	    request({
	    	headers : z_header,
	    	uri : "https://api.zomato.com/v2/zones.json?city_id="+cityid,
	    	method : 'POST'
	    }, function(err, res, body){
	    	console.log(body);
	    	saveToCouch('http://127.0.0.1:5984/z_zones/', body);
	    });
};

fetchCategories = function(){
	request.get({ url: url, headers: headers }, function (e, r, body) {
	    console.log(body);
	    request({
	    	headers : {
	    		'Content-Type' : 'application/json'
	    	},
	    	uri : 'http://127.0.0.1:5984/test/',
	    	body : '{"data" :'  + body + '}',
	    	method : 'POST'
	    }, function(err, res, body){
	    	console.log(body);
	    });
	});
}

fetchCategoryArticles = function (id){
	console.log('http://api.feedzilla.com/v1/categories/'+id+'/articles.json');
	request({
		headers : couch_header,
		uri : 'http://api.feedzilla.com/v1/categories/'+id+'/articles.json',
		method : 'GET'
	}, function(err, res, body){
		console.log(body);
		JSON.parse(body).articles.forEach()
		// saveToCouch('http://127.0.0.1:5984/test_articles/', body);
	});	
}

saveToCouch = function(uri , body){
	request({
    	headers : {
    		'Content-Type' : 'application/json'
    	},
    	uri : uri,
    	body : '{"data" :'  + body + '}',
    	method : 'POST'
    }, function(err, res, body){
    	console.log(body);
    });
}


