import React, { Component, useState } from 'react'
import { ImageBackground, StyleSheet, View, Text, TextInput, KeyboardAvoidingView, TouchableHighlight, ScrollView, Alert, Image } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../constants/ApiKeys';
import { st } from '../constants/ApiKeys';
import CheckboxGroup from 'react-native-checkbox-group'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { ImageBrowser } from 'expo-image-picker-multiple'

// import { Value } from 'react-native-reanimated';

let itemsRef = db.ref('/problem');

export default class ReportScreentest extends Component {

    state = {
        hasCameraPermission: null,
        hasCameraRollPermission: null,
        photos: [],
        photosurl: [],
        problem: [],
        problem2: {},
        selectCat: null,
        problem2: {},
        radio: null,
        name: null,
        radioanswer: '',
        checkItem: null,
        checkanswer: null,
        displayradio: '',
        image: null,
        hasCameraPermission: null,
        imageurl: null,
        others: 'none',
        outlet: this.props.route.params
        //type: Camera.Constants.Type.back,
    }
    getPermissionAsync = async () => { // getting permission for user to select camera roll
        if (Constants.platform.ios) {
            const { status } = await Camera.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }
    uuidv4() {//A method to generate a uuid for storage
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    getFileName(str) {//getting filename for image
        return str.substring(str.lastIndexOf('/') + 1);
    }
    openCamera = async () => { //open camera to take image
        console.log("inside cmera fucntion")
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false
        });
        if (!result.cancelled) {
            var fileName = this.getFileName(result.uri);
            console.log("filename: " + fileName);
            var test = ''
            test += fileName + ",";
            this.setState({
                imageurl: test
            })
            this.setState({ image: result.uri });
            console.log("camera is working?" + this.state.image)
        }
    };
    uploadImage = async (uri, name) => { //uploading the image to storage
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = st.ref('Fault/').child(name.toString());

        return ref.put(blob);
    }
    handleCategory(item) { //handle change dropdown category
        this.setState({
            selectCat: '',
            problem2: null,
            radio: [],
            radioanswer: null,
            checkanswer: null,
            others: null,
        }) //Setting state whenever category is changed
        this.setState({
            selectCat: item.label
        });
        db.ref('/problem/' + item.value).on('value', snapshot => {//Calling the database to get only the selected value data
            let problem2 = snapshot.val();
            this.setState({ problem2 });
            // console.log(problem2);
        });
    };

    async componentDidMount() {// getting permission for user to select camera roll
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === "granted" })
    }

    componentDidMount() {
        try {
            itemsRef.on('value', snapshot => { //ref from database to get all the reports data (category data)
                let data = snapshot.val();
                let problem = Object.values(data);
                this.setState({ problem });
                // console.log(this.state.problem);
            });
        } catch (error) {
            console.log(error);
        }
    }
    handleOthersChangeInput = e => { //onChange for input
        this.setState({
            others: e.nativeEvent.text
        });
    };
    handleChangeInput = e => {//onChange for input
        this.setState({
            name: e.nativeEvent.text
        });
    };
    checkValidation(checkquestion, item) { // validation for checkbox 
        return checkquestion.map((checkquestion) => { //mapping the checkboxquestion
            return checkquestion.answer.map((answer) => {//mapping the checkboxquestion answer
                let checkAnswer = false; //for validation
                for (let l = 0; l < item.length; l++) {//Looping to check the answer belongs into the checkbox question
                    if (item[l] == answer) {
                        checkAnswer = true;//set true
                    }
                }
                if (checkAnswer == true) {//if it's true then it will run
                    if (this.state.checkanswer != null) {//means there's nothing in the state
                        let temp = this.state.checkanswer;//this is for temp to hold the current state to set new one
                        if (this.state.checkanswer.name != checkquestion.name) {
                            let checkrepeat = false;//to check if there's such state inside to prevent creating the same state in the object
                            for (let test0 = 0; test0 < temp.length; test0++) {//looping to check
                                if (temp[test0].name == checkquestion.name) {
                                    temp[test0] = { name: checkquestion.name, answer: [item] } //updating the old data to the new one
                                    checkrepeat = true;//setting it to true if there's a repeat
                                }
                            }
                            if (checkrepeat == false) {//no repeat means it's a new question selected
                                this.setState({
                                    checkanswer: [temp, { name: checkquestion.name, answer: [item] }] //setting as {{prevquestion},{newquestion}}
                                })
                            }
                        } else if ((this.state.checkanswer.name == checkquestion.name) && (this.state.checkanswer.answer != item)) {
                            this.setState({
                                checkanswer: { name: checkquestion.name, answer: [item] }
                            })
                        }
                    } else {
                        this.setState({
                            checkanswer: { name: checkquestion.name, answer: [item] }//setting state because there's nothing atm
                        })
                    }
                }

            })
        })
    }

    radioValidation(radioquestion, item) { // validation for dropdown
        return radioquestion.map((radioquestion) => {//mapping the radioquestion
            return radioquestion.answer.map((answer) => { //mapping the radioquestion answer
                if (answer == item.label) { //for validation
                    if (this.state.radioanswer != null) { // if it's not null
                        let temp = this.state.radioanswer;// set the temp to avoid duplicate data
                        if ((this.state.radioanswer.name != radioquestion.name)) {
                            let checkRepeat = false;// check if there's repeat 
                            for (let test0 = 0; test0 < temp.length; test0++) {
                                if (temp[test0].name == radioquestion.name) {
                                    temp[test0] = { name: radioquestion.name, answer: item.label }//update the old data to the new one
                                    checkRepeat = true;//setting the repeat to true
                                }
                            }
                            if (checkRepeat == false) {// if it's false
                                this.setState({
                                    radioanswer: [temp, { name: radioquestion.name, answer: item.label }]// set the state into {{question1},{question2}}
                                })
                            }
                        } else if ((this.state.radioanswer.name == radioquestion.name) && (this.state.radioanswer.answer != item.label)) {
                            this.setState({
                                radioanswer: { name: radioquestion.name, answer: item.label }
                            })
                        }
                    } else {
                        this.setState({
                            radioanswer: { name: radioquestion.name, answer: item.label }//means there's no state set before
                        })
                    }
                }
            })
            //const name = radioquestion.name;
        });

    }
    handleChangeRadioAnswer(item) { // handle change dropdown answer
        let radioquestion = Object.values(this.state.problem2.radio); //Converting the radio into object.values
        this.radioValidation(radioquestion, item); //Going through radio validation
    }

    submitFault(email, comments, date, currentDate, description, outlet, name, cat, radioans, checkans, status, imageurl) { //calling this method will submit the fault to database
        if (description == null) {
            description = ''
        }
        const key = db.ref('/reports/').push().getKey(); //Get the key to later then set it at database as uuid (Unique Key)
        db.ref('/reports/' + key).set({
            uuid: key,
            email: email,
            comments: comments,
            dateTime: date,
            date: currentDate,
            description: description,
            storeName: outlet,
            problem: { category: cat, checkbox: checkans, radio: radioans, },
            staffName: name,
            status: status,
            imageurl: imageurl,
            lasteditedby: "",
            // emailTo: this.state.email
        });
    }
    displayRadioAnswer(answer) {//display dropdown for radio answer
        if (this.state.radioanswer == null) { //first no radio answer 
            let firstObj = { label: answer[0], value: answer[0] } //take first answer set as obj
            this.handleChangeRadioAnswer(firstObj) //  set radioanswer state
        } else { }
        return (
            <DropDownPicker items={
                answer.map((answer) => {
                    return { label: answer, value: answer }
                })
            }
                defaultValue={answer[0]} // display the first item
                placeholder="Select type/选择类型"
                placeholderStyle={{ textAlign: 'left' }}
                containerStyle={styles.dropdownInput}
                style={{ backgroundColor: '#fafafa' }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onChangeItem={item => this.handleChangeRadioAnswer(item)}
            />
        )

    }
    displayCheckboxAnswer(answer) {//Display all checkbox answer
        return (
            <CheckboxGroup
                callback={(selected) => this.checkonSelect(selected)}
                iconColor={"black"}
                iconSize={30}
                checkedIcon="ios-checkbox-outline"
                uncheckedIcon="ios-square-outline"
                checkboxes={
                    answer.map((answer) => { //mapping to get all the answer into the checkbox group
                        return { label: answer, value: answer }
                    })
                }
                labelStyle={{
                    color: '#333',
                    paddingLeft: '5%',
                    paddingTop: '1.8%'

                }}
                rowStyle={{
                    flexDirection: 'row'
                }}
                rowDirection={"column"}
            />
        )
    }
    checkonSelect(item) {
        let check = Object.values(this.state.problem2.checkbox); //converting checkbox into object values
        this.checkValidation(check, item); //going through validation for checkbox data
    };
    displayInput() {//Checking if haveInput is true (if it's true it will display a text input)
        if (this.state.problem2.haveInput == 'true') {
            return <TextInput maxLength={500} multiline style={styles.textFieldInput} placeholderTextColor="gray" placeholder="Others/其它 (Optional)" onChange={this.handleOthersChangeInput}></TextInput>

        }
    }
    displayCheckbox() {//displaying checkbox question and calling method to checkbox answer
        if (this.state.problem2.haveCheck == 'true') { //Checking haveCheck true
            let check = Object.values(this.state.problem2.checkbox); //Convert checkbox data into object values to map the data
            return check.map((check) => { //Maping check to get question and answer
                return [
                    //Display checkbox question in text format
                    <Text style={styles.fontTextQues}>{check.name + ':'}</Text>,
                    //Calling out display checkbox answer to display all answer in a dropdown format
                    this.displayCheckboxAnswer(check.answer),
                ]

            })
        }
        else {

        }
    }
    validateAns() {//validates the checkboxes before submitting of issue so tp prevent submition of issue without ans
        if (this.state.problem2.issue = undefined || 'undefined' || null) {
            return false;
        } else {
            return true;
        }
    }
    // pushFault(outlet, name, cat, radioans,checkans)
    Submit() {// Submit button on press
        // console.log(this.state.problem2.email);
        //radioquestion:{name:radioquestion},answer:radioanswer
        const outlet = this.state.outlet; // outlet state
        let date = new Date().getDate(); //Current Date
        //let dateNtime = new Date().toLocaleString();
        var dateNtime = moment()
            .utcOffset('+08:00')
            .format('YYYY/MM/DD HH:mm:ss');
        let month = new Date().getMonth() + 1; //Current Month
        let monthsInName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let monthName = monthsInName[month - 1];
        let year = new Date().getFullYear(); //Current Year
        const email = this.state.problem2.email;
        const comments = 'none'; //comment must be set to none 
        const description = this.state.others; // others state
        const currentDate = date + '-' + monthName + '-' + year;
        //const datetime = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec; //combining it into a string
        const datetime = dateNtime;
        const name = this.state.name; // name state
        const cat = this.state.selectCat; // selectcat state
        const radio = this.state.radioanswer; // radioanswer state
        const check = this.state.checkanswer; // checkanswer state
        const status = 'Unresolved'; // Status must be set as unresolved to later then set at the admin panel side to resolved or pending
        const imageurl = this.state.imageurl; // imageurl state
        let validate = false; //validations
        //console.log('radio' + Object.values(radio));
        if (name != null) {// Validation if name is null or have radio is true and data is not selected
            if (this.state.selectCat != null) {//validation to check if user have selected a category
                if (this.state.problem2.haveRadio == 'true') {
                    if (radio == null) {
                        validate = false;
                    } else {
                        if (this.state.problem2.haveCheck == 'true') {
                            if (check == null) {
                                validate = false;
                            }
                            else {
                                validate = true;
                            }
                        }
                    }
                } else {
                    if (this.state.problem2.haveCheck == 'true') {
                        if (check == null) {
                            validate = false;
                        }
                        else {
                            validate = true;
                        }
                    }
                }
            } else {
                validate = false;
            }
        } else {
            validate = false;
        }
        if (validate || this.validateAns()) {//Trying to submit fault if validation is done
            //photos =  camera roll or image picker
            //images = camera 
            try {
                //no image selected
                if (!this.state.photos && !this.state.imageurl) {
                    Alert.alert("Please use camera or choose an image!, 请使用相机或选照片！")
                }
                //if only camera picture is selected
                else if (!this.state.photos && this.state.imageurl) {
                    console.log("camera only")
                    try {
                        let string = "";
                        //Calling uploadimage class to submit the image into storage
                        this.uploadImage(this.state.image, this.getFileName(this.state.image))
                        string = ('Fault/' + this.state.imageurl)
                        //submit into firebase db
                        setTimeout(function () {
                            this.submitFault(email, comments, datetime, currentDate, description, outlet, name, cat, radio, check, status, string);//Calling submit fault class to submit the fault to database
                        }.bind(this), 15000)
                    } catch (e) {
                        console.log("error in report screen submit photo from camera function inside submit function e : " + e)
                    }
                    //Alert to user that fault has been submitted
                    Alert.alert(
                        'Successfully reported fault, 故障报告成功！',
                        'please wait 10 seconds to load fault, \n请等10秒，故障加载请稍候',
                        [{
                            text: `OK`,
                            onPress: () => { this.props.navigation.navigate('Outlet') } //Navigate user back to outlet page
                        }]
                    )
                }
                //if only camera roll is selected
                else if (!this.state.imageurl && this.state.photos) {
                    console.log("camera roll only")
                    try {
                        let string = "";
                        //Calling uploadimage class to submit the image into storage
                        for (let i = 0; i < this.state.photos.length; i++) {
                            this.uploadImage((this.state.photos[i]).toString(), this.getFileName(this.state.photos[i])) //Calling upload image class to submit the image into storage using a loop to loop through the multiple ones
                        }
                        //construct string var to parse into submitfault func
                        this.state.photosurl.map((item) => {
                            string += ('Fault/' + item + ",")
                        })
                        //submit into firebase db
                        setTimeout(function () {
                            this.submitFault(email, comments, datetime, currentDate, description, outlet, name, cat, radio, check, status, string);//Calling submit fault class to submit the fault to database
                        }.bind(this), 15000)
                    } catch (e) {
                        console.log("1234 consolog in submitting the fault error is:  " + e)
                    }//end of try catch
                    //Alert to user that fault has been submitted
                    Alert.alert(
                        'Successfully reported fault, 故障报告成功！',
                        'please wait 10 seconds to load fault, \n请等10秒，故障加载请稍候',
                        [{
                            text: `OK`,
                            onPress: () => { this.props.navigation.navigate('Outlet') } //Navigate user back to outlet page
                        }]
                    )
                }
                //if both camera and picture is selected
                else if (this.state.photos && this.state.imageurl) {
                    console.log("both camera and camera roll")
                    try {
                        //let the string be populated with camera url first
                        let string = ('Fault/' + this.state.imageurl)
                        //then the string adds camera roll items as well
                        this.state.photosurl.map((item) => {
                            string += ('Fault/' + item + ",")
                            // console.log(String)
                        })
                        //Calling uploadimage class to submit the camera image into storage
                        this.uploadImage(this.state.image, this.getFileName(this.state.image))
                        //Calling uploadimage class to submit the camera roll image into storage
                        for (let i = 0; i < this.state.photos.length; i++) {
                            this.uploadImage((this.state.photos[i]).toString(), this.getFileName(this.state.photos[i])) //Calling upload image class to submit the image into storage using a loop to loop through the multiple ones
                        }
                        //submit into firebase db for json obj imageurl: "Fault/....,...."
                        setTimeout(function () {
                            this.submitFault(email, comments, datetime, currentDate, description, outlet, name, cat, radio, check, status, string);//Calling submit fault class to submit the fault to database
                        }.bind(this), 15000)
                    } catch (e) {
                        console.log("error in submitting the fault error is:  " + e)//lll
                    }//end of try catch
                    //Alert to user that fault has been submitted
                    Alert.alert(
                        'Successfully reported fault, 故障报告成功！',
                        'please wait 10 seconds to load fault, \n请等10秒，故障加载请稍候',
                        [{
                            text: `OK`,
                            onPress: () => { this.props.navigation.navigate('Outlet') } //Navigate user back to outlet page
                        }]
                    )
                }
            } catch (error) {
                Alert.alert("error submitting image, try catch error is: " + error);//if they didn't succeed it means that image was not selected.
            }
        } else {//Alert
            Alert.alert('Please fill in the necessary data')
        }
    }
    displayRadio() {//displaying radio question and calling method to radio answer
        if (this.state.problem2.haveRadio == 'true') { // checking haveRadio true
            let radio = Object.values(this.state.problem2.radio); //Convert radio data into object values to map the data
            return radio.map((radio) => {//Maping radio to get question and answer
                return [
                    //Display radio question in text format
                    <Text style={styles.fontTextQues}>{radio.name + ':'}</Text>,
                    //Calling out display radio answer to display all answer in a dropdown format
                    this.displayRadioAnswer(radio.answer),
                ]
            })

        }
    }
    displayPicture() {
        if (this.state.selectCat == "Aircon/冷气") {
            return <TouchableHighlight
                style={styles.submitbutton2}
                underlayColor="white"
                onPress={() => this.props.navigation.navigate('AirconPictures')}//Navigate user back to outlet page
            >
                <Icon name="picture-o" size={16} style={styles.icon2}>
                    <Text style={styles.submitbuttonText2}> View Aircon Picture/看冷气图片</Text>
                </Icon>
            </TouchableHighlight>
        }
        if (this.state.selectCat == "Chiller/冷箱") {
            return <TouchableHighlight
                style={styles.submitbutton2}
                underlayColor="white"
                onPress={() => this.props.navigation.navigate('ChillerPictures')}//Navigate user back to outlet page
            >
                <Icon name="picture-o" size={16} style={styles.icon2}>
                    <Text style={styles.submitbuttonText2}> View Chiller Picture/看冷箱图片</Text>
                </Icon>
            </TouchableHighlight>
        }
        if (this.state.selectCat == "Electrical & Lighting/电与灯事项") {
            return <TouchableHighlight
                style={styles.submitbutton2}
                underlayColor="white"
                onPress={() => this.props.navigation.navigate('ElecNLightPictures')}//Navigate user back to outlet page
            >
                <Icon name="picture-o" size={16} style={styles.icon2}>
                    <Text style={styles.submitbuttonText2}> View Type/s of Lighting Picture/看灯泡分类图片</Text>
                </Icon>
            </TouchableHighlight>
        }
    }
    deletePicBtn() {
        if (this.state.image != null) {
            return <TouchableHighlight
                style={styles.deleteImagebutton}
                underlayColor="white"
                onPress={() => this.deletePic()}
            >
                <Icon name="trash" size={16} style={styles.deleteicon}>
                    <Text style={styles.deleteimagebuttonText}> Delete Image/删除图片</Text>
                </Icon>
            </TouchableHighlight>
        }
    }

    displayCameraBtn() {
        if (this.state.image != null) {
            return <TouchableHighlight
                style={styles.submitbutton1}
                underlayColor="white"
                onPress={() => this.openCamera()}
            >
                <Icon name="camera" style={styles.icon}>
                    <Text style={styles.submitbuttonText}>  Re-Upload Image/重新上传图片</Text>
                </Icon>
            </TouchableHighlight>
        }
        else {
            return <TouchableHighlight
                style={styles.submitbutton1}
                underlayColor="white"
                onPress={() => this.openCamera()}
            >
                <Icon name="camera" style={styles.icon}>
                    <Text style={styles.submitbuttonText}>  Please Take Picture/请使用相机</Text>
                </Icon>
            </TouchableHighlight>
        }
    }
    deletePic() {
        this.setState({
            imageurl: null,
            image: null
        })
    }
    //////////////////////////
    //      image picker
    /////////////////////////
    imagesCallback = (callback) => {
        //so basically when the funtion is called, the state is reset the set to whatever is selected again.
        //sorry it had to be this way, i've tried cloning to set it but it ends up jsut retaining whatever i put in it 
        // remove the two lines below and you will see what i mean
        this.state.photosurl = [];
        this.state.photos = [];

        callback.then((photosA) => {
            let photosurl = [...this.state.photosurl]
            let photos = [...this.state.photos]
            // console.log(photos)
            for (let i = 0; i < photosA.length; i++) {
                let string = this.getFileName(photosA[i].uri);
                photosurl.push(string);
                photos.push(photosA[i].uri);
                console.log(string);
            }
            this.setState({ photosurl })
            this.setState({ photos })
        }).catch((e) => console.log(e))
    };
    updateHandler = (count, onSubmit) => {
        // this.props.navigation.setParams({
        //   headerTitle: "{{count}} selected",
        //   headerRight: onSubmit,
        // });
    };
    renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );
    render() {
        let { image } = this.state;
        const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
        const noCameraPermissionComponent = <Text style={styles.emptyStay}>No access to camera</Text>;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <ScrollView>
                    <ImageBackground style={styles.imgBackground}
                        resizeMode='cover'
                        source={require('../images/reportIssue.jpg')}>
                    </ImageBackground>
                    <View style={styles.main}>
                        <Text style={styles.fontTextQues}>Staff Name/员工名字</Text>
                        <TextInput style={styles.itemInput} onChange={this.handleChangeInput} placeholderTextColor="gray" placeholder="Staff Name/职员姓名" ></TextInput>
                        <Text style={styles.fontTextQues}>Category of fault/故障类别：</Text>
                        {this.displayPicture()}
                        <DropDownPicker items={
                            this.state.problem.map((problem) => {//mapping the data to display all the problem name from database to dropdownpicker
                                return (
                                    { label: problem.name, value: problem.uuid, } //setting label as problem name and value as uuid to later retrieve the right data
                                );
                            })
                        }
                            placeholder="Select Category/选择类别"
                            containerStyle={styles.dropdownInput}
                            style={{ backgroundColor: '#fafafa', }}
                            dropDownStyle={{ backgroundColor: '#fafafa', }}
                            itemStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onChangeItem={item => this.handleCategory(item)}
                        />
                        <View>
                            {
                                this.displayRadio() //Calling displayRadio to display all radio question/answer
                            }
                            {
                                this.displayCheckbox() //Calling displayCheckbox to display all checkbox question/answer

                            }
                            <KeyboardAvoidingView
                                style={styles.keyboardAvoidContainer}
                                enabled
                                behavior={"padding"} // you can change that by using Platform
                                keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
                            >
                                {

                                    this.displayInput() //Calling displayInput to display input
                                }
                            </KeyboardAvoidingView>
                        </View>
                        <View>
                            {this.displayCameraBtn()}
                            <View >
                                {this.deletePicBtn()}
                                {image &&
                                    <Image source={{ uri: image }} style={{ width: 300, height: 200, marginBottom: 10, marginLeft: 20, alignItems: 'center', justifyContent: "space-around" }} />}
                            </View>
                        </View>
                        <TouchableHighlight
                            style={styles.submitbutton}
                            underlayColor="white"
                            onPress={() => this.Submit()}
                        >
                            <Text style={styles.submitbuttonText}>Submit/提交</Text>
                        </TouchableHighlight>

                    </View>
                    <ImageBrowser
                        max={3} //Choose the max ammount of images
                        onChange={this.updateHandler}
                        callback={this.imagesCallback}
                        renderSelectedComponent={this.renderSelectedComponent}
                        emptyStayComponent={emptyStayComponent}
                        noCameraPermissionComponent={noCameraPermissionComponent}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }

}
const styles = StyleSheet.create({
    emptyStay: {
        textAlign: 'center',
    },
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 50,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#0580FF'
    },
    countBadgeText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    },
    main: {
        flex: 1,
        paddingTop: 30,
        paddingRight: 30,
        paddingLeft: 30,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    main2: {
        flex: 1,
        marginLeft: 20,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    icon2: {
        color: 'blue',
        textAlign: 'left'
    },
    deleteicon: {
        color: 'red',
        textAlign: 'left',
        paddingTop: 10
    },
    CheckboxText: {
        alignSelf: 'baseline'
    },
    Checkbox: {
        width: 350 - 30,
        alignSelf: 'baseline'
    },
    fontTextAns: {
        fontWeight: 'bold',
        marginBottom: 20
    },
    fontTextQues: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
    },
    title: {
        marginBottom: 20,
        fontSize: 25,
        textAlign: 'center'
    },
    dropdownInput: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    }
    ,
    itemInput: {
        paddingLeft: 10,
        height: 45,
        padding: 4,
        marginRight: 0,
        fontSize: 14,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    textFieldInput: {
        marginTop: 10,
        paddingLeft: 10,
        height: 60,
        padding: 4,
        marginRight: 0,
        fontSize: 14,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#111',
        alignSelf: 'center'
    },
    submitbuttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    submitbuttonText2: {
        fontSize: 13,
        color: 'blue',
        textDecorationLine: "underline",
    },
    imagebuttonText: {
        fontSize: 15,
        color: '#111',
    },
    deleteimagebuttonText: {
        fontSize: 15,
        color: 'red',
        textDecorationLine: "underline",
    },
    button: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    submitbutton: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: 'green',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5,
        marginBottom: 25,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    submitbutton1: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#0ba6ff',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    submitbutton2: {
        height: 30,
        marginTop: 3,
        marginBottom: 5
        //flexDirection: 'row',
        //borderRadius: 8,
        //marginBottom: 10,
        //alignSelf: 'stretch',
        //justifyContent: 'center',
    },
    imagebutton: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    deleteImagebutton: {
        height: 40,
        flexDirection: 'row',
        justifyContent: "center"
    },
    imgBackground: {
        width: '100%',
        height: 100,
        flex: 1
    }, icon: {
        fontSize: 16,
        padding: 10,
    }
});