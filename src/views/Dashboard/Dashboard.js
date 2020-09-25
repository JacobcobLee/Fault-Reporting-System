import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import NewCaseModal from "components/Modal/newcaseModal.js";
import ResolvedCaseModal from "components/Modal/resolvedcaseModal.js";
import PendingCaseModal from "components/Modal/pendingcaseModal.js";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from 'axios';
import {useState} from 'react';




const useStyles = makeStyles(styles);

var delays2 = 80,
  durations2 = 500;

   



export default function Dashboard() {

//CASES REPORTED
const [casescount,setCasesCount] = useState()
const [ytdcasescount,setYtdCasesCount] = useState()
const [thedaybeforeytdcasescount,setTheDayBeforeYtdCasesCount] = useState()
const [complimentcount,setComplimentCount] = useState()
const [complaintcount,setComplaintCount] = useState()



//for today date
const array = [];
const array2 = [];
let test;
function getcasestodayChart(){
  axios
  .get("https://bchserver.herokuapp.com/api/v1/casestodaychart")
  .then((response) => {
    array.push(Object.keys(response.data))
    array2.push(array[0].length)
    test = array2.toString();
    //console.log(array2);
    setCasesCount(test)
  })
}

getcasestodayChart();

//for ytd date
const ytdarray = [];
const ytdarray2 = [];
let ytdtest;
function getcasesytdChart(){
  axios
  .get("https://bchserver.herokuapp.com/api/v1/casesyesterdaychart")
  .then((response) => {
    ytdarray.push(Object.keys(response.data))
    ytdarray2.push(ytdarray[0].length)
    ytdtest = ytdarray2.toString();
    //console.log(ytdarray2);
    setYtdCasesCount(ytdtest)
  })
}

getcasesytdChart();

//for the day before ytd date
const thedaybeforeytdarray = [];
const thedaybeforeytdarray2 = [];
let thedaybeforeytdtest;
function getcasesthedaybeforeytdChart(){
  axios
  .get("https://bchserver.herokuapp.com/api/v1/casesthedaybeforeytdchart")
  .then((response) => {
    thedaybeforeytdarray.push(Object.keys(response.data))
    thedaybeforeytdarray2.push(thedaybeforeytdarray[0].length)
    thedaybeforeytdtest = thedaybeforeytdarray2.toString();
    //console.log(thedaybeforeytdarray2);
    setTheDayBeforeYtdCasesCount(thedaybeforeytdtest)
  })
}

getcasesthedaybeforeytdChart();



//yesterday,the day before yesterday
var minusonedate = new Date().getDate() -1;
var minustwodate = minusonedate -1;
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var yesterdayDate = minusonedate + '/' + month + '/' + year ;
var thedaybeforeDate = minustwodate + '/' + month + '/' + year ;

const newcasesChart = {
  data: {
    labels: [thedaybeforeDate,yesterdayDate,"Cases reported today"]

    
    ,
    series: [[thedaybeforeytdcasescount,ytdcasescount,casescount]]
      
    
  },
  options: {
    axisX: {
      showGrid: false
    },
    low: 0,
    high: 8,
    chartPadding: {
      top: 0,
      right: 5,
      bottom: 0,
      left: 0
    }
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function(value) {
            return value[0];
          }
        }
      }
    ]
  ],
  animation: {
    draw: function(data) {
      if (data.type === "bar") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};


//CUSTOMER FEEDBACK

//for compliment feedback
const feedbackcomplimentarray = [];
const feedbackcomplimentarray2 = [];
let feedbackcomplimenttest;
function getcomplimentChart(){
  axios
  .get("https://bchserver.herokuapp.com/api/v1/feedbackcomplimentchart")
  .then((response) => {
    //console.log(response.data);
    feedbackcomplimentarray.push(Object.keys(response.data))
    feedbackcomplimentarray2.push(feedbackcomplimentarray[0].length)
    feedbackcomplimenttest = feedbackcomplimentarray2.toString();
    setComplimentCount(feedbackcomplimenttest)
  })
}

getcomplimentChart();

//for complaint feedback
const feedbackcomplaintarray = [];
const feedbackcomplaintarray2 = [];
let feedbackcomplainttest;
function getcomplaintChart(){
  axios
  .get("https://bchserver.herokuapp.com/api/v1/feedbackcomplaintchart")
  .then((response) => {
    //console.log(response.data);
    feedbackcomplaintarray.push(Object.keys(response.data))
    feedbackcomplaintarray2.push(feedbackcomplaintarray[0].length)
    feedbackcomplainttest = feedbackcomplaintarray2.toString();
    setComplaintCount(feedbackcomplainttest)
  })
}

getcomplaintChart();


const customerfeedbackChart = {
  data: {
    labels: ["Compliment","Feedback"]

    
    ,
    series: [[complimentcount,complaintcount]]
      
    
  },
  options: {
    axisY: {
      onlyInteger:false,
      showGrid:false,
      offset:70
    },
    axisX: {
      onlyInteger:true,
    },
    low:0,
    high:10,
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function(value) {
            return value[0];
            
          }
        }
      }
    ]
  ],
  animation: {
    draw: function(data) {
      if (data.type === "bar") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

  const classes = useStyles();
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modalShow3, setModalShow3] = React.useState(false);
  return (
    <div>
       <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={newcasesChart.data}
                type="Bar"
                options={newcasesChart.options}
                responsiveOptions={newcasesChart.responsiveOptions}
                listener={newcasesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Cases Reported</h4>
              <p className={classes.cardCategory}>Compare Cases Reported for Today and past 2 days</p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="primary">
              <ChartistGraph
                className="ct-chart"
                data={customerfeedbackChart.data}
                type="Bar"
                responsiveOptions={customerfeedbackChart.responsiveOptions}
                options={customerfeedbackChart.options}
                listener={customerfeedbackChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Customer Feedback</h4>
              <p className={classes.cardCategory}>Standard obtained through Customer Feedbacks Today</p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      
      <br></br>
      
      <GridContainer>
      <GridItem xs={12} sm={12} md={4}>
        <Button onClick={() => setModalShow(true)} fullWidth color="danger">New Cases Reported</Button>
        <NewCaseModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />  
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <Button  onClick={() => setModalShow2(true)} fullWidth color="warning">Pending Cases</Button>
        <PendingCaseModal
        show={modalShow2}
        onHide={() => setModalShow2(false)}
      />
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <Button onClick={() => setModalShow3(true)} fullWidth color="success">Resolved Cases</Button> 
        <ResolvedCaseModal
        show={modalShow3}
        onHide={() => setModalShow3(false)}
      />
      </GridItem>
      </GridContainer>
    </div>
  );
}
