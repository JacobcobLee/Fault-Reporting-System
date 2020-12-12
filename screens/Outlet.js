import React, { Component } from 'react'
import { ImageBackground, StyleSheet, View, Text, TouchableHighlight, SafeAreaView, TextComponent } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { db } from '../constants/ApiKeys';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
    en: { welcome: 'Welcome!',outletSelected:'Scanned into', reportIssue: 'Report', submitFeedback:'Feedback', recentRptedIssue:'Recent Reported Issue',
        reportedBy: 'Reported by', category:'Category',dateNtime:'Date & Time',status:'Status', issue:'Issue'},
    zh: { welcome: '欢迎！' ,outletSelected:'在商店', reportIssue: '报告问题', submitFeedback:'客户反馈',recentRptedIssue:'最近报告的问题',
        reportedBy: '报告者',category:'类别',dateNtime:'日期和时间',status:'状态', issue:'问题' },
  };
  // Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default class Outlet extends Component {
    
    state = {
        tableHead: [i18n.t('reportedBy'),  i18n.t('issue')],
        faults: [],
        otherParam: '',
    }
    componentWillMount() {
        this.setState({
            otherParam: this.props.route.params // set storeName
        })
        try {
            db.ref('reports').orderByChild('storeName').equalTo(this.props.route.params).limitToLast(10).on('value', snapshot => { //Get latest 10 faults
                let data = snapshot.val();
                if (data == null) { // if null
                    let faults = [] 
                    this.setState({ faults }); // set fault as null

                    //also extract the issue.
                    

                } else {
                    let faults = Object.values(data); //get faults
                    faults.sort((a, b) => a - b).reverse(); // sort by desc order
                    this.setState({ faults }); // set faults to state
                    // console.log("component did mount"); 
                    }
            });
        } catch (error) {
            console.log(error);
        }
    }
    displayStoreName(){ //diaplay the store name by matching with the database
        let name = [], code = "fail";
        db.ref('store')
        .orderByChild('name')
        .equalTo(this.state.otherParam).on('value', snapshot =>{
            name = snapshot.val()
            code = Object.keys(name)
            // console.log( " @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        })
        return code;
    }
    displayData() { // display recently reported issue as table rows
        // console.log("display data")
        return <Rows data={this.state.faults.map((faults) => {
            //this logic here is to extract t
            let testString = "";
            if (!(faults.problem.checkbox.name == undefined)) {
            testString =
            faults.problem.checkbox.name +
            " :\n" +
            faults.problem.checkbox.answer + ' ';
            // console.log("teststring  value is " + testString);
            } else {
                for (i = 0; i < faults.problem.checkbox.length; i++) {
                    testString +=
                    faults.problem.checkbox[i].name +
                    " :\n" +
                    faults.problem.checkbox[i].answer[0];

                    if (i < faults.problem.checkbox.length) {
                    testString += ", \n ";
                    }
                } //end of for loop
            // console.log("test string value" + testString);
            } //else closes

            return [faults.staffName + '\n' +faults.dateTime +'\n' + "["+faults.status+"]", faults.problem.category+'\n'+testString]
        }
        )} style={styles.tableBody} flexArr={[1, 3]} textStyle={styles.tableText} />//end of <row>

        // in the function, if-else is used to determine the status of the fault reported and render the object with the corresponding colour
        //im sure there is a better way but im just an intern man my knowledge is limited
        //if you pay peanuts, you get monkey.

        //if else is solely to display the different colour for the row to represent status
        // Default is set to be red, just in case there is a bug, the problem wont be treated like its solved
        //danger/red is unresolved (fresh report), caution/yellow is pending(case has been seen and solution is ongoing), success/green is Resolved

        // try{
        //     this.state.faults.map((f)=>{
        //         //if status is resolved display row as success/green color
        //         if(f.status == "Resolved"){
        //             let testString = "";
        //             if (!(f.problem.checkbox.name == undefined)) {
        //             testString =
        //             f.problem.checkbox.name +
        //             " :\n" +
        //             f.problem.checkbox.answer + ' ';
        //             console.log("teststring  value is " + testString);
        //             return <Row data={[f.staffName + '\n' +f.dateTime, f.problem.category+'\n'+testString]} style={styles.rowColourSuccess} flexArr={[1, 3]} textStyle={styles.tableText} />
        //             } else {
        //                 for (let i = 0; i < this.state.faults.problem.checkbox.length; i++) {
        //                     testString +=
        //                     f.problem.checkbox[i].name +
        //                     " :\n" +
        //                     f.problem.checkbox[i].answer[0];

        //                     if (i < this.state.faults.problem.checkbox.length) {
        //                     testString += ",\n";
        //                     }
        //                 } //end of for loop
        //                 console.log("test string value" + testString);
        //             return <Row data={[f.staffName + '\n' +f.dateTime, f.problem.category+'\n'+testString]} style={styles.rowColourSuccess} flexArr={[1, 3]} textStyle={styles.tableText} />
                        
        //         } //else closes
    
                    
                    
        //         }// end of if
        //         //else if the status is pending, display cautious/yellow colour
        //         else if (faults.status == "Pending"){
        //             let testString = "";
        //             if (!(f.problem.checkbox.name == undefined)) {
        //             testString =
        //             f.problem.checkbox.name +
        //             " :\n" +
        //             f.problem.checkbox.answer + ' ';
        //             console.log("teststring  value is " + testString);
        //             return <Row data={[f.staffName + '\n' +f.dateTime, f.problem.category+'\n'+testString]} style={styles.rowColourSuccess} flexArr={[1, 3]} textStyle={styles.tableText} />
        //             } else {
        //                 for (let i = 0; i < this.state.faults.problem.checkbox.length; i++) {
        //                     testString +=
        //                     f.problem.checkbox[i].name +
        //                     " :\n" +
        //                     f.problem.checkbox[i].answer[0];

        //                     if (i < this.state.faults.problem.checkbox.length) {
        //                     testString += ",\n";
        //                     }
        //                 } //end of for loop
        //         console.log("test string value" + testString);
        //         return <Row data={[f.staffName + '\n' +f.dateTime, f.problem.category+'\n'+testString]} style={styles.rowColourSuccess} flexArr={[1, 3]} textStyle={styles.tableText} />
        //         } //else closes
    
                    
                    
        //         } //end of if else
        //         // else if status dont meet the requirements, default it to red
        //         else {
        //             let testString = "";
        //             if (!(f.problem.checkbox.name == undefined)) {
        //             testString =
        //             f.problem.checkbox.name +
        //             " :\n" +
        //             f.problem.checkbox.answer + ' ';
        //             console.log("teststring  value is " + testString);
        //             return <Row data={[f.staffName + '\n' +f.dateTime, f.problem.category+'\n'+testString]} style={styles.rowColourDanger} flexArr={[1, 3]} textStyle={styles.tableText} />
        //             } else {
        //                 for (let i = 0; i < this.state.faults.problem.checkbox.length; i++) {
        //                     testString +=
        //                     f.problem.checkbox[i].name +
        //                     " :\n" +
        //                     f.problem.checkbox[i].answer[0];

        //                     if (i < this.state.faults.problem.checkbox.length) {
        //                     testString += ",\n";
        //                     }
        //                 } //end of for loop
        //         console.log("test string value" + testString);
        //         return <Row data={[f.staffName + '\n' +f.dateTime, f.problem.category+'\n'+testString]} style={styles.rowColourDanger} flexArr={[1, 3]} textStyle={styles.tableText} />
        //         } //else closes
    
                    
                    
        //         }// end of else
        //     })//end of arrow function
        //     console.log([f.staffName + '\n' +f.dateTime, f.problem.category+'\n'+testString])
        // }
        // catch(e){console.log("error in display data try catch block, error is: " + e)}//end of catch block

        //ok so the color thing dont work so im jsut leaving he idea here if anyone that touches this code wants to try it out
        //instead im just going to display the status straight
    }//end of display data

    render() {
        // console.log("render")//
        return (

            <View>
                <View>
                    <View>
                    <ImageBackground style={styles.imgBackground}
                        resizeMode='cover'
                        source={require('../images/outlet.jpeg')}>
                    </ImageBackground>
                    <View style={styles.textTop}>
                        <Text style={{ fontWeight: "bold", color: 'white', textAlign: 'center', fontSize: 30, }}>{i18n.t('welcome')}</Text>
                        <Text style={{ paddingTop:5 ,color: 'white',textAlign: 'center',fontSize: 18 }}>{i18n.t('outletSelected')}</Text>
                        <Text style={{ fontWeight: "bold", color: 'white',textAlign: 'center', fontSize: 18 }}>{this.displayStoreName()} Outlet</Text>
                    </View>
                    
                    <View style={{ flexDirection: "row", justifyContent:"space-evenly" }}>
                        <TouchableHighlight
                            style={styles.button1}
                            underlayColor="white"
                            onPress={() => this.props.navigation.navigate('Report', this.props.route.params)}
                        >
                            <Icon name="exclamation-circle" size={20} style={styles.icon2}>
                                <Text style={styles.buttonText}> {i18n.t('reportIssue')}</Text>
                            </Icon>

                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button1}
                            underlayColor="white"
                            onPress={() => this.props.navigation.navigate('Feedback', this.props.route.params)}
                        >
                            <Icon name="comments" size={20} style={styles.icon}>
                                <Text style={styles.buttonText}> {i18n.t('submitFeedback')}</Text>
                            </Icon>

                        </TouchableHighlight>
                        </View>
                    {/* <View style={styles.buttonLayout}>
                        

                        </View> */}
                    </View>
                    <View style={styles.tableScrollView}>
                        {/* <Text style={{marginBottom:5, marginTop:10   ,fontSize: 15, fontWeight: 'bold', textAlign:'center', textDecorationLine: 'underline' }}>{i18n.t('recentRptedIssue')}</Text> */}
                        <ScrollView style={styles.recentfault} >
                            <Table borderStyle={{borderWidth: 0.2, borderColor: 'black' }}>
                                <Row data={this.state.tableHead} style={styles.tableTitle} flexArr={[1, 3]} textStyle={styles.tableTitleText} />
                                    {this.displayData()}
             
                            </Table>
                        </ScrollView>
                    </View>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({

    functionbut: {
        flex: 1,
        padding: 30,
        paddingTop: 15,
        flexDirection: 'row',
        marginBottom: 10
    },
    functionbut2: {
        flex: 1,
        padding: 30,
        paddingTop: 15,
        flexDirection: 'row',
        marginBottom: 20
    },
    recentfault: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    textTop: {
        padding: 5,
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center'
    }
    ,
    icon: {
        color: '#038cfc',
        alignSelf: 'center',
    },
    icon2: {
        color: 'red',
        alignSelf: 'center'
    },
    title: {
        marginBottom: 20,
        fontSize: 25,
        textAlign: 'center'
    },
    itemInput: {
        height: 250,
        padding: 4,
        marginRight: 5,
        fontSize: 23,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black'
    },
    buttonText: {
        fontSize: 20,
        color: '#111',
        alignSelf: 'center'
    },
    button1: {
        height: 100,
        width: 180,
        flexDirection: 'row',
        justifyContent: "center",
        backgroundColor: 'white',
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        // marginBottom: 10
        },
    button2: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 30,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    imgBackground: {
        width: '100%',
        flexDirection: 'column',
        height: 223,
        flex: 1
    },
    tableTitle: {
        // flex: 1, 
        backgroundColor: '#E84A5F',
        height: 35,
    }, 
    tableTitleText:{
        fontWeight: "bold",
        fontSize: 13,
        margin: 2,
        textAlign: 'center',
        color:'white'
    }, 
    text: {
        textAlign: 'center',
        margin: 1,
        backgroundColor: "#ffffff"
    }, 
    tableText: {
        textAlign: 'left',
        margin: 5,
        backgroundColor: "#ffffff"
        
    }, 
    tableScrollView: {
        height: '62%',
        // backgroundColor: "#ffffff"
        paddingTop: 18
    },
    rowColourDanger: {
        backgroundColor: "#FF7166"
    },
    rowColourCaution: {
        backgroundColor: "#FFD374"
    },
    rowColourSuccess: {
        backgroundColor: "#82DE82"
    }
});