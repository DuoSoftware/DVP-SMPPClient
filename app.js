/**
 * Created by Sukitha on 4/25/2017.
 */


var amqp = require('amqp');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var request = require('request');
var format = require("stringformat");
var util = require("util");
var mongoose = require('mongoose')
var mongomodels = require('dvp-mongomodels');
var CreateEngagement = require('dvp-common/ServiceAccess/common').CreateEngagement;
var CreateComment = require('dvp-common/ServiceAccess/common').CreateComment;
var CreateTicket = require('dvp-common/ServiceAccess/common').CreateTicket;
var GetCallRule = require('dvp-common/ServiceAccess/common').GetCallRule;
var UpdateComment = require('dvp-common/ServiceAccess/common').UpdateComment;
var config = require('config');
var uuid = require('node-uuid');
var Render = require('dvp-common/TemplateGenerator/template.js').Render;
//var queueHost = format('amqp://{0}:{1}@{2}:{3}',config.RabbitMQ.user,config.RabbitMQ.password,config.RabbitMQ.ip,config.RabbitMQ.port);
var queueName = config.Host.smsQueueName;
var smpp = require('./Workers/smpp');
var http = require('./Workers/http');

var smsmethod = config.Host.method || "smpp";
//var mongomodels = require('dvp-mongomodels');


var mongoip = config.Mongo.ip;
var mongoport = config.Mongo.port;
var mongodb = config.Mongo.dbname;
var mongouser = config.Mongo.user;
var mongopass = config.Mongo.password;
var mongoreplicaset=config.Mongo.replicaset;

var mongoose = require('mongoose');
var connectionstring = '';
mongoip = mongoip.split(',');

if(util.isArray(mongoip)){
    if(mongoip.length > 1){
        mongoip.forEach(function(item){
            connectionstring += util.format('%s:%d,',item,mongoport)
        });

        connectionstring = connectionstring.substring(0, connectionstring.length - 1);
        connectionstring = util.format('mongodb://%s:%s@%s/%s',mongouser,mongopass,connectionstring,mongodb);

        if(mongoreplicaset){
            connectionstring = util.format('%s?replicaSet=%s',connectionstring,mongoreplicaset) ;
            logger.info("connectionstring ...   "+connectionstring);
        }
    }
    else
    {
        connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',mongouser,mongopass,mongoip[0],mongoport,mongodb);
    }
}else {

    connectionstring = util.format('mongodb://%s:%s@%s:%d/%s', mongouser, mongopass, mongoip, mongoport, mongodb);

}
logger.info("connectionstring ...   "+connectionstring);

mongoose.connection.on('error', function (err) {
    logger.error(err);
});

mongoose.connection.on('disconnected', function () {
    logger.error('Could not connect to database');
});

mongoose.connection.once('open', function () {
    logger.info("Connected to db");
});

mongoose.connect(connectionstring);

//host: 'localhost'
//    , port: 5672
//    , login: 'guest'
//    , password: 'guest'
//    , connectionTimeout: 10000
//    , authMechanism: 'AMQPLAIN'
//    , vhost: '/'
//    , noDelay: true

var amqpIPs = [];
if(config.RabbitMQ.ip) {
    amqpIPs = config.RabbitMQ.ip.split(",");
}


var queueConnection = amqp.createConnection({
    //url: queueHost,
    host: amqpIPs,
    port: config.RabbitMQ.port,
    login: config.RabbitMQ.user,
    password: config.RabbitMQ.password,
    vhost: config.RabbitMQ.vhost,
    noDelay: true,
    heartbeat:10
}, {
    reconnect: true,
    reconnectBackoffStrategy: 'linear',
    reconnectExponentialLimit: 120000,
    reconnectBackoffTime: 1000
});

queueConnection.on('ready', function () {

    logger.debug("Queue connection completed.......");
    queueConnection.queue(queueName, {durable: true, autoDelete: false},function (q) {
        q.bind('#');
        q.subscribe({
            ack: true,
            prefetchCount: 5
        }, function (message, headers, deliveryInfo, ack) {

            /*message = JSON.parse(message.data.toString());*/
            //logger.info(message);
            if (!message || !message.to || !message.company || !message.tenant) {
                logger.error('SMS - Invalid message, skipping');
                return ack.acknowledge();
            }
            //!message.from ||
            GetCallRule(message.company , message.tenant, message.from, message.to, "SMS", function(isDone, result){
                if(isDone){

                    message.from = config.Host.smsNumber;
                    if(result && result.ANI){

                        message.from = result.ANI;
                    }

                    //messgae.from = 'COMBANK';

                    if(result && result.DNIS){
                        message.to = result.DNIS;
                    }

                    SendSMS(message,  deliveryInfo.deliveryTag.toString('hex'), ack);

                    // else{
                    //
                    //     logger.error("There is no trunk number found system will proceed with default SMS number");
                    //
                    //     SendSMS(message,  deliveryInfo.deliveryTag.toString('hex'), ack);
                    // }

                }else{

                    logger.error("There is no trunk number found system will proceed with default SMS number");
                    message.from = config.Host.smsNumber;
                    SendSMS(message,  deliveryInfo.deliveryTag.toString('hex'), ack);
                }
            });
            ///////////////////////////create body/////////////////////////////////////////////////

        });
    });
});

function SendSMPP(company, tenant, mailoptions, cb){

    logger.info("Send SMS started .....");


    smsOperation = smpp.SendSMPP;
    if(smsmethod === 'http'){
        smsOperation = http.sendHTTP;

    }

    smsOperation(tenant, company, mailoptions.from, mailoptions.to, mailoptions.text, function (_isDone, id) {

        try {

            if (_isDone) {

                logger.debug("Successfully send sms");

                //channel, company, tenant, from, to, direction, session, data, user,channel_id,contact,  cb

                CreateEngagement('sms', company, tenant, mailoptions.from, mailoptions.to, 'outbound', id, mailoptions.text, undefined, undefined, undefined, function (done, result) {
                    if (done) {
                        logger.debug("engagement created successfully");
                        if (mailoptions.reply_session) {

                            // CreateComment('sms', 'text', company, tenant, mailoptions.reply_session, mailoptions.author, result, function (done) {
                            //     if (!done) {
                            //         logger.error("comment creation failed");
                            //         return cb(true);
                            //     } else {
                            //         logger.debug("comment created successfully");
                            //         return cb(true);
                            //     }
                            // });


                            UpdateComment(tenant, company, mailoptions.comment,result._id, function (done) {

                                return cb(true);
                                if (done) {
                                    logger.info("Update Comment Completed ");

                                } else {

                                    logger.error("Update Comment Failed ");

                                }
                            });

                        }
                        else {


                            if (mailoptions.ticket) {

                                var ticket_type = 'action';
                                var ticket_priority = 'low';
                                var ticket_tags = [];

                                if (mailoptions.ticket_type) {
                                    ticket_type = mailoptions.ticket_type;
                                }

                                if (mailoptions.ticket_priority) {
                                    ticket_priority = mailoptions.ticket_priority;
                                }

                                if (mailoptions.ticket_tags) {
                                    ticket_tags = mailoptions.ticket_tags;
                                }

                                CreateTicket("sms", sessionid, result.profile_id, company, tenant, ticket_type, mailoptions.text, mailoptions.text, ticket_priority, ticket_tags, function (done) {
                                    if (done) {
                                        logger.info("Create Ticket Completed ");
                                    } else {
                                        logger.error("Create Ticket Failed ");
                                    }
                                    return cb(true);
                                });
                            } else {

                                if (mailoptions.comment) {

                                    UpdateComment(mailoptions.comment, id, function (done) {
                                        if (done) {
                                            logger.info("Update Comment Completed ");

                                        } else {

                                            logger.error("Update Comment Failed ");

                                        }

                                        return cb(true);
                                    });

                                } else {
                                    return cb(true);
                                }
                            }

                        }
                    } else {
                        logger.error("engagement creation failed");
                        return cb(false);
                    }
                });

            } else {

                logger.error("Send SMS Failed ");
                return cb(false);
            }
        }
        catch (excep) {

            logger.error("Send SMS Failed "+excep);
            return cb(false);
        }

    });


};

function SendSMS(message, deliveryInfo, ack) {


    logger.info("DVP-SocialConnector.SendSMS Internal method ");
    var jsonString;
    var tenant = message.tenant;
    var company = message.company;



    var mailOptions = {
        from: message.from,
        to: message.to,
        text: message.body,
        ticket: message.ticket,
        comment: message.comment,
        author: message.author,
        reply_session: message.reply_session,
        ticket_type : message.ticket_type,
        ticket_priority : message.ticket_priority,
        ticket_tags : message.ticket_tags
    };


    logger.info(message);

    if(message && message.template){


        logger.info("render started");

        Render(message.template,company,tenant,message.Parameters, function(isDone, message){
            logger.info("render is completed");

            if(isDone && message){

                mailOptions.text = message;

                ack.acknowledge();
                SendSMPP(company, tenant, mailOptions, function (done) {

                    if (done === true){

                        logger.info("Send SMPP completed");

                    }
                    else
                    {
                        logger.info("Send SMPP failed");

                    }

                });


            }else{


                logger.error("Render failed ");
                //ack.reject(true);
                ack.acknowledge();

            }
        });

    }else {

        ack.acknowledge();

        SendSMPP(company, tenant, mailOptions, function (done) {

            if (done === true){

                logger.info("Send SMPP completed");

            }
            else
            {
                logger.info("Send SMPP failed");

            }
        });
    }

};

module.exports.SendSMS = SendSMS;
