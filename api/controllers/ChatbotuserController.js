module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    loginuser: function (req, res) {
        console.log(req.connection.remoteAddress);
        if (req.body) {
            Chatbotuser.loginuser(req.body, res.callback);
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
    changepassword: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.changepassword(req.body, res.callback);
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
    forgotpassword: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.forgotpassword(req.body, res.callback);
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
    isvalidpasswordresetreq: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.isvalidpasswordresetreq(req.body, res.callback);
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
    resetpassword: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.resetpassword(req.body, res.callback);
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
    sendmail:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.sendmail(req.body, res.callback);
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