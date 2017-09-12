var schema = new Schema({
    id: {
        type: Number,
    },
    user: {
        type: Object,
        required: true,
    },
    login_date: {
        type: Date,
    },
    logout_date: {
        type: Date,
    },
    ip_address: {
        type: String,
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
module.exports = mongoose.model('Chatbotuserlogs', schema,'chatbot_user_logs');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    logoutuser:function (data, callback) {
        
        Chatbotuserlogs.findOneAndUpdate({
            _id: data.sessionid,
            //user:data.user
        },{$set : {logout_date: (new Date())}}).exec(function (err, found) {
            if (err) {
                console.log("err",err);
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found.logout_date);
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