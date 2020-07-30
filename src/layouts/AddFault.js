import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import faultimg from "assets/img/celling_aircon.jpg";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Button from "components/CustomButtons/Button.js";    
import axios from 'axios';
import { Fragment} from 'react';
import Select from 'react-select';
import pendingcaseModal from "components/Modal/pendingcaseModal";
import resolvedcaseModal from "components/Modal/resolvedcaseModal";
import {useState} from 'react';

export default function AddFault(){
    const haveRadio = [{ value: "true", label: "True" }, { value: "false", label: "False" }]
    const haveCheckbox = [{ value: "true", label: "True" }, { value: "false", label: "False" }]
    const haveInput = [{ value: "true", label: "True" }, { value: "false", label: "False" }]
    const [radio,setRadio] = useState("true");
    const [checkbox,setCheckbox] = useState("true");
    const [input,setInput] = useState("true");

    //for all answer state
    const [faultname,setFaultName] = useState("");
    const [radioquestion,setRadioQuestion] = useState("");
    const [radioanswer,setRadioAnswer] = useState("");
    const [inputquestion,setInputQuestion] = useState("");
    const [checkboxquestion1,setCheckboxQuestion1] = useState('');
    const [checkboxanswer1,setCheckboxAnwer1] = useState("");
    const [checkboxquestion2,setCheckboxQuestion2] = useState("");
    const [checkboxanswer2,setCheckboxAnwer2] = useState("");


    function validateCheckbox(){
        if((checkboxquestion1 != '') && (checkboxanswer1 != '')){
            if((checkboxquestion2 != '') && (checkboxanswer2 != '')){
                return {checkboxquestion1: {answer: checkboxanswer1.split(','),name: checkboxquestion1}, checkboxquestion2: {answer: checkboxanswer2.split(','),name:checkboxquestion2}};
            }else{
                return {checkboxquestion1: {answer: checkboxanswer1.split(','),name: checkboxquestion1}};
            }
        }else{
            return null;
        }

    }
    function validateRadio(){
        if((radioquestion != '') && (radioanswer != '')){
            return {radioquestion: {name: radioquestion, answer:radioanswer.split(',')}};
        }else{
            return null;
        }
    }
    function validateInput(){
        if(inputquestion != ''){
            return inputquestion.split(',');
        }else{
            return null;
        }
    }
    function validateData(havCheck,submitCheckbox,havRadio,submitRadio,havInput,submitInput){
        if(havCheck == 'true'){
            if(submitCheckbox == null){
                window.alert('Please key in checkbox data or set checkbox to false');
                 return false;
            }
        }
        if(havRadio == 'true'){
            if(submitRadio == null){
                window.alert('Please key in Radio data or set Radio to false');
                return false;
            }
        }
        if(havInput == 'true'){
            if(submitInput == null){
                window.alert('Please key in Input data or set Input to false');
                return false;
            }
        }
        return true;
    }
    function submit(){
        const name = faultname;
        const havRadio = radio;
        const havInput = input;
        const havCheck = checkbox;
        const submitRadio = validateRadio();
        const submitInput = validateInput();
        const submitCheckbox = validateCheckbox();
        let validatedata = validateData(havCheck,submitCheckbox,havRadio,submitRadio,havInput,submitInput);
        if(validatedata == true){
            if((name != '') && ((submitRadio != null) || (submitCheckbox != null))){
                const total = {name: name, haveRadio: havRadio, haveInput: havInput, haveCheck: havCheck, input: submitInput, radio: submitRadio, checkbox: submitCheckbox};
                axios
                .post("http://localhost:8080/api/v1/category",total
               )
               window.alert('Successfully added fault type!')
               window.location.href = "/admin/functions"
            }else{
                window.alert('Please enter nessasary data!\nRequired minimum value: Name & 1 Radio/Checkbox' );
            }
        }else{

        }
        
    }
    function displayRadio(){
        if(radio == "true"){
            return(
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader>
                            <h3><b>Radio</b></h3>
                        </CardHeader>
                        <CardBody>
                        <h4>Radio Question :</h4>
                        <input  onChange={e=>setRadioQuestion(e.target.value)} className="form-control" type="text" placeholder="Enter Radio Question.."/>
                        <br></br>
                        <h4>Radio Answer (Text will be split into using (,) e.g Apple,Orange) :</h4>
                        <input onChange={e=>setRadioAnswer(e.target.value)} className="form-control" type="text" placeholder="Enter Radio Answer.."/>
                        </CardBody>
                    </Card>
                </GridItem>
            )
        }else{

        }
    }
    function displayCheckbox(){
        if(checkbox == "true"){
            return(
                <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader>
                        <h3><b>Checkbox</b></h3>
                    </CardHeader>
                    <CardBody>
                        <h4>Checkbox Question :</h4>
                        <input onChange={e=>setCheckboxQuestion1(e.target.value)} className="form-control" type="text" placeholder="Enter Checkbox Question.."/>
                        <br></br>
                        <h4>Checkbox Answer (Text will be split into using (,) e.g Apple,Orange) :</h4>
                        <input onChange={e=>setCheckboxAnwer1(e.target.value)}className="form-control" type="text" placeholder="Enter Checkbox Answer.."/>
                        <br></br>
                        <h4>Checkbox Question 2 :</h4>
                        <input onChange={e=>setCheckboxQuestion2(e.target.value)} className="form-control" type="text" placeholder="Enter Checkbox Question 2.."/>
                        <br></br>
                        <h4>Checkbox Answer 2 (Text will be split into using (,) e.g Apple,Orange) :</h4>
                        <input onChange={e=>setCheckboxAnwer2(e.target.value)} className="form-control" type="text" placeholder="Enter Checkbox Answer 2.."/>
                    </CardBody> 
                </Card>
                </GridItem>
            )
        }else{
        }
    }
    function displayInput(){
        if(input == "true"){
            return(
                <GridItem xs={12} sm={12} md={12}>
                <Card>
                        <CardHeader>
                            <h3><b>Input</b></h3>
                        </CardHeader>
                        <CardBody>
                        <h4>Input Question:</h4>
                        <input onChange={e=>setInputQuestion(e.target.value)} className="form-control" type="text" placeholder="Enter Input Question.."/>
                        </CardBody>
                    </Card>
                </GridItem>
            )
        }else{

        }
    }
    return(
        <div>
            <h3><b>Add Fault</b></h3>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader>
                            <h4><b>Fault Name (Category) :</b></h4>
                        </CardHeader>
                        <CardBody>
                        <input onChange={e=>setFaultName(e.target.value)} className="form-control" type="text" placeholder="Enter Fault Name.."/>
                        <br></br>
                    <h4><b>Have Radio :</b></h4>
                    <Select
                        defaultValue={{ value: "true", label: "True" }}
                        className="basic-single"
                        classNamePrefix="select"
                        name="color"
                        options={haveRadio}
                        onChange={e=>setRadio(e.value)}
                        />
                    <br></br>
                    <h4><b>Have CheckBox :</b></h4>
                    <Select

                        defaultValue={{ value: "true", label: "True" }}
                        className="basic-single"
                        classNamePrefix="select"
                        name="color"
                        options={haveCheckbox}
                        onChange={e=>setCheckbox(e.value)}
                        />
                    <br></br>
                    <h4><b>Have Input :</b></h4>
                    <Select
                        defaultValue={{ value: "true", label: "True" }}
                        className="basic-single"
                        classNamePrefix="select"
                        name="color"
                        options={haveInput}
                        onChange={e=>setInput(e.value)}
                        />
                    </CardBody>
                    </Card>
                </GridItem> 
                {
                    displayRadio()
                }
                {
                    displayCheckbox()
                }
                {
                    displayInput()
                }
                 <Button onClick={submit} fullWidth color="success">Add</Button> 
            </GridContainer>
        </div>
    )
}