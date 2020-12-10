import React, { useEffect } from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import axios from 'axios';
import Select from 'react-select';
import { useState } from 'react';

import firebase from "../Firebase";

var pageURL = window.location.href;
var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);

export default function View() {
    const [displayspecificCases, setDisplay] = useState({})
    const statusOptions = [{ value: "Resolved", label: "Resolved" }]
    const [images, setImages] = useState([])
    
    
    useEffect(()=>{
        axios
        .get("https://bchfrserver.herokuapp.com/api/v1/fault/" + lastURLSegment)
        .then(async (response) => {
            setDisplay(response.data)
            const imagesToConstruct = await response.data.imageurl.slice(0,-1).split(",")
            // console.log(imagesToConstruct)
            imagesToConstruct.length > 0 && imagesToConstruct.forEach((item, i) => {
                if (item !== "") {
                firebase
                    .storage()
                    .ref()
                    .child(item)
                    .getMetadata()
                    .then((results) => {
                        setImages((prevImages) => [...prevImages, `https://firebasestorage.googleapis.com/v0/b/${results.bucket}/o/${encodeURIComponent(item)}?alt=media`])
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            })            
        })
    }, [])



    // useEffect(()=>{
    //     // displayspecificCases.imgURL = "fault/asd.jpg"
    //     let foo = displayspecificCases.imageurl // "fault/asdfsdf.jpg,...."
    //     if (foo !== undefined){
    //         console.log(foo)
    //         let bar = foo.split(','); // bar is now an array ['string','string'] 'fault/hjke.jpg'
    //         let i = 0;

    //         let urlTags = []

    //         bar.map((item)=>{
    //             console.log(item)
    //             if(item !== ""){
    //                 firebase.storage().ref()
    //                 .child(item) 
    //                 .getMetadata()
    //                 .then((results) => {
    //                     objOfUrl[i] = `https://firebasestorage.googleapis.com/v0/b/${results.bucket}/o/${encodeURIComponent(item)}?alt=media`
    //                     i++ // i ++ for objOfUrl
    //                     console.log("i is :" + i)
    //                     try{setObjUrl(objOfUrl)}catch(e){console.log("err is in view useEffect try catch e : " + e)}
    //                 })
    //                 .catch((err) => {
    //                 console.log(err);
    //                 });

    //                 try{setUrlTags(urlTags)}catch(e){console.log("err is in view useEffect try catch e : " + e)}
    //                 console.log(objOfUrl);
    //             }
    //         })
    //     }

    // },[displayspecificCases])

    // useEffect(() => {
    //         if (displayspecificCases.imageurl) {
    //         displayspecificCases.imageurl.split(",").forEach((item, i) => {
    //             console.log(item);
    //             if (item !== "") {
    //             firebase
    //                 .storage()
    //                 .ref()
    //                 .child(item)
    //                 .getMetadata()
    //                 .then((results) => {
    //                     objOfUrl[i] = `https://firebasestorage.googleapis.com/v0/b/${results.bucket}/o/${encodeURIComponent(item)}?alt=media`
    //                     i++ // i ++ for objOfUrl
    //                     console.log("i is :" + i)
    //                     try{setObjUrl(objOfUrl)}catch(e){console.log("err is in view useEffect try catch e : " + e)}
    //                 })
    //                 .catch((err) => {
    //                 console.log(err);
    //                 });
    //             }
    //         }     );
    //         }
    //     }, [displayspecificCases]);

    // useEffect(() => {
    //     if (displayspecificCases.imageurl) {
    //       displayspecificCases.imageurl.split(",").forEach((item, i) => {
    //         console.log(item);
    //         if (item !== "") {
    //           firebase
    //             .storage()
    //             .ref()
    //             .child(item)
    //             .getMetadata()
    //             .then((results) => {
    //               // Construct complete image URL
    //               const url = `https://firebasestorage.googleapis.com/v0/b/${
    //                 results.bucket
    //               }/o/${encodeURIComponent(item)}?alt=media`;
      
    //               console.log("i is :" + i);
    //               try {
    //                 // Update state array at index i
    //                 setObjUrl((objOfUrl) =>
    //                   objOfUrl.map((objUrl, index) => (index === i ? url : objUrl))
    //                 );
    //               } catch (e) {
    //                 console.log("err is in view useEffect try catch e : " + e);
    //               }
    //             })
    //             .catch((err) => {
    //               console.log(err);
    //             });
    //         }
    //       });
    //     }
    //   }, [displayspecificCases]);
      
      // Log state when it updates
    //   useEffect(() => {
    //     console.log(objOfUrl); //console logs [0: "url.....", 1: "url....."]
    //   }, [objOfUrl]);
    
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
    function displayData2() {
        if (displayspecificCases.problem.checkbox.length > 1) {
            return(displayspecificCases.problem.checkbox.map(item => {
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
                        <h4>{displayspecificCases.problem.checkbox.name} : </h4>
                    </CardHeader>
                    <CardBody>
                        <h5><b>{displayAnswer(displayspecificCases.problem.checkbox.answer)}</b></h5>
                    </CardBody>
                </Card>
            )
        }
    }
    //return radio if there is 
    function tryReturnRadio() {
        try {
            return displayspecificCases.problem.radio.name
        } catch (error) {
            return null;
        }
    }
    function tryReturnRadio2() {
        try {
            return displayspecificCases.problem.radio.answer
        } catch (error) {
            return null;
        }
    }
    //function to retrieve image from firestore
    function loading(){
        return(<div>
            <GridContainer justify="space-around">
                <GridItem xs={12} sm={12} md={9} lg={5}>
                    <Card>
                        <CardHeader>
                            <h1><b>Loading, please wait!</b></h1>
                        </CardHeader>
                    </Card>
                 </GridItem>
            </GridContainer>
        </div>)
    }
    function render(){
        return (
            <div>
                <h3 style={{textAlign: 'left', marginLeft:'2.5em' }}><b>Solve Case</b></h3>
                <GridContainer justify="space-around">
                    <GridItem xs={12} sm={12} md={9} lg={5}>
                        <Card>
                            <CardHeader>
                                <h4><b>Reported on:</b></h4>
                            </CardHeader>
                            <CardBody>
                                <h5>{displayspecificCases.dateTime}</h5>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h4><b>Store Location:</b></h4>
                            </CardHeader>
                            <CardBody>
                                <h5>{displayspecificCases.storeName}</h5>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={6} lg={5}>
                        <Card>
                            <CardHeader>
                                <h4><b>Staff Reported:</b></h4>
                            </CardHeader>
                            <CardBody>
                                <h5>{displayspecificCases.staffName}</h5>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h4><b>Fault Type:</b></h4>
                            </CardHeader>
                            <CardBody>
                                <h5>{displayspecificCases.problem.category}</h5>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <h3 style={{textAlign: 'left', marginLeft:'2.5em' }}><b>Incident Details</b></h3>
                <GridContainer justify="space-around">
                    <GridItem xs={12} sm={12} md={11} lg={11}>
                        <Card>
                            <CardBody>
                            <h4>{displayRadio(tryReturnRadio())}:</h4>
                            <h5><b>{displayRadio(tryReturnRadio2())}</b></h5>
                        {
                            displayData2(displayspecificCases.problem.checkbox)
                        }
                        <br></br>
                        <h4>Fault Image:</h4>
                        <div class="row">                        
                        {images.map((item, i)=> {
                            return <div class="column"> <div style={customDivLol}><img width="360px" height="270px" src={item} alt="no photo"/></div> </div>}
                        )}
                        </div>
                        <br></br>
                        <br></br>
                        <h4>Description:</h4>
                        {displayspecificCases.description}
                        <br></br>
                        <br></br>
                        <h4>Issue Status:</h4>
                                <Select
                                    defaultValue={{ value: "Resolved", label: "Resolved" }}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="color"
                                    options={statusOptions}
                                    isDisabled="true"
                                />
                        <br></br>
                        <h4>Comments:</h4>
                        <textarea type="text" disabled="true" defaultValue={displayspecificCases.comments} className="form-control" />
                        <br></br>
                        <h4>Resolved By:</h4>
                        <input type="text" defaultValue={displayspecificCases.lasteditedby} disabled="true" className="form-control"></input>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer justify="space-around">
                    <GridItem xs={12} sm={12} md={11} lg={11}>
                        <Button onClick={event =>  window.location.href='/admin/dashboard'} fullWidth color="success">Done</Button>
                        <Button onClick={event =>  window.location.href='/admin/dashboard'} fullWidth color="danger">Cancel</Button>

                    </GridItem>
                </GridContainer>
            </div>
        )
    }

    const customDivLol ={
        margin: '10px'
    }
    return (displayspecificCases.problem? render(): loading())
}




  