var exports = _.cloneDeep(require("sails-wohlig-service"));
const record = require('node-record-lpcm16');
const fs = require('fs');
const stream = require('stream');
// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');
// Your Google Cloud Platform project ID
const projectId = 'chatbot-176810';

// Instantiates a client
const speech1 = Speech({
  projectId: projectId,
  keyFilename:"./script/chatbot-f9ab3f6d1b3b.json"
});
// Instantiates a client
//const speech1 = Speech();

// The encoding of the audio file, e.g. 'LINEAR16'
const encoding = 'LINEAR16';

// The sample rate of the audio file in hertz, e.g. 16000
const sampleRateHertz = 16000;

// The BCP-47 language code to use, e.g. 'en-US'
const languageCode = 'en-US';
const request = {
    config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode
    },
    interimResults: false // If you want interim results, set this to true
};

var model = {
    startRecording:function(data,callback) {
        speech1.recognize(request).then(function(responses) {
            var response = responses[0];
            // doThingsWith(response) 
            callback(null,responses);
        })
        .catch(function(err) {
            console.error(err);
        });
        const recognizeStream = speech1.streamingRecognize(request).on('error', console.error).on('data', (data) =>
            process.stdout.write(
                (data.results[0] && data.results[0].alternatives[0])
                ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                : `\n\nReached transcription time limit, press Ctrl+C\n`)
            );
        // Start recording and send the microphone input to the Speech API
        record.start({
            sampleRateHertz: sampleRateHertz,
            threshold: 0,
            // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
            verbose: false,
            recordProgram: 'rec', // Try also "arecord" or "sox"
            silence: '10.0'
        }).on('error', console.error).pipe(recognizeStream);
    },
    stopRecording:function(data,callback) {
        // Create a recognize stream
        // const recognizeStream = speech.streamingRecognize(request).on('error', console.error).on('data', (data) =>
        //     process.stdout.write(
        //         (data.results[0] && data.results[0].alternatives[0])
        //         ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        //         : `\n\nReached transcription time limit, press Ctrl+C\n`)
        //     );
            
        //);
        speech.recognize(request).then(function(responses) {
            var response = responses[0];
            // doThingsWith(response) 
            callback(null,responses);
        })
        .catch(function(err) {
            console.error(err);
        });
    },
  };
 module.exports = _.assign(module.exports, exports, model);

// var exports = _.cloneDeep(require("sails-wohlig-service"));
// var pythonpath = "http://35.161.160.7:8092/";
// var pythonpath = "http://localhost:8080/script/";
// const AVS = require('alexa-voice-service');
// const player = AVS.Player;
// const avs = new AVS({
//     debug: true,
//     clientId: 'amzn1.application-oa2-client.9a35d0a30b8d434c916d74871bf80ab3',
//     deviceId: 'test_device',
//     deviceSerialNumber: 123,
//     redirectUri: `https://${window.location.host}/authresponse`
// });
// window.avs = avs;
// var model = {
//     startRecoding1:function(data,callback) {
//         avs.startRecording();
//         callback(null, {recording:1});
//     },
//     stopRecording1:function(data,callback) {
//         avs.stopRecording().then(dataView => {
//             avs.player.emptyQueue()
//             .then(() => avs.audioToBlob(dataView))
//             .then(blob => logAudioBlob(blob, 'VOICE'))
//             .then(() => avs.player.enqueue(dataView))
//             .then(() => avs.player.play())
//             .catch(error => {
//                 console.error(error);
//             });

//                 var ab = false;
//             //sendBlob(blob);
//             audioreq = {xhr, response};
//             avs.sendAudio(dataView).then((audioreq) => {

//             var promises = [];
//             var audioMap = {};
//             var directives = null;

//             if (response.multipart.length) {
//                 response.multipart.forEach(multipart => {
//                 var body = multipart.body;
//                 if (multipart.headers && multipart.headers['Content-Type'] === 'application/json') {
//                     try {
//                     body = JSON.parse(body);
//                     } catch(error) {
//                     console.error(error);
//                     }

//                     if (body && body.messageBody && body.messageBody.directives) {
//                     //directives = body.messageBody.directives;
//                         directives = "SpeechSynthesizer";
//                     }
//                 } else if (multipart.headers['Content-Type'] === 'audio/mpeg') {
//                     const start = multipart.meta.body.byteOffset.start;
//                     const end = multipart.meta.body.byteOffset.end;

//                     /**
//                      * Not sure if bug in buffer module or in http message parser
//                      * because it's joining arraybuffers so I have to this to
//                      * seperate them out.
//                      */
//                     var slicedBody = xhr.response.slice(start, end);

//                     //promises.push(avs.player.enqueue(slicedBody));
//                     audioMap[multipart.headers['Content-ID']] = slicedBody;
//                 }
//                 });

//                 function findAudioFromContentId(contentId) {
//                 contentId = contentId.replace('cid:', '');
//                 for (var key in audioMap) {
//                     if (key.indexOf(contentId) > -1) {
//                     return audioMap[key];
//                     }
//                 }
//                 }

//                 directives.forEach(directive => {
//                 if (directive.namespace === 'SpeechSynthesizer') {
//                     if (directive.name === 'speak') {
//                     const contentId = directive.payload.audioContent;
//                     const audio = findAudioFromContentId(contentId);
//                     if (audio) {
//                         // avs.audioToBlob(audio)
//                         // .then(blob => logAudioBlob(blob, 'RESPONSE'));
//                         // promises.push(avs.player.enqueue(audio));
//                         callback(null,{"audio":audio});
//                     }
//                     }
//                 } else if (directive.namespace === 'AudioPlayer') {
//                     if (directive.name === 'play') {
//                     const streams = directive.payload.audioItem.streams;
//                     streams.forEach(stream => {
//                         const streamUrl = stream.streamUrl;

//                         const audio = findAudioFromContentId(streamUrl);
//                         if (audio) {
//                         avs.audioToBlob(audio)
//                         .then(blob => logAudioBlob(blob, 'RESPONSE'));
//                         promises.push(avs.player.enqueue(audio));
//                         } else if (streamUrl.indexOf('http') > -1) {
//                         const xhr = new XMLHttpRequest();
//                         const url = `/parse-m3u?url=${streamUrl.replace(/!.*$/, '')}`;
//                         xhr.open('GET', url, true);
//                         xhr.responseType = 'json';
//                         xhr.onload = (event) => {
//                             const urls = event.currentTarget.response;

//                             urls.forEach(url => {
//                             avs.player.enqueue(url);
//                             });
//                         };
//                         xhr.send();
//                         }
//                     });
//                     } else if (directive.namespace === 'SpeechRecognizer') {
//                     if (directive.name === 'listen') {
//                         const timeout = directive.payload.timeoutIntervalInMillis;
//                         // enable mic
//                     }
//                     }
//                 }
//                 });

//                 if (promises.length) {
//                 Promise.all(promises)
//                 .then(() => {
//                     avs.player.playQueue()
//                 });
//                 }
//             }

//             })
//             .catch(error => {
//             console.error(error);
//             });
//         });
        
//     },
    
// };
// module.exports = _.assign(module.exports, exports, model);