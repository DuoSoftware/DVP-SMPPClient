var request = require('request');
var config = require('config');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var stringInject = require('stringinject');
var util = require("util");
var uuidv4 = require('uuid/v4');



var url = config.HTTPClient.URL;
var httpMethod = config.HTTPClient.Method;
var token = config.HTTPClient.token;


var sendHTTP = function(tenant, company, from, to, text, cb) {

    var message = {
        from: from,
        to: to,
        token: token,
        text: text
    }
    var smsURL = stringInject.default(url, message);

    request({
        method: httpMethod,
        url: smsURL
    }, function (_error, _response, datax) {

        try {

            if (!_error && _response && _response.statusCode == 200) {

                var id = uuidv4();

                return cb(true,id.toString());

            } else {

                logger.error(util.format("Message send failed due to http error from %s to %s text %s", from, to, text));
                return cb(false);

            }
        }
        catch (excep) {

            return cb(false);
        }
    });
}


module.exports.sendHTTP = sendHTTP;