module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    startRecording: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotvoice.startRecording(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    stopRecording: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotvoice.stopRecording(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
};
module.exports = _.assign(module.exports, controller);