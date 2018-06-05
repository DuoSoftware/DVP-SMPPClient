module.exports = {

  "Redis":
  {
    "mode":"sentinel",//instance, cluster, sentinel
    "ip": "",
    "port": 6389,
    "user": "",
    "password": "",
    "sentinels":{
      "hosts": "",
      "port":16389,
      "name":"redis-cluster"
    }

  },

  "Security":
  {

    "ip" : "",
    "port": 6389,
    "user": "",
    "password": "",
    "mode":"sentinel",//instance, cluster, sentinel
    "sentinels":{
      "hosts": "",
      "port":16389,
      "name":"redis-cluster"
    }
  },


  "Host":
  {
    "smsQueueName": "SMSOUT",
    "smsNumber": ""
  },



  "SMSServer":{


    "ip":"",
    "port":"1401",
    "password":"bar",
    "user":"foo"



  },



  "Mongo":
  {
    "ip":"",
    "port":"27017",
    "dbname":"",
    "password":"",
    "user":"",
   
  },

  "SMPPClient":{

    "ip":"",
        
    "port":"2777",
    "password":"",

    "user":"",

    "system_type":"380666000600",
    "address_range": "380666000600"
//"veerysms"

  },



  "LBServer" : {

    "ip": "",
    "port": "4647"

  },


  "RabbitMQ":
  {
    "ip": "",
    "port": 5672,
    "user": "",
    "password": "",
    "vhost":'/'
  },


  "Services" : {
    "accessToken":"",

    "resourceServiceHost": "",
    "resourceServicePort": "8831",
    "resourceServiceVersion": "1.0.0.0",


    "interactionurl": "",
    "interactionport": '3637',
    "interactionversion":"1.0",
    //


    "cronurl": "",
    "cronport": '8080',
    "cronversion":"1.0.0.0",


    "ticketServiceHost": "", 
    "ticketServicePort": "3636",
    "ticketServiceVersion": "1.0.0.0",

    "ardsServiceHost": "",
    "ardsServicePort": "8831",
    "ardsServiceVersion": "1.0.0.0",


    "ruleserviceurl" : "",
    "ruleserviceport" : "8888",
    "ruleserviceversion" : "1.0.0.0",

    "dynamicconfigurl" : "",
    "dynamicconfigport" : "8888",
    "dynamicconfigversion" : "1.0.0.0",

    "httprogrammingurl" : "127.0.0.1",
        
    "httprogrammingport" : "8086",
    "httprogrammingversion" : "1.0.0.0"




  }

};
