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

export default function AddFault() {
    const haveRadio = [{ value: "true", label: "True" }, { value: "false", label: "False" }]
    const haveCheckbox = [{ value: "true", label: "True" }, { value: "false", label: "False" }]
    const haveInput = [{ value: "true", label: "True" }, { value: "false", label: "False" }]
    const [radio, setRadio] = useState("true");
    const [checkbox, setCheckbox] = useState("true");
    const [input, setInput] = useState("true");

    //for all answer state
    const [faultname, setFaultName] = useState("");
    const [emailCatch, setEmail] = useState("");

    const [radioquestion1, setRadioQuestion1] = useState("");
    const [radioanswer1, setRadioAnswer1] = useState("");

    const [radioquestion2, setRadioQuestion2] = useState("");
    const [radioanswer2, setRadioAnswer2] = useState("");

    const [checkboxquestion1, setCheckboxQuestion1] = useState('');
    const [checkboxanswer1, setCheckboxAnwer1] = useState("");
    const [checkboxquestion2, setCheckboxQuestion2] = useState("");
    const [checkboxanswer2, setCheckboxAnwer2] = useState("");
    const [inputquestion, setInputQuestion] = useState("");


    function validateCheckbox() {
        if ((checkboxquestion1 !== '') && (checkboxanswer1 !== '')) {
            if ((checkboxquestion2 !== '') && (checkboxanswer2 !== '')) {
                return { checkboxquestion1: { answer: checkboxanswer1.split(','), name: checkboxquestion1 }, checkboxquestion2: { answer: checkboxanswer2.split(','), name: checkboxquestion2 } };
            } else {
                return { checkboxquestion1: { answer: checkboxanswer1.split(','), name: checkboxquestion1 } };
            }
        } else {
            return null;
        }

    }
    function validateRadio() {
        if ((radioquestion1 !== '') && (radioanswer1 !== '')) {
            if ((radioquestion2 !== '') && (radioanswer2 !== '')) {
                return { radioquestion1: { answer: radioanswer1.split(','), name: radioquestion1 }, radioquestion2: { answer: radioanswer2.split(','), name: radioquestion2 } };
            } else {
                return { radioquestion1: { answer: radioanswer1.split(','), name: radioquestion1 } };
            }
        } else {
            return null;
        }
    }
    function validateInput() {
        if (inputquestion !== '') {
            return inputquestion.split(',');
        } else {
            return null;
        }
    }
    function validateData(havCheck, submitCheckbox, havRadio, submitRadio, havInput, submitInput) {
        if (havCheck === 'true') {
            if (submitCheckbox == null) {
                window.alert('Please key in checkbox data or set checkbox to false');
                return false;
            }
        }
        if (havRadio === 'true') {
            if (submitRadio == null) {
                window.alert('Please key in Radio data or set Radio to false');
                return false;
            }
        }
        if (havInput === 'true') {
            if (submitInput == null) {
                window.alert('Please key in Input data or set Input to false');
                return false;
            }
        }
        return true;
    }
    function validateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        alert("You have entered an invalid email address!")
        return (false)
    }
    function submit() { // submit functions to allow users to submit the data into the server for post/put
        var name = faultname;
        var email = emailCatch;
        var havRadio = radio;
        var havInput = input;
        var havCheck = checkbox;
        var submitRadio = validateRadio();
        var submitInput = validateInput();
        var submitCheckbox = validateCheckbox();
        let validatedata = validateData(havCheck, submitCheckbox, havRadio, submitRadio, havInput, submitInput);
        if (validatedata === true) {
            if ((name !== '') && (validateEmail(email)) && ((submitRadio !== null) || (submitCheckbox !== null))) {
                const total = { name: name, email: email, haveRadio: havRadio, haveInput: havInput, haveCheck: havCheck, input: submitInput, radio: submitRadio, checkbox: submitCheckbox };
                axios
                    .post("https://bchfrserver.herokuapp.com/api/v1/category", total
                    ).then((res) => {
                        if (res) {
                            window.alert('Saved!')
                            window.location.href = "/admin/functions"
                        }
                    }).catch((e) => { console.log("err in add fault e is: " + e) })
            } else {
                window.alert('Please enter nessasary data!\nRequired: Proper Email, Name & 1 Radio/Checkbox question');
            }
        } else {

        }

    }
    //cancel function to allows users to cancel and go back into the functions screen
    function cancelButton() {
        window.location.href = "/admin/functions"
    }
    function displayRadio() {
        if (radio === "true") {
            return (
                <GridItem xs={12} sm={12} md={11} xl={11}>
                    <Card>
                        <CardHeader>
                            <h3><b>Dropdown box questions</b></h3>
                            <h4 style={{ margin: "0px 0px 0px 0px", fontWeight: "light" }}>This section is for creation of a downdown question. An example of a drop down can be seen above, right below inputting of a fault name. To create a dropdown question, first fill in the question then the multiple answers, separated by a comma. <b>Maximum of 2 questions only</b></h4>
                            <h4 style={{ margin: "0px 0px 5px 0px", fontWeight: "light" }}>(E.g to make a list of true, false and maybe, input the answer as such: true,false,maybe)</h4>
                        </CardHeader>
                        <CardBody>
                            <h4><b>Dropdown Question 1:</b></h4>
                            <input onChange={e => { setRadioQuestion1(e.target.value); console.log(e.target.value) }} className="form-control" type="text" placeholder="What is the square root of pi?" />
                            <br></br>
                            <h4><b>Dropdown Answer 1 </b><br></br>(create multiple answers using (,) e.g Apple,Orange)</h4>
                            <input onChange={e => setRadioAnswer1(e.target.value)} className="form-control" type="text" placeholder="yes,no,maybe" />
                            <br></br>
                            <h4><b>Dropdown Question 2:</b></h4>
                            <input onChange={e => { setRadioQuestion2(e.target.value) }} className="form-control" type="text" placeholder="Enter Dropdown 2 Question.." />
                            <br></br>
                            <h4><b>Dropdown Answer 2 </b><br></br>(create multiple answers using (,) e.g Apple,Orange)</h4>
                            <input onChange={e => setRadioAnswer2(e.target.value)} className="form-control" type="text" placeholder="Enter Dropdown 2 Answer.." />
                        </CardBody>
                    </Card>
                </GridItem>
            )
        } else {

        }
    }
    function displayCheckbox() {
        if (checkbox === "true") {
            return (
                <GridItem xs={12} sm={12} md={11} xl={11}>
                    <Card>
                        <CardHeader>
                            <h3><b>CheckBox questions</b></h3>
                            <h4 style={{ margin: "0px 0px 0px 0px", fontWeight: "light" }}>This section is for creation of a checkbox question. A checkbox question with multiple answer, where users are allowed to select multiple options. To create a checkbox question, first fill in the question then the multiple answers, separated by a comma. <b>Maximum of 2 questions only</b></h4>
                            <h4 style={{ margin: "0px 0px 5px 0px", fontWeight: "light" }}>(E.g to make a list of true, false and maybe, input the answer as such: true,false,maybe) </h4>
                        </CardHeader>
                        <CardBody>
                            <h4><b>Checkbox Question :</b></h4>
                            <input onChange={e => setCheckboxQuestion1(e.target.value)} className="form-control" type="text" placeholder="e.g What is your favourite fruit?" />
                            <br></br>
                            <h4><b>Checkbox Answer</b><br></br>(create multiple answers using (,) e.g Pen,Apple)</h4>
                            <input onChange={e => setCheckboxAnwer1(e.target.value)} className="form-control" type="text" placeholder="e.g Yes,No,Eggplant,Peach" />
                            <br></br>
                            <h4><b>Checkbox Question 2 :</b></h4>
                            <input onChange={e => setCheckboxQuestion2(e.target.value)} className="form-control" type="text" placeholder="e.g Is the earth flat?" />
                            <br></br>
                            <h4><b>Checkbox Answer 2 </b><br></br>(create multiple answers using (,) e.g Pen,Pineapple)</h4>
                            <input onChange={e => setCheckboxAnwer2(e.target.value)} className="form-control" type="text" placeholder="e.g No,the earth is cubed" />
                        </CardBody>
                    </Card>
                </GridItem>
            )
        } else {
        }
    }
    function displayInput() {
        if (input === "true") {
            return (
                <GridItem xs={12} sm={12} md={11} xl={11}>
                    <Card>
                        <CardHeader>
                            <h3><b>Input</b></h3>
                            <h4 style={{ margin: "0px 0px 0px 0px", fontWeight: "light" }}>This section is for creation of a input question. Input question allows user to enter more information in text form. </h4>
                        </CardHeader>
                        <CardBody>
                            <h4><b>Input Question:</b></h4>
                            <input onChange={e => setInputQuestion(e.target.value)} className="form-control" type="text" placeholder="e.g Please enter 16 digits infront of your credit card, the expiration date and the 3 numbers behind, many thanks!" />
                        </CardBody>
                    </Card>
                </GridItem>
            )
        } else {

        }
    }
    return (
        <div>
            <h3 style={{ textAlign: 'left', marginLeft: '2.5em' }}><b>Add fault</b></h3>
            <GridContainer justify="space-around">


                <GridItem xs={12} sm={12} md={11} xl={11}>
                    <Card>
                        <CardHeader>
                            <h4 style={{ fontWeight: "400" }}>This function allows backend team members to add a new category of fault. Adding new faults allows user to submit new catergory on the mobile application. First enter the email(s) that will receive a notification when a new fault is reported, then enter the category of fault. After, choose if the question will have (either or all) of the 3 question types and add the questions accordingly</h4>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3><b>Email recipient(s)</b></h3>
                            <h5 style={{ margin: 0 }}>To have multiple email receiving, separate emails using semicolon, to be separated by ';'</h5>
                            <h5>eg. BchTeamLead@mail.com; Vendor@mail.com</h5>
                        </CardHeader>
                        <CardBody>
                            <h4><b>Enter email address(es)</b></h4>
                            <input onChange={e => setEmail(e.target.value)} className="form-control" type="text" placeholder="Enter email(s)" />
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3><b>Configure the question</b></h3>
                            <h4 style={{ fontWeight: "light" }}>There is currently 3 type of question. Dropdown, checkbox and input. Dropdown allows for only 1 answer to a question, checkbox has 1 or multiple answer and input allows mobile users to input text</h4>
                        </CardHeader>
                        <CardBody>

                            <h4><b>Enter the new category of fault (fault name)</b></h4>
                            <input onChange={e => setFaultName(e.target.value)} className="form-control" type="text" placeholder="Enter Fault Name.." />
                            <br></br>
                            <h4><b>Have Dropdown :</b></h4>
                            <Select
                                defaultValue={{ value: "true", label: "True" }}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                options={haveRadio}
                                onChange={e => setRadio(e.value)}
                            />
                            <br></br>
                            <h4><b>Have CheckBox :</b></h4>
                            <Select

                                defaultValue={{ value: "true", label: "True" }}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                options={haveCheckbox}
                                onChange={e => setCheckbox(e.value)}
                            />
                            <br></br>
                            <h4><b>Have Input :</b></h4>
                            <Select
                                defaultValue={{ value: "true", label: "True" }}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                options={haveInput}
                                onChange={e => setInput(e.value)}
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
                <GridItem xs={12} sm={12} md={11} xl={11}>
                    <Button onClick={submit} fullWidth color="success">Add</Button>
                    <Button onClick={cancelButton} fullWidth color="danger">Cancel</Button>
                </GridItem>
            </GridContainer>
        </div>
    )
}