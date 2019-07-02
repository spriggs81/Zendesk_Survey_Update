var zendesk = require('node-zendesk');
var fs      = require('fs');

var client = zendesk.createClient({
  username:  'john.spriggs@vizexplorer.com',
  token:     'cx6GDL27A4NjmdfHQdpL7LmDV61I8xPQqtIJK62m',
  remoteUri: 'https://vizexplorersupport.zendesk.com/api/v2'
});

// client.users.list(function (err, req, result) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(JSON.stringify(result[0], null, 2, true));//gets the first result
// });

// client.tickets.show(13080, function(err, req, result){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// })
// client.tickets.getComments(13080, function(err, req, result){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(JSON.stringify(result, null, 2, true));
//   }
// })

//
client.users.show(22406471568, function(err, req, result){
  if(err){
    console.log(err);
  } else{
    console.log("user data:  "+JSON.stringify(result, null, 2, true));
  }
})

// client.tickets.exportAudit(13700, function(err, req, result){
//   if(err){
//     console.log(err);
//   } else{
//     console.log(""JSON.stringify(result, null, 2, true));
//   }
// })

// client.users.search({'name':"TestMePlease"} , function(err, req, result){
//   if(err){
//     console.log(err);
//   } else{
//     result.forEach(function(user){
//       if(user.name == 'TestMePlease'){
//         console.log(user)
//       }
//     });
//
//     console.log("done");
//   }
// });

//***********************************************************
//MY Working Code
//***********************************************************
// var idNumbers = [];
// var query = 'updated_at>"2019-05-01"+updated_at<"2019-06-09"+status=closed';
// client.search.query(query, function(err, req, result){
//   if(err){
//     console.log(err);
//   } else {
//     result.forEach(function(rawticket){
//
//     var ticket = {
//       ticketID: rawticket.id,
//       ticketStatus: rawticket.status,
//       ticketRequester: rawticket.requester_id,
//       closeDate: rawticket.updated_at
//     }
//
//     console.log(ticket)
//     idNumbers.push(ticket.ticketRequester);
//     return idNumbers;
//     })
//     client.users.showMany(idNumbers, function(err, req, result){
//       if(err){
//         console.log(err);
//       } else {
//         result.forEach(function(myUser){
//           var name = myUser.name;
//           var email = myUser.email;
//           var survey = myUser.user_fields.send_survey;
//           if(survey == 'no'){
//             console.log(name+" / "+email+" / "+survey);
//           }
//         })
//       }
//     })
//   }
// })


//*********************************************************************

// var fileContent = ;
// var filepath = "c:/users/jspriggs/documents/mynewfile.txt";
//
// fs.writeFile(filepath, fileContent, (err) => {
//     if (err) throw err;
//
//     console.log("The file was succesfully saved!");
// });

// client.users.update(383304716133,{"user":{"user_fields":{ "send_survey": "yes" }}}, function(err, req, result){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// })

// var myComms = [];
// client.tickets.getComments(13080, function(err, req, result){
//   if(err){
//     console.log(err);
//   } else {
//     result.forEach(function(comment){
//       var rawJSON = (JSON.stringify(comment, null, 2, true));
//       myComms.push(rawJSON);
//       return myComms
//     })
//
//     writeLog(myComms);
//   }
// })
