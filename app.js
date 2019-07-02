var express = require('express');
var zendesk = require('node-zendesk');
var fs      = require('fs');

var app = express();

var port = 5555,
    ip   = 'localhost';

var idNumbers = '';
var showTickets = '';
var tickets = [];
var users = [];
var message = '';
var date = new Date();
var mm = date.getMonth();
var dd = date.getDate();
var yy = date.getFullYear();
date = date.toString()


var client = zendesk.createClient({
  username:  'john.spriggs@vizexplorer.com', //Update your email address
  token:     'cx6GDL27A4NjmdfHQdpL7LmDV61I8xPQqtIJK62m',
  remoteUri: 'https://vizexplorersupport.zendesk.com/api/v2'
});
//
// function writeLog(a){
//   if(a == "error"){
//     var fileContent = "error: "+message;
//     var filepath = "c:/users/jspriggs/documents/"+mm+dd+yy+"error_log.txt";
//   } else if(a == "ticket_log"){
//     var fileContent = "Tickets that were reviewed: "+JSON.stringify(tickets, null, 2, true);
//     var filepath = "c:/users/jspriggs/documents/"+mm+dd+yy+"ticket_log.txt";
//   } else if (a == "survey_log"){
//     var fileContent = "User that were changed: "+JSON.stringify(users, null, 2, true);
//     var filepath = "c:/users/jspriggs/documents/"+mm+dd+yy+"survey_log.txt";
//   } else{
//     var fileContent = "results: "+JSON.parse(a);
//     var filepath = "c:/users/jspriggs/documents/"+mm+dd+yy+"results_log.JSON";
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

app.get('/searches', function(req,res){
  var rawTickets= [];
  tickets=[];
  var rawIds = [];
  var startDate = "2019-05-01";
  var endDate   = "2019-06-20";
  var query     = 'updated_at>"' + startDate + '"updated_at<"' + endDate + '"+status=closed';
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
      tickets.push(rawticket)
      rawIds.push(ticket.ticketRequester);
    });
    idNumbers = rawIds;
    return idNumbers, tickets;
    });
      client.users.showMany(idNumbers, function(err, req, result){
        if(err){
          console.log("2nd: "+err)
        } else {
          console.log(result[0])
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
          res.render('show.ejs', {tickets:showTickets,users:users})
        }
      })
    }
  })
})

app.post('/update',function(req,res){})


app.listen(port,ip, function(){
  console.log('App is currently running on: ' + ip + ':' + port + '!!!');
})
//zendesk ticket i deleted and want to check: 13764
var uniqueArrayOfObjects = arrayOfObjects.filter(function(obj, index, self) { return index === self.findIndex(function(t) { return t['obj-property'] === obj['obj-property'] }); });
