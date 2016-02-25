var http = require('http'),
    express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    collectionMongo = require('./collectionMongo').collectionMongo
    dateFormat = require('dateformat');
 
var app = express();
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser()); // <-- add

var mongoHost = 'localHost';
var mongoPort = 27017;
var collectionMongo;
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));

mongoClient.open(function(err, mongoClient) {
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1);
  }
  var db = mongoClient.db("EricssonSMS");
 
  collectionMongo = new collectionMongo(db);
});

app.use(express.static(path.join(__dirname, 'public')));
 
app.get('/', function (req, res) {
  res.send('<html><body><h1>Server Up</h1></body></html>');
  //inserire data di request
  var now = new Date();
  console.log("Server request at " + dateFormat(now, "dd/mm/yyyy, h:MM:ss TT"));
});
 
app.get('/:collection', function(req, res, next) {  
   var params = req.params;
   var query = req.query.query; //1
   if (query) {
        query = JSON.parse(query); //2
        console.log("query"+ query);
        collectionMongo.query(req.params.collection, query, returnCollectionResults(req,res)); //3
   } else {
        collectionMongo.findAll(req.params.collection, returnCollectionResults(req,res)); //4
   }
        var now = new Date();
        console.log("/:collection");
        console.log("Server collection " + req.params.collection + " request at " + dateFormat(now, "dd/mm/yyyy, h:MM:ss TT"));
   
});
 
function returnCollectionResults(req, res) {
    return function(error, objs) { //5
        if (error) { 
            res.send(400, error); 
          }
	        else { 
                /*if (req.accepts('html')) { //6
                    //res.render('data',{objects: objs, collection: req.params.collection});
                    //res.json(objs);
                    //console.log("objs " + objs);
                    res.set('Content-Type','application/json');
                    res.send(200, objs);
                } else {*/
                    res.set('Content-Type','application/json');
                    res.send(200, objs);
                
        }
    }
}
 
app.get('/:collection/:entity', function(req, res) { //I
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
   if (entity) {
      var now = new Date();
      console.log("/:collection/:entity");
      console.log("Server collection: " + collection + " entity: " + entity + " request at " + dateFormat(now, "dd/mm/yyyy, h:MM:ss TT"));       
      collectionMongo.get(collection, entity, function(error, objs) { //J
          if (error) { 
            res.send(400, error); 
          } else { 
            res.send(200, objs); } //K
       });
   } else {
      res.send(400, {error: 'bad url', url: req.url});
   }
});

/*app.post('/:collection', function(req, res) { //A
    var object = req.body;
    var collection = req.params.collection;
    collectionMongo.save(collection, object, function(err,docs) {
          if (err) { res.send(400, err); } 
          else { res.send(201, docs); } //B
     });
});

app.put('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionMongo.update(collection, req.body, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C
       });
   } else {
	   var error = { "message" : "Cannot PUT a whole collection" }
	   res.send(400, error);
   }
});

app.delete('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionMongo.delete(collection, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C 200 b/c includes the original doc
       });
   } else {
       var error = { "message" : "Cannot DELETE a whole collection" }
       res.send(400, error);
   }
});
*/ 
app.use(function (req,res) {
    res.render('404', {url:req.url});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});