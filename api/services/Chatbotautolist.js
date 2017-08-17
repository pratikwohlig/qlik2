var exports = _.cloneDeep(require("sails-wohlig-service"));
var pythonpath = "http://104.46.103.162:8096/script/";
var pythonpath = "http://localhost:8080/script/";
var model = {
    getSysMsg: function (data, callback) {
        var util = require("util");
        //var data={a:5,b:5};
        var spawn = require("child_process").spawn;
        //get_name_cmdline
        //get_DH_cmdline
        //get_image_cmdline
        var process = spawn('python',["./script/get_name_cmdline.py"], {detached: true});
        process.unref();
        util.log('readingin');

        process.stdout.on('data',function(chunk){

            //var textChunk = chunk.toString('utf8');// buffer to string
            json_data = JSON.parse(chunk);
            //console.log("tts",json_data);
            //console.log("chunk",chunk);
            //util.log(chunk);
            
            callback(null, json_data);
            
        });

        process.on('close', function (code) {
            console.log("close",code);
        });

        process.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
        process.stdout.on('error', function( err ) {
            if (err.code == "EPIPE") {
                console.log("error",err);
                py.exit(0);
            }
        });
        process.stdout.on('end', function(){
        	//var str = dataString.substring(1,dataString.length);
        	console.log("end");
        });
        process.stdin.write(JSON.stringify(data));

        process.stdin.end();
        
    },
    getDthlink: function (data, callback) {
        var util = require("util");
        //var data={a:5,b:5};
        var spawn = require("child_process").spawn;
        //get_name_cmdline
        //get_DH_cmdline
        var process = spawn('python',["./script/get_DH_cmdline.py"], {detached: true});
        process.unref();
        util.log('readingin');

        process.stdout.on('data',function(chunk){

            //var textChunk = chunk.toString('utf8');// buffer to string
            json_data = JSON.parse(chunk);
            console.log(json_data);
            //console.log("chunk",chunk);
            //util.log(chunk);
            callback(null, json_data);
            
        });

        process.on('close', function (code) {
            console.log("close",code);
        });

        process.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
        process.stdout.on('error', function( err ) {
            if (err.code == "EPIPE") {
                console.log("error",err);
                py.exit(0);
            }
        });
        process.stdout.on('end', function(){
        	//var str = dataString.substring(1,dataString.length);
        	console.log("end");
        });
        process.stdin.write(JSON.stringify(data));

        process.stdin.end();
        
    },
    getttsSpeech:function (data, callback){
        tts = require('node-tts-api');
 
        example = "Hello World";
        console.log(data);
        tts.getSpeech(example, function(error, link) {
            console.log("tts",error);
            
            return console.log(link);
        });
    },
};
module.exports = _.assign(module.exports, exports, model);