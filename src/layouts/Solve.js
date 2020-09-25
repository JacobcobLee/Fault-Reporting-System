import React from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import axios from 'axios';
import Select from 'react-select';
import { useState } from 'react';

var pageURL = window.location.href;
var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
//console.log(lastURLSegment);

const displayspecificCases = [];

function getSpecificCases() {
    axios
        .get("http://localhost:9998/api/v1/fault/" + lastURLSegment)
        .then((response) => {
            //console.log("hello");
            //console.log(displaynewCases[0].imageurl);
            //     try{
            displayspecificCases.push(response.data)
            //   array.push(displaynewCases[0])
            //   testarr.push(Object.values(array[0]))
            //   console.log("xia mian");
            //   console.log(testarr);
            //     }
            //     catch(error){
            //         console.log(error)
            //     }
        })
}

getSpecificCases();


export default function Solve() {
    const [edit, setEdit] = useState("Unresolved");
    const [comment, setComment] = useState(displayspecificCases[0].comments);
    //const [currentuser,setCurrentUser] = useState();

    let user2 = "sample text";

    //this function will get the email the user entered from the local storage
    function userName() {
        if (localStorage.getItem('user')) {
            user2 = localStorage.getItem('user');// this sets the local var with the one in the local storage
            //setCurrentUser(user2)
            return (
                <div>
                <h4>Posting/Saving As:</h4>
                <input type="text" defaultValue={user2} className="form-control" disabled="true"></input>
                </div>
            )
            // console.log(user2); //display the the username to check in the console 
        }
    }

    function putSpecificCases() {
        axios
            .put("http://localhost:9998/api/v1/fault/" + lastURLSegment, { "status": edit.toString(), "comments": comment.toString(), "lasteditedby": user2.toString() })
            .then((response) => {
            window.alert('Successfully edited case!')
            window.location.href = "/admin/dashboard"
        });
    }
    //loop for all answers and if there's 2 or more, put comma in between
    function displayAnswer(dis) {
        let test = '';
        for (let i = 0; i < dis.length; i++) {
            if (i === dis.length - 1) {
                test += dis[i];
            } else {
                test += dis[i] + ',';
            }
        }
        return test;
    }

    //if data has no radio, it will display empty instead of error.
    function displayRadio(display) {
        if (display == null) {
            return 'There is no radio';
        } else {
            return display;
        }
    }
    //if data has one or more checkbox 
    function displayData2(dis) {
        if (displayspecificCases[0].problem.checkbox != null) {
            if (displayspecificCases[0].problem.checkbox.length > 1) {
                return (displayspecificCases[0].problem.checkbox.map(item => {
                    return (
                        <Card>
                            <CardHeader>
                                <h4>{item.name} : </h4>
                            </CardHeader>
                            <CardBody>
                                <h5><b>{displayAnswer(item.answer)}</b></h5>
                            </CardBody>
                        </Card>
                    )
                }))
            } else {
                return (
                    <Card>
                        <CardHeader>
                            <h4>{displayspecificCases[0].problem.checkbox.name} : </h4>
                        </CardHeader>
                        <CardBody>
                            <h5><b>{displayAnswer(displayspecificCases[0].problem.checkbox.answer)}</b></h5>
                        </CardBody>
                    </Card>
                )
            }
        } else {
        }

    }
    //return radio if there is 
    function tryReturnRadio() {
        try {
            return displayspecificCases[0].problem.radio.name
        } catch (error) {
            return null;
        }
    }
    function tryReturnRadio2() {
        try {
            return displayspecificCases[0].problem.radio.answer
        } catch (error) {
            return null;
        }
    }
    //function to retrieve image from firestore
    const [img, setimg] = useState('');
    function retrieveImg(imgURL) {
        axios
            .get("http://localhost:9998/api/v1/image?location=" + imgURL)
            .then((response) => {
                //console.log("A@@@@");
                //console.log(response.data);
                console.log("iamge here");
                console.log(response.data);
                setimg(response.data.toString());
            })
    }
    retrieveImg(displayspecificCases[0].imageurl);

    const statusOptions = [{ value: "Unresolved", label: "Unresolved" }, { value: "Pending", label: "Pending" }, { value: "Resolved", label: "Resolved" }]
    return (
        <div>
            <h3 style={{ textAlign: 'center' }}><b>Solve Case</b></h3>
            <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                    <Card>
                        <CardHeader>
                            <h4><b>Reported on:</b></h4>
                        </CardHeader>
                        <CardBody>
                            <h5>{displayspecificCases[0].dateTime}</h5>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                    <Card>
                        <CardHeader>
                            <h4><b>Store Location:</b></h4>
                        </CardHeader>
                        <CardBody>
                            <h5>{displayspecificCases[0].storeName}</h5>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                    <Card>
                        <CardHeader>
                            <h4><b>Staff Reported:</b></h4>
                        </CardHeader>
                        <CardBody>
                            <h5>{displayspecificCases[0].staffName}</h5>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                    <Card>
                        <CardHeader>
                            <h4><b>Fault Type:</b></h4>
                        </CardHeader>
                        <CardBody>
                            <h5>{displayspecificCases[0].problem.category}</h5>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            <h3 style={{ textAlign: 'center' }}><b>Incident Details</b></h3>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardBody>
                            <h4>{displayRadio(tryReturnRadio())}:</h4>
                            <h5><b>{displayRadio(tryReturnRadio2())}</b></h5>
                            <br></br>
                            {
                                displayData2(displayspecificCases[0].problem.checkbox)
                            }
                            <h4>Fault Image:</h4>
                            <img width="360px" height="270px" src={img} alt='staff did not take/upload'/>
                            <br></br>
                            <br></br>
                            <h4>Description:</h4>
                            {displayspecificCases[0].description}
                            <br></br>
                            <br></br>
                            <h4>Issue Status:</h4>
                            <Select
                                defaultValue={{ value: "unresolved", label: "Unresolved" }}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                options={statusOptions}
                                onChange={e => setEdit(e.value)}
                            />
                            <br></br>
                            <h4>Comments:</h4>
                            <textarea type="text" defaultValue={comment} onChange={e => setComment(e.target.value)} className="form-control" />
                            <br></br>
                            {userName()}
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Button onClick={putSpecificCases} fullWidth color="success">Save</Button>
                </GridItem>
            </GridContainer>
        </div>
    );
}
