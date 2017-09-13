var schema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        validate: validators.isEmail(),
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    accessLevel: {
        type: String,
    },
    branch: {
        type: String,
        required: true,
    },
    expirydate: {
        type: Date,
    },
    resetpasswordtoken: {
        type: String,
    }
});


var userlogschema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
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
//userlogschema.plugin(uniqueValidator);
//userlogschema.plugin(timestamps);
//userlogschema = require('userlogschema');

//var pythonpath = "http://localhost:8096/script/";
module.exports = mongoose.model('chatbotuser', schema,'chatbotuser');
//var chatbot_user_logs = mongoose.model('chatbot_user_logs', userlogschema,"chatbot_user_logs");
var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    loginuser: function (data, callback) {
        //console.log("data", data)
        Chatbotuser.findOne({
            email: data.username,
            password: data.password,
        }, { fname: 1, lname: 1,email:1,accessrole:1,branch:1 }).limit(1).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    var ip = require('ip');
                    var ip_address = ip.address("public","ipv4");
                    var userLogs = require("./Chatbotuserlogs");
                    var sessiondata = userLogs({user:found._id,login_date:(new Date()),ip_address:ip_address,logout_date:new Date()});
                    sessiondata.save(function (err,result) {
                        if (err) {
                                return err;
                        }
                        else {
                            // found2 = {};
                            
                            // found2 = found;
                            // found2.sessionid = result._id;
                            found = found.toObject();
                            var r = result.toObject();
                            found.sessionid = r._id;
                            callback(null, found);
                            
                        }
                    });
                    
                    
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    changepassword: function (data, callback) {
        Chatbotuser.findOneAndUpdate({
            _id: data.userid,
            password: data.oldpassword,
        },{ $set: { password: data.newpassword }}).exec(function (err, found) {
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
    forgotpassword: function (data, callback) {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        var d = new Date(tomorrow),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        expiry= [year, month, day].join('-');
        expiry=new Date(expiry+"T23:59:59");
        Chatbotuser.findOneAndUpdate({
            email: data.email,
        },{ $set: { resetpasswordtoken: data.resettoken,expirydate:expiry }}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found.email);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    isvalidpasswordresetreq: function (data, callback) {
        
        Chatbotuser.findOne({
            resetpasswordtoken: data.resettoken,
            
        },{ expirydate: 1, _id:0 }).limit(1).exec(function (err, found) {
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
    resetpassword:function (data, callback) {
        
        Chatbotuser.findOneAndUpdate({
            resetpasswordtoken: data.resettoken,
            
        },{$set : {resetpasswordtoken: "",password:data.password}}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found.email);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    sendmail:function (data, callback) {
        
        var img = new Array();
        var m_html = "<html><body>";
        img = data.images;
        m_html +=data.text+"<br>";
        console.log(img.length);
        _.each(img,function(v,k){
            m_html += "<img src='"+v+"'>";
        });
        m_html += "</body></html>";
        //Config.sendEmail("pratik.shah@wohlig.com",data.email , "Test", "", data.bodytag);
        const sendmail = require('sendmail')({
            logger: {
                debug: console.log,
                info: console.info,
                warn: console.warn,
                error: console.error
            },
            silent: false,
            // dkim: { // Default: False 
            //     privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
            //     keySelector: 'mydomainkey'
            // },
            // devPort: 1025 // Default: False 
            // devHost: 'localhost' // Default: localhost 
        })
        sendmail({
            from: 'pratik.shah@wohlig.com',
            to: data.email,
            subject: 'test sendmail',
            html: m_html,
        }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
            if(!err)
                callback(null,"1");
        });
    },
};
module.exports = _.assign(module.exports, exports, model);