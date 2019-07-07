var express     = require('express');
var zendesk     = require('node-zendesk');
var fs          = require('fs');
var bodyParser  = require("body-parser")

var app = express();

var port = 5555,
    ip   = 'localhost';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

var client = zendesk.createClient({
  username:  '{Zendesk Username}',
  token:     '{Zendesk Token}',
  remoteUri: 'https://{Zendesk Domain}.zendesk.com/api/v2'
});

// Option to have a log file if you wanted.
//
// function writeLog(a){
//   if(a == "error"){
//     var fileContent = "error: "+message;
//     var filepath = "c:/{your path}/"+mm+dd+yy+"error_log.txt";
//   } else if(a == "ticket_log"){
//     var fileContent = "Tickets that were reviewed: "+JSON.stringify(tickets, null, 2, true);
//     var filepath = "c:/{your path}/"+mm+dd+yy+"ticket_log.txt";
//   } else if (a == "survey_log"){
//     var fileContent = "User that were changed: "+JSON.stringify(users, null, 2, true);
//     var filepath = "c:/{your path}/"+mm+dd+yy+"survey_log.txt";
//   } else{
//     var fileContent = "results: "+JSON.stringify(resolts, null, 2, true);
//     var filepath = "c:/{your path}/"+mm+dd+yy+"results_log.JSON";
//   }
//   fs.writeFile(filepath, fileContent, (err) => {
//       if (err) throw err;
//       console.log(fileContent)
//       console.log("The file was succesfully saved!");
//   });
// };



app.get('/', function(req,res){
  res.render('home.ejs');
})

app.post('/searches', function(req,res){
  var showTickets='';
  var rawTickets= [];
  tickets=[];
  var rawIds = [];
  var startDate = req.body.sy+'-'+req.body.sm+'-'+req.body.sd;
  var endDate   = req.body.ey+'-'+req.body.em+'-'+req.body.ed;;
  var query     = 'updated_at>"' + startDate + '"updated_at<="' + endDate + '"+status=closed';
  client.search.query(query, function(err, req, result){
    if(err){
      console.log("1st: "+err);
    } else {
      result.forEach(function(rawticket){
      var newTicket = {
        ticketID: rawticket.id,
        ticketStatus: rawticket.status,
        ticketRequester: rawticket.requester_id,
        closeDate: rawticket.updated_at
      }
      tickets.push(newTicket)
      rawIds.push(newTicket.ticketRequester);
    });
    idNumbers = rawIds;
    client.users.showMany(idNumbers, function(err, req, result){
      var users = [];
        if(err){
          console.log("2nd: "+err)
        } else {
          result.forEach(function(rawmyUser){
            var myUser = {
              id: rawmyUser.id,
              name: rawmyUser.name,
              email: rawmyUser.email,
              survey: rawmyUser.user_fields.send_survey
            }
            if(myUser.survey == 'no'){
              users.push(myUser)
              tickets.forEach(function(ticket){
                if(myUser.id === ticket.ticketRequester){
                  var basicInfo = {
                    id: ticket.ticketID,
                    status: ticket.ticketStatus,
                    closed: ticket.closeDate,
                    user: myUser.name,
                    email: myUser.email,
                    survey: myUser.survey,
                    user_id: ticket.ticketRequester
                  }
                  rawTickets.push(basicInfo);
                }
              })
              showTickets = rawTickets
              return users,showTickets;
            }
          });
          res.render('show.ejs', {tickets:showTickets,users:users, ids:idNumbers})
        }
      })
    }
  })
})

app.post('/update',function(req,res){
var info = req.body.id_numbers;
var message = '';
var rawMessages = [];
console.log(req.body.id_numbers);
console.log(info);
client.users.updateMany(info,{"user":{"user_fields":{ "send_survey": "Yes" }}}, function(err, req, result){
  if(err){
    console.log(err);
  } else {
    client.jobstatuses.show(result.id, function(err, req, results){
      if(err){
        console.log(err);
      } else {
        results.job_statuses.forEach(function(status){
          if(status.status !== "completed"){
            var statuses = {
              url: status.url,
              status: status.status,
              message: statuses.message,
              resultMessage: statuses.results.message,
              resultStatus: statuses.results.success
            }
            rawMessages.push(statuses);
            return rawMessages
          }
          message = rawMessages;
          return message
        })
        console.log(message);
        console.log(message.length);
        if(message.length < 1){
          res.redirect('/');
        } else {
          res.render('results.ejs', {results:message});
        }
      }
    })
    }
  })
})


app.listen(port,ip, function(){
  console.log('App is currently running on: ' + ip + ':' + port + '!!!');
})
