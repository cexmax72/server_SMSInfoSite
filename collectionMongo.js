var ObjectID = require('mongodb').ObjectID;

collectionMongo = function(db) {
  this.db = db;
};

collectionMongo.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

//find all objects for a collection
collectionMongo.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error)
      else {
        //the_collection.find().toArray(function(error, results) { //B
          the_collection.find().sort({CODICE_SITO:1}).toArray(function(error, results) { //B
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find a specific object
collectionMongo.prototype.get = function(collectionName, code_site, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
            //the_collection.findOne({'code_site':code_site}, function(error,doc) { //C
            the_collection.find({'CODICE_SITO': new RegExp(code_site,'i')}).toArray(function(error,doc) { //C  
            	if (error) callback(error)
            	else 
                callback(null, doc);
            });
        }
    });
};

/*//save new object
collectionMongo.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error)
      else {
        obj.created_at = new Date(); //B
        the_collection.insert(obj, function() { //C
          callback(null, obj);
        });
      }
    });
};

//update a specific object
collectionMongo.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
	        obj._id = ObjectID(entityId); //A convert to a real obj id
	        obj.updated_at = new Date(); //B
            the_collection.save(obj, function(error,doc) { //C
            	if (error) callback(error)
            	else callback(null, obj);
            });
        }
    });
}

//delete a specific object
collectionMongo.prototype.delete = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error)
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}
*/
//Perform a collection query
collectionMongo.prototype.query = function(collectionName, query, callback) { //1
    this.getCollection(collectionName, function(error, the_collection) { //2
      if( error ) callback(error)
      else {
        the_collection.find(query).toArray(function(error, results) { //3
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

exports.collectionMongo = collectionMongo;