var express = require('express');
var zendesk = require('node-zendesk');
var fs      = require('fs');

var app = express();

var port = 5555,
ip   = 'localhost';

// var idNumbers = '';
var showTickets = '';
// var tickets = '';
var users = '';
var message = '';
var completedTask = '';
var date = new Date();
var mm = date.getMonth();
var dd = date.getDate();
var yy = date.getFullYear();
date = yy+'-'+mm+'-'+dd;
console.log(date);

var client = zendesk.createClient({
  username:  '{username}', //Update your email address
  token:     '{token}',
  remoteUri: 'https://domain.zendesk.com/api/v2'
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
  dateSearch("2018-05-01","2019-06-20", function(){
    res.render('show.ejs', {tickets:showTickets,users:users})
  });
});

app.get('/update',function(req,res){

})


app.listen(port,ip, function(){
  console.log('App is currently running on: ' + ip + ':' + port);
})
//zendesk ticket i deleted and want to check: 13764
//var uniqueArrayOfObjects = arrayOfObjects.filter(function(obj, index, self) { return index === self.findIndex(function(t) { return t['obj-property'] === obj['obj-property'] }); });

function dateSearch(start,end){
  tickets=[];
  var rawIds = [];
  var query     = 'updated_at>"' + start + '"updated_at<"' + end + '"+status=closed';
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

        tickets.push(JSON.stringify(newTicket, null, 2, true))

        rawIds.push(newTicket.ticketRequester);

      });
      idNumbers = rawIds;
    }
    searchIds(idNumbers, tickets);
    console.log("done query 1");
  })
}

function searchIds(ids, tickets){
  var rawTickets= [],
      newUsers  = [];
  client.users.showMany(ids, function(err, req, result){
    if(err){
      console.log("2nd: "+err)
    } else {
      //console.log(result[0])
      result.forEach(function(rawmyUser){
        var myUser = {
          id: rawmyUser.id,
          name: rawmyUser.name,
          email: rawmyUser.email,
          survey: rawmyUser.user_fields.send_survey
        }
        if(myUser.survey == 'no'){
          newUsers.push(myUser)
          tickets.forEach(function(ticket){
            var id = ticket[3];
            console.log(id);
            if(!ticket.ticketRequester){
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
        }
      });
      users       = newUsers;
      showTickets = rawTickets;
    }
  });
}

function serverSearch(users,showTickets){
}
