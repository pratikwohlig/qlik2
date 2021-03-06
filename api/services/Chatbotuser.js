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
                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
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
                            
                            // var https = require('https');
                            // var fs = require('fs');
                            // var options = {
                            //     rejectUnauthorized:false,
                            //     hostname: 'exponentiadata.co.in',
                            //     port: 4244,
                            //     //port: 4244,
                            //     path: '/qps/ticket?xrfkey=0123456789ABCDEF',
                            //    //path: '/qrs/ticket?xrfkey=',
                            //     method: 'GET',
                            //     headers: {
                            //         'x-qlik-xrfkey' : '0123456789ABCDEF',
                            //         'X-Qlik-User' : 'UserDirectory= BONTONCHAT; UserId= ram '
                            // },
                            //     key: fs.readFileSync("./cert/client_key.pem"),
                            //     cert: fs.readFileSync("./cert/client.pem"),
                            //     //ca: fs.readFileSync("./cert/root.pem")
                            //     //strictSSL: false
                            // };
                            // https.get(options, function(res) { 
                            //     console.log("Got response: " + res.statusCode);
                            //     //console.log("res",res);
                            //     res.on("data", function(chunk)
                            //     {
                            //          console.log("BODY: " + chunk);
                            //     }); 
                            // }).on('error', function(e) 
                            // { 
                            //     console.log("Got error: " + e.message); 
                            // });
                            var http = require('http');
                            var options = {
                                hostname: 'exponentiadata.co.in',
                                path:'/qlikauth/qlikauth.php',
                            };
                            http.get(options, function(res) { 
                                console.log("Got response: " + res.statusCode);
                                //console.log("res",res);
                                res.on("data", function(chunk)
                                {
                                    found = found.toObject();
                                    var r = result.toObject();
                                    found.sessionid = r._id;
                                    found.chunk=JSON.parse(chunk);
                                    callback(null, found);
                                     console.log("BODY: " + chunk);
                                }); 
                            }).on('error', function(e) 
                            { 
                                console.log("Got error: " + e.message); 
                            });

                            
                            
                            
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
        // var attachments1 = new Array();
        // var img = new Array();
        // //var m_html = "<html><body>";
        var m_html = "";
        // img = data.images;
        m_html +=data.text+"<br>";
        var subjecttext = "";
        if(data.subject != "")
            subjecttext = data.subject;
        else    
            subjecttext = "Detailed Analysis";
        // console.log(img.length);
        // _.each(img,function(v,k){
        //     //m_html += "<img src='"+v+"'>";
        //     obj = {"path":v};
        //     attachments1.push(obj);
        // });
        // //m_html += "</body></html>";
        m_html += "";
        // sendmail({
        //     from: 'rohit.mathur@exponentiadata.com',
        //     to: data.email,
        //     subject: 'Detailed Analysis',
        //     html: m_html,
        //     attachments:attachments1,
        // }, function(err, reply) {
        //     console.log(err && err.stack);
        //     console.dir(reply);
        //     if(!err)
        //         callback(null,{message:1});
        // });
        //var capture = require('phantomjs-capture');
        var async = require('async');
        var attachments1 = new Array();
        var img = new Array();
        var webshot = require('webshot');
        //var Screenshot = require('url-to-screenshot');
        var fs = require('fs');
        img = data.images;
        var Ticket = data.Ticket;
        var key = 0;    
        const streamToBuffer = require('stream-to-buffer');
        var http = require('http');
        var options = {
            hostname: 'exponentiadata.co.in',
            path:'/qlikauth/qlikauth.php',
        };
        
        async.each(data.images,
            // 2nd param is the function that each item is passed to
            function(item, eachCallback){
                    
                    ///setTimeout(function() {   
                        // url-toscreenshot
                        // new Screenshot(item)
                        // .width(420)
                        // .height(420)
                        // .clip()
                        // .capture()
                        // .then(imgData => {
                        //     if(!imgData){
                        //         console.log('Could not take screenshot for this url');
                        //         return false;
                        //     }
                        //     var file = __dirname+'/test'+key+'.png';
                        //     fs.writeFileSync(file, imgData);
                        //     attachments1.push(file);
                        //     key++;
                        //     eachCallback();
                        // });
                            //console.log(item+"?qlikTicket="+Ticket);
                        //console.log("res",res);
                        //console.log(chunk);
                        //url = item.slice( 0, item.indexOf('?') );
                http.get(options, function(res) { 
                    res.on("data", function(chunk)
                    {
                        console.log(item);
                        url = item;
                        //var stringify = JSON.stringify(chunk);
                        newchunk=JSON.parse(chunk);
                        url = url+"?qlikTicket="+newchunk.Ticket;
                        //url =url.replace(/(^\w+:|^)\/\//, '');
                        //webshot
                        var dt = new Date();
                        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()+key;
                        var filename1 = "";
                        var options = {
                            windowSize:{ width: 1024, height: 768 },
                            shotSize: {
                                width: 'window',height: 'window'
                            },
                            userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
                            + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g',
                            renderDelay:40000,
                            // onLoadFinished: function() {
                                
                            //     console.log(url,"new url"+time+"key-"+key);
                            //     //eachCallback();
                            // },
                            //takeShotOnCallback:true,
                            //timeout:60000
                        };
                        var filename1 = dt.getTime()+key+'.png';
                        webshot(url,filename1 , options, function(err) {
                        // screenshot now saved to hello_world.png
                            //console.log(url,"new url"+time+"key-"+key);
                            //eachCallback();
                            // setTimeout(function(){
                                
                            //     //document.write("getTime() : " + dt.getTime() ); 
                                console.log(url,"new url");
                                var filedata = {filename:filename1,content: fs.createReadStream(filename1)};
                                attachments1.push(filedata);
                                key++;
                                eachCallback();
                        //    / },60000);
                            
                        });
                        
                    }); 
                }).on('error', function(e) 
                { 
                    console.log("Got error: " + e.message); 
                });
                        // var renderStream = webshot(url,options);
                        // var file = fs.createWriteStream('scr'+key+'.png', {encoding: 'binary'});
                        
                        // renderStream.on('data', function(data) {
                        //     file.write(data.toString('binary'), 'binary');
                        //     var filedata = { filename:'scr'+key+'.png',contentType: 'image/png'};
                        //     attachments1.push(filedata);
                        //     key++;
                        //     eachCallback();
                        // });
                        // streamToBuffer(renderStream, (err, buffer) => {
                        //     if (err) {
                        //         console.error(err.stack);
                        //         throw err;
                        //     }

                        //     var base64String = buffer.toString('base64');
                        //     //Now you have base64 encoded screen shot. Use it however you want.
                        //     console.log(base64String);
                        //     var obj1 = { path:base64String  };
                        //     attachments1.push(obj1);
                        //     key++;
                        //     eachCallback();
                        // });
                        
                        
                        //},60000);
                        
                    },
                    // 3rd param is the function to call when everything's done
                    function(err){
                        // All tasks are done now
                        if(err) {}
                        else
                        {
                            //console.log("done",attachments1);
                            //callback(null,{message:1});
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
                            });
                            sendmail({
                                from: 'rohit.mathur@exponentiadata.com',
                                to: data.email,
                                subject: subjecttext,
                                html: m_html,
                                attachments:attachments1,
                            }, function(err, reply) {
                                console.log(err && err.stack);
                                console.dir(reply);
                                if(!err)
                                    callback(null,{message:1});
                            });
                                    //callback(null,{message:1});
                        }
                    
                    }
                );
           
        

        // _.each(img,function(v,k){
        //     console.log(item);    
        //     capture({
        //         dir: '.',
        //         output: 'xx'+key+'.png',
        //         url: item,
        //         size: '500x500',
        //         domHook: 'QV01',
        //         screenTimer: 6000
        //     }, function(err, result) {
        //         obj = {"path":v};
        //         attachments1.push(obj);
        //         console.log(result.fullPNGPath);        // PNG PATH
        //         // console.log(result.filePNGName);        // PNG File Name
        //         // console.log(result.fileHTMLPath);       // HTML PATH
        //         // console.log(result.fileHTMLName);       // HTML File Name
        //     });
            
        // });
        // var childProcess = require('child_process');

        // function newEmail(){
        //     childProcess.spawn(
        //         "powershell.exe",
        //         ['$mail = (New-Object -comObject Outlook.Application).CreateItem(0);' +
        //         '$mail.Attachments.Add("C:\Users\admin\desktop\myproject\temp\testing.pdf");' +
        //         '$mail.Subject = "Some text";' +
        //         '$mail.Display();']
        //     );
        // }
    },
    getnewticket:function (data, callback) {
        var http = require('http');
        var options = {
            hostname: 'exponentiadata.co.in',
            path:'/qlikauth/qlikauth.php',
        };
        http.get(options, function(res) { 
            res.on("data", function(chunk)
            {
                var found = {};
                found.chunk=JSON.parse(chunk);
                callback(null, found);
            }); 
        }).on('error', function(e) 
        { 
            console.log("Got error: " + e.message); 
        });
    },
};
module.exports = _.assign(module.exports, exports, model);