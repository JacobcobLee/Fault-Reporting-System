const express = require("express"),
  app = express(),
  port = process.env.PORT || 9998;

var http = require("http");
var moment = require("moment");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

const nodemailer = require("nodemailer");
const cron = require("node-cron");
const { database } = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bch-fr.firebaseio.com/",
  storageBucket: "bch-fr.appspot.com",
});
var bucket = admin.storage().bucket();
app.use(require("./routes/v1.js"));


//get napshot of all reports and then loop thru to find status
var unresolved = admin.database().ref("reports")

cron.schedule('0 10 * * 1,4', async () => {
  var count = 0;
  var storeNameList = [];
  var dateList = [];
  await unresolved
  .once('value', function(snapshot) {
  snapshot.forEach(function (childSnapshot) {
    // console.log("first query triggered")
    // console.log(snapshot.val());
    if (childSnapshot.val().status == "Unresolved"){
      storeNameList[count] += childSnapshot.val().storeName;
      dateList[count] += childSnapshot.val().date;
      // console.log(storeNameList[count])
      count ++;    }
    })
    //to display all of the unresolved fault information
    function getFaultInfo(){
      var text = "";
      for(let i=0 ; i<count ; i++){
        text += storeNameList[i].replace('undefined','') + " on " + dateList[i].replace('undefined','') + " <br> "
        // console.log(Object.values(storeNameList[i])+"@@@@@@@@@@@@@@@")
      }
      console.log(text);
      return text;
    }

    //send mail of all unresolved cases
    let transporter = nodemailer.createTransport(
      {
        host: "smtp.bch.com.sg",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "bchapp", // user
          pass: "BCHrootAdmin2020!", // password
        },
      },
      {
        // default message fields
        // sender info
        from: "BCHApp <bchapp@bch.com.sg>",
        // list of receivers
        to: "bchFaultReports <bchfaultreports@gmail.com>",
      });
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
    // ${unresolvedList.forEach(getFaultInfo)}
    transporter.sendMail(
      {
        subject: `${count} unresolved faults to be solved`, // Subject line
        html: `<br>Hello,<br><br><br>There are ${count} faults reported that are still unresolved
        Faults are <br>
        ${getFaultInfo()}
        .<br><br><br></br><br>Cheers!</br><br>Friendly email robot</br>
        `, // html body
      },
      function (error, info) {
        if (error) {
          console.log(
            "error is " + error + " email string is > "
          );
        } else {
          console.log("Email sent: " + info.response);
        }

      })//end of send mail

  // console.log("cron executed")
  // console.log(unresolvedList)
  // console.log(count + "@@@@@@@@@@@@@@@@@@@@@@@@@")
    }, {
  scheduled: true,
  timezone: 'Asia/Singapore'
  });
}); // end of cron function

// Retrieve new posts as they are added to the database
// console.log(moment().utcOffset(8).format("YYYY/MM/DD HH:mm:ss"));
admin
  .database()
  .ref("reports")
  .orderByChild("dateTime")
  .startAt(moment().utcOffset(8).format("YYYY/MM/DD HH:mm:ss"))
  .on("child_added", async function (snapshot) {
    console.log(snapshot.val());
    let imgURL = "";
    if (!snapshot.val().imageurl) {
      imgURL = "No IMAGE";
    } else {
      await bucket
        .file(snapshot.val().imageurl)
        .getMetadata()
        .then((results) => {
          imgURL = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(snapshot.val().imageurl)}?alt=media&token=${
            results[0].metadata.firebaseStorageDownloadTokens
          }`;
        })
        .catch((err) => {
          console.log("some error: " + err);
        });
    }
    console.log(imgURL);


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
        to: snapshot.val().email,
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
        <b>${
          snapshot.val().problem.category
        }</b>, with <b>${getIssueAndLocAlpha()}</b><br>
        Fault occurred at          : <b>${snapshot.val().storeName}</b><br>
        Fault has been reported by : <b>${snapshot.val().staffName}</b><br>
        incident happened at       : <b>${snapshot.val().dateTime} </b>
        <img src=${imgURL} width="300px" height="450px" alt="Staff did not upload image">
        .<br><br><br></br><br>Cheers!</br><br>Friendly email robot</br>
        `, // html body
      },
      function (error, info) {
        if (error) {
          console.log(
            "error is " + error + " email string is > " + snapshot.val().email
          );
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
  });

var httpServer = http.createServer(app);
httpServer.listen(port, () => console.log(`Hard on port ${port}`));
