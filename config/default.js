module.exports = {

    "Redis":
        {
            "mode":"sentinel",//instance, cluster, sentinel
            "ip": "45.55.142.207",
            "port": 6389,
            "user": "duo",
            "password": "DuoS123",
            "sentinels":{
                "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
                "port":16389,
                "name":"redis-cluster"
            }

        },

    "Security":
        {

            "ip" : "45.55.142.207",
            "port": 6389,
            "user": "duo",
            "password": "DuoS123",
            "mode":"sentinel",//instance, cluster, sentinel
            "sentinels":{
                "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
                "port":16389,
                "name":"redis-cluster"
            }
        },


    "Host":
        {
            "smsQueueName": "SMSOUT",
            "smsNumber": "COMBANK",
            // /"smsNumber": "0710400400",ANK
            "method": "smpp"
        },



    "SMSServer":{


        "ip":"159.203.109.43",
        "port":"1401",
        "password":"bar",
        "user":"foo"



    },



    "Mongo":
        {
            "ip":"104.236.231.11",
            "port":"27017",
            "dbname":"dvpdb",
            "password":"DuoS123",
            "user":"duo",
            //"replicaset" :"104.236.231.11"
        },

//     "SMPPClient":{
//
//         "ip":"81.201.83.10",
//         //"81.201.83.10",
//         "port":"2777",
//         "password":"Face@123",
// //"Veery@123",
//         "user":"facetonesms",
//
//         "system_type":"380666000600",
//         "address_range": "380666000600"
// //"veerysms"
//
//     },


    "SMPPClient":{

        "ip":"220.247.223.51",
        //"81.201.83.10",
        "port":"2775",
        "password":"",
//"Veery@123",
        "user":"",

        "system_type":"MNO",
        "address_range": "380666000600"
//"veerysms"

    },

//&from={from}
    "HTTPClient":{

        "URL": "https://cpsolutions.dialog.lk/index.php/cbs/sms/send?destination=94{to}&q={token}&message={text}",
        "Method": "GET",
        "token":"14181869886758"


    },



    "LBServer" : {

        "ip": "104.236.197.119",
        "port": "4647"

    },


    "RabbitMQ":
        {
            "ip": "45.55.142.207",
            "port": 5672,
            "user": "admin",
            "password": "admin",
            "vhost":'/'
        },


    "Services" : {
        "accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo",

        "resourceServiceHost": "resourceservice.app.veery.cloud",
        "resourceServicePort": "8831",
        "resourceServiceVersion": "1.0.0.0",


        "interactionurl": "interactions.app.veery.cloud",
        "interactionport": '3637',
        "interactionversion":"1.0",
        //


        "cronurl": "scheduleworker.app.veery.cloud",//scheduleworker.app.veery.cloud
        "cronport": '8080',
        "cronversion":"1.0.0.0",


        "ticketServiceHost": "liteticket.app.veery.cloud", //liteticket.app.veery.cloud
        "ticketServicePort": "3636",
        "ticketServiceVersion": "1.0.0.0",

        "ardsServiceHost": "ardsliteservice.app.veery.cloud",
        "ardsServicePort": "8831",
        "ardsServiceVersion": "1.0.0.0",


        "ruleserviceurl" : "ruleservice.app.veery.cloud",
        "ruleserviceport" : "8888",
        "ruleserviceversion" : "1.0.0.0",

        "dynamicconfigurl" : "dynamicconfigurationgenerator.app.veery.cloud",
        "dynamicconfigport" : "8888",
        "dynamicconfigversion" : "1.0.0.0",

        "httprogrammingurl" : "127.0.0.1",
        //"httpprogrammingapi.app.veery.cloud",
        "httprogrammingport" : "8086",
        "httprogrammingversion" : "1.0.0.0"




    }

};
