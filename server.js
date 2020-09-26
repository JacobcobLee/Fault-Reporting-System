const express = require("express"),
  app = express(),
  port = process.env.PORT || 9998;
var http = require("http");
var moment = require("moment");
const nodemailer = require("nodemailer");

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bch-fr.firebaseio.com/",
  storageBucket: "bch-fr.appspot.com",
});

app.use(require("./routes/v1.js"));



// Retrieve new posts as they are added to the database
console.log(moment().utcOffset(8).format("YYYY/MM/DD HH:mm:ss"));
admin
  .database()
  .ref("reports")
  .orderByChild("dateTime")
  .startAt(moment().utcOffset(8).format("YYYY/MM/DD HH:mm:ss"))
  .on("child_added", function (snapshot) {
    // Nodemailer here
    console.log(snapshot.val());

      function getIssueAndLocAlpha() {
        //ok im gonna try to store the objects in an array then extract/filter them into a array?
        let testString = "";
        if (!(snapshot.val().problem.checkbox.name == undefined)) {
          testString =
            snapshot.val().problem.checkbox.name +
            "  regarding  " +
            snapshot.val().problem.checkbox.answer;
          console.log("Defined " + testString);
        } else {
          for (i = 0; i < snapshot.val().problem.checkbox.length; i++) {
            testString +=
              snapshot.val().problem.checkbox[i].name +
              " :   " +
              snapshot.val().problem.checkbox[i].answer[0];
            if (i < snapshot.val().problem.checkbox.length) {
              testString += ", ";
            }
          } //end of for loop
          console.log("Undefined " + testString);
        } //else closes
        return testString;
      } //end of getIssueAndLocAlpha()
    


    //get the type of machinery used
    // function getTypeOfMachine(){
    //   if (snapshot.val().problem.radio.answer){
    //     array1 = [snapshot.val().problem.radio.name, snapshot.val().problem.radio.answer]

    //     return (array1)
    //   }else
    //   return ('');
    // };


    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(
      {
        host: "smtp.bch.com.sg",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "bchapp", // user
          pass: "ppah6150", // password
        },
      },
      {
        // default message fields
        // sender info
        from: "BCHApp <bchapp@bch.com.sg>",
        // list of receivers
        to: "BCHFaultReport <bchfaultreports@gmail.com>",
      }
    );

    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.error(error);
      } else {
        console.log("Verified.");
      }
    });

    /***************************************************************
     *                          Send Mail                          *
     * *************************************************************
     * - Responsible for sending the actual email out
     * # However is disabled due to how time is filtered
     * # To fix pls format time in db to proper raw datetime format
     ***************************************************************/

    //this method will get issue and issue location for the email to display
   


    transporter.sendMail(
      {
        subject: `${snapshot.val().problem.category} fault at ${
          snapshot.val().storeName
        }`, // Subject line
        html: `<br>Hi,<br><br><br>A fault regarding 
        <b>${snapshot.val().problem.category}</b>, with <b>${getIssueAndLocAlpha()}</b><br>
        Fault occurred at          : <b>${snapshot.val().storeName}</b><br>
        Fault has been reported by : <b>${snapshot.val().staffName}</b><br>
        incident happened at       : <b>${snapshot.val().dateTime} </b>
        .<br><br><br></br><br>Cheers!</br><br>Friendly email robot</br>`, // html body
      },
      function (error, info) {
        if (error) {
          console.log("error is " + error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
  });

var httpServer = http.createServer(app);
httpServer.listen(port, () => console.log(`Hard on port ${port}`));
