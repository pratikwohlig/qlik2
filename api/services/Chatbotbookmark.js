var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    chatlist: {
        type: Array,
    },
    name: {
        type:String,
    }
});


schema.plugin(deepPopulate, {
    /*populate: {
        'user': {
            select: 'fname _id'
        }
    }*/
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('chatbotbookmak', schema,'chatbotbookmark');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    viewbookmark: function (data, callback) {
        console.log("data", data)
        Chatbotbookmark.find({
            user: mongoose.Types.ObjectId(data.userid),
        }, [ "name", "_id"]).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    getbookmark: function (data, callback) {
        console.log("data", data)
        Chatbotbookmark.findOne({
            _id: mongoose.Types.ObjectId(data.selected),
        }, [ "user", "chatlist"]).sort({ 
            createdAt : -1 
        }).limit(1).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    savebookmark: function (data, callback) {
        Chatbotbookmark.saveData({
            user: data.userid,
            chatlist: data.chatlist,
            name:data.name,
        },function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, {"message":"1"});
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    deletebookmark: function (data, callback) {
        Chatbotbookmark.remove({
            _id: mongoose.Types.ObjectId(data.selected),
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
};
module.exports = _.assign(module.exports, exports, model);