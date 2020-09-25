import React, { Component } from 'react'
import { StyleSheet, ImageBackground, View, Text, TextInput, TouchableHighlight, ScrollView, Alert, KeyboardAvoidingView, Platform} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../constants/ApiKeys';
import { st } from '../constants/ApiKeys';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import moment from 'moment';



export default class Outlet extends Component {
    state = {
        outlet: this.props.route.params,
        staffname: null,
        customername: null,
        customeremail: null,
        customercontactno: null,
        feedbackType: null,
        standard: null,
        issue: null,
        rating: null,
        image: null,
        hasCameraPermission: null,
        imageurl: null,
    }
    getPermissionAsync = async () => { // getting permission for user to select camera roll
        if (Constants.platform.ios) {
            const { status } = await Camera.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
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
    pickimage = async () => { //picking of image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);
        if (!result.cancelled) {
            var fileName = this.getFileName(result.uri);
            console.log("filename: " + fileName);
            var test = this.uuidv4();
            test += '/images/' + fileName;
            this.setState({
                imageurl: test
            })
            this.setState({ image: result.uri });
        }
    };
    uploadImage = async (uri, imageName) => { //uploading the image to storage
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = st.ref('Feedback/').child(this.state.imageurl);

        return ref.put(blob);
    }

    async componentDidMount() {// getting permission for user to select camera roll
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === "granted" })
    }
    handlestaffChangeInput = e => {
        this.setState({
            staffname: e.nativeEvent.text
        });
    };
    handlecustNameChangeInput = e => {
        this.setState({
            customername: e.nativeEvent.text
        });
    };
    handlecustEmailChangeInput = e => {
        this.setState({
            customeremail: e.nativeEvent.text
        });
    };
    handlecustContactNoChangeInput = e => {
        this.setState({
            customercontactno: e.nativeEvent.text
        });
    };
    handleIssueInput = e => {
        this.setState({
            issue: e.nativeEvent.text
        });
    }
    handleFeedbackType(item) {
        this.setState({
            feedbackType: item.label
        });
    }
    handleStandard(item) {
        this.setState({
            standard: item.label
        });
    }
    handleRating(item) {
        this.setState({
            rating: item.label
        });
    }
    submitFeedback(location, staffName, custName, custEmail, custContactNo, feedbacktype, standard, issue, ratings, datetime, date, imageurl) {
        if (custContactNo == null) {
            custContactNo = ''
        }
        const key = db.ref('/reports/').push().getKey();
        db.ref('/feedback/' + key).set({
            uuid: key,
            location: location,
            staffname: staffName,
            custname: custName,
            custemail: custEmail,
            custcontactno: custContactNo,
            feedbackType: feedbacktype,
            standard: standard,
            issue: issue,
            rating: ratings,
            datetime: datetime,
            date: date,
            imageurl: imageurl
        });
    }
    Submit() {
        const location = this.state.outlet;
        const staffName = this.state.staffname;
        const custName = this.state.customername;
        const custEmail = this.state.customeremail;
        const custContactNo = this.state.customercontactno;
        const feedbacktype = this.state.feedbackType;
        const standard = this.state.standard;
        const issue = this.state.issue;
        const ratings = this.state.rating;
        const imageurl = this.state.imageurl;
        let date = new Date().getDate(); //Current Date
        var dateNtime = moment()
            .utcOffset('+08:00')
            .format('YYYY/MM/DD HH:mm:ss');
        let month = new Date().getMonth() + 1; //Current Month
        let monthsInName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let monthName = monthsInName[month - 1];
        let year = new Date().getFullYear(); //Current Year
        let hours = new Date().getHours(); //Current Hours
        let min = new Date().getMinutes(); //Current Minutes
        let sec = new Date().getSeconds(); //Current Seconds
        //const datetime = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
        const datetime = dateNtime;
        const currentDate = date + '-' + monthName + '-' + year;
        let validate = false;
        // if ((staffName != null) && (custName != null) && (imageurl != null) && (custContactNo != null) && (location != null) && (feedbacktype != null) && (standard != null) && (issue != null) && (ratings != null)) {
        //     validate = true;
        // } else {
        if ((staffName != null) && (custName != null) && (custContactNo != null) && (location != null) && (feedbacktype != null) && (standard != null) && (issue != null) && (ratings != null)) {
            validate = true;
        } else {
            validate = false;
        }
        if (validate == true) {
            //this.uploadImage(this.state.image, this.getFileName(this.state.image)) //Calling uploadimage class to submit the image into storage
            this.submitFeedback(location, staffName, custName, custEmail, custContactNo, feedbacktype, standard, issue, ratings, datetime, currentDate, imageurl);
            Alert.alert('Feedback Submitted Successfully!');
            this.props.navigation.navigate('Outlet');
        }
        else {
            Alert.alert('Please fill in necessary data');
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
    deletePic() {
        this.setState({
            imageurl: null,
            image: null
        })
    }
    render() {
        let { image } = this.state;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <ScrollView>
                    <ImageBackground style={styles.imgBackground}
                        resizeMode='cover'
                        source={require('../images/customerFeedback.jpg')}>
                    </ImageBackground>
                    <View style={styles.main}>

                        <TextInput style={styles.itemInput} onChange={this.handlestaffChangeInput} placeholderTextColor="gray" placeholder="Staff Name/职员姓名" ></TextInput>
                        <Text style={styles.fontTextQues}>Customer Details/客户详情</Text>
                        <TextInput style={styles.custitemInput} onChange={this.handlecustNameChangeInput} placeholderTextColor="gray" placeholder="Name/顾客信息" ></TextInput>
                        <TextInput style={styles.custitemInput} onChange={this.handlecustEmailChangeInput} placeholderTextColor="gray" placeholder="Email/电子邮件 (Optional/可选择的)" ></TextInput>
                        <TextInput style={styles.itemInput} keyboardType="number-pad" returnKeyType={'done'} onChange={this.handlecustContactNoChangeInput} placeholderTextColor="gray" placeholder="Contact No./联系电话 " ></TextInput>
                        <Text style={styles.fontTextQues}>Feedback Type/反馈类型</Text>
                        <View>
                            <DropDownPicker items={[{ label: 'Product-Related/产品相关', value: 'Product-Related/产品相关' }, { label: 'Service-Related/服务相关', value: 'Service-Related/服务相关' }]}
                                placeholder="Feedback Type/反馈类型"
                                containerStyle={styles.dropdownInput}
                                style={{ backgroundColor: '#fafafa', }}
                                dropDownStyle={{ backgroundColor: '#fafafa', }}
                                itemStyle={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onChangeItem={item => this.handleFeedbackType(item)}
                            />
                            <View>
                                <Text style={styles.fontTextQues}>Standard/类型</Text>
                                <DropDownPicker items={[{ label: 'Feedback/反馈', value: 'Feedback/反馈' }, { label: 'Compliment/表扬', value: 'Compliment/表扬' }, { label: 'Others/其他', value: 'Others/其他' }]}
                                    placeholder="Feedback or Compliment/投诉或表扬"
                                    containerStyle={styles.dropdownInput}
                                    style={{ backgroundColor: '#fafafa', }}
                                    dropDownStyle={{ backgroundColor: '#fafafa', }}
                                    itemStyle={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onChangeItem={item => this.handleStandard(item)}
                                />
                                <View>
                                    <Text style={styles.fontTextQues}>Rating/评分</Text>
                                    <DropDownPicker items={[{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' },]}
                                        placeholder="1-5 (5 Being the best/最满意)"
                                        containerStyle={styles.dropdownInput}
                                        style={{ backgroundColor: '#fafafa', }}
                                        dropDownStyle={{ backgroundColor: '#fafafa', }}
                                        itemStyle={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onChangeItem={item => this.handleRating(item)}
                                    />
                                    <KeyboardAvoidingView
                                        style={styles.keyboardAvoidContainer}
                                        enabled
                                        behavior={"padding"} // you can change that by using Platform
                                        keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
                                    >
                                        <TextInput maxLength={500} multiline style={styles.textFieldInput} onChange={this.handleIssueInput} placeholderTextColor="gray" placeholder="Issue/Others 问题/其他" ></TextInput>
                                    </KeyboardAvoidingView>

                                    {/* <View>
                                        <TouchableHighlight
                                            style={styles.imagebutton}
                                            underlayColor="white"
                                            onPress={() => this.pickimage()}
                                        >
                                            <Icon name="camera" style={styles.icon}>
                                                <Text style={styles.imagebuttonText}>  Upload Image/上传图片</Text>
                                            </Icon>
                                        </TouchableHighlight>
                                        {this.deletePicBtn()}
                                        {image &&
                                            <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 10 }} />}
                                    </View> */}
                                    <TouchableHighlight
                                        style={styles.submitbutton}
                                        underlayColor="white"
                                        onPress={() => this.Submit()}
                                    >
                                        <Text style={styles.submitbuttonText}>Submit/提交</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingTop: 30,
        paddingRight: 30,
        paddingLeft: 30,
        flexDirection: 'column',
        justifyContent: 'center',
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
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
    },
    title: {
        marginBottom: 30,
        fontSize: 20,
        textAlign: 'left'
    },
    dropdownInput: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center', marginBottom: 20,
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
        paddingLeft: 10,
        height: 100,
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
    custitemInput: {
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
        marginBottom: 10,
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
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 25
    },
    imgBackground: {
        width: '100%',
        height: 100,
        flex: 1
    },
    container: {
        flex: 1
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
    deleteicon: {
        color: 'red',
        textAlign: 'left',
        paddingTop: 10
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
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize: 36,
        marginBottom: 48
    },
    textInput: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12
    }, icon: {
        fontSize: 16,
        padding: 10,
    }
});