import React, { Component } from 'react'
import { ImageBackground, StyleSheet, View, Text, TouchableHighlight, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { db } from '../constants/ApiKeys';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';


// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
    en: { welcome: 'Welcome!',outletSelected:'Currently In', reportIssue: 'Report Issue', submitFeedback:'Submit Customer Feedback', recentRptedIssue:'Recent Reported Issue',
        reportedBy: 'Reported by', category:'Category',dateNtime:'Date & Time',status:'Status', issue:'Issue'},
    zh: { welcome: '欢迎！' ,outletSelected:'在商店', reportIssue: '报告问题', submitFeedback:'提交客户反馈',recentRptedIssue:'最近报告的问题',
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
        otherParam: ''

    }// this 
    componentDidMount() {
        this.setState({
            otherParam: this.props.route.params // set storeName
        })
        try {
            db.ref('reports').orderByChild('storeName').equalTo(this.props.route.params).limitToLast(10).on('value', snapshot => { //Get latest 10 faults
                let data = snapshot.val();
                if (data == null) { // if null
                    let faults = [] 
                    this.setState({ faults }); // set fault as null

                    //also extract the issue
                    

                } else {
                    let faults = Object.values(data); //get faults
                    faults.sort((a, b) => a - b).reverse(); // sort by desc order
                    this.setState({ faults }); // set faults to state
                    console.log(this.state.faults); 
                    }
            });
        } catch (error) {
            console.log(error);
        }
    }

    displayData() { // display recently reported issue as table rows

        return <Rows data={this.state.faults.map((faults) => {
            //this logic here is to extract t
            let testString = "";
            if (!(faults.problem.checkbox.name == undefined)) {
            testString =
            faults.problem.checkbox.name +
            " :\n" +
            faults.problem.checkbox.answer + ' ';
            console.log("teststring  value is " + testString);
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
            console.log("test string value" + testString);
            } //else closes

            return [faults.staffName + '\n' +faults.dateTime, faults.problem.category+'\n'+testString]
        }
        )} style={styles.tableBody} flexArr={[1, 3]} textStyle={styles.text} />//end of <row>
    }

    render() {

        return (

            <View style={{flex: 1}}>
                <View>
                    <View>
                    <ImageBackground style={styles.imgBackground}
                        resizeMode='cover'
                        source={require('../images/outlet.jpeg')}>
                    </ImageBackground>
                    <View style={styles.textTop}>
                        <Text style={{ fontWeight: "bold", color: 'white', textAlign: 'center', fontSize: 30, }}>{i18n.t('welcome')}</Text>
                        <Text style={{ paddingTop:5 ,color: 'white',textAlign: 'center',fontSize: 18 }}>{i18n.t('outletSelected')}</Text>
                        <Text style={{ fontWeight: "bold", color: 'white',textAlign: 'center', fontSize: 18 }}>{this.state.otherParam} OUTLET</Text>
                    </View>

                    <View style={styles.functionbut}>
                        <TouchableHighlight
                            style={styles.button1}
                            underlayColor="white"
                            onPress={() => this.props.navigation.navigate('Report', this.props.route.params)}
                        >
                            <Icon name="exclamation-circle" size={20} style={styles.icon2}>
                                <Text style={styles.buttonText}> {i18n.t('reportIssue')}</Text>
                            </Icon>

                        </TouchableHighlight>
                        </View>
                    <View style={styles.functionbut2}>
                        <TouchableHighlight
                            style={styles.button2}
                            underlayColor="white"
                            onPress={() => this.props.navigation.navigate('Feedback', this.props.route.params)}
                        >
                            <Icon name="comments" size={20} style={styles.icon}>
                                <Text style={styles.buttonText}> {i18n.t('submitFeedback')}</Text>
                            </Icon>

                        </TouchableHighlight>

                        </View>
                    </View>
                    <View style={styles.tableScrollView}>
                        <Text style={{marginBottom:5, marginTop:5 ,fontSize: 12, fontWeight: 'bold', textAlign:'center', textDecorationLine: 'underline' }}>{i18n.t('recentRptedIssue')}</Text>
                        <ScrollView style={styles.recentfault} >
                            <Table borderStyle={{ borderWidth: 0.2, borderColor: 'gray' }}>
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
        flexDirection: 'column',
        marginBottom: 10
    },
    functionbut2: {
        flex: 1,
        padding: 30,
        paddingTop: 15,
        flexDirection: 'column',
        marginBottom: 20
    },
    recentfault: {
        paddingLeft: 10,
        paddingRight: 10
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
        fontSize: 18,
        color: '#111',
        alignSelf: 'center'
    },
    button1: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#ffda66',
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        alignSelf: 'stretch',
        justifyContent: 'center'
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
        height: 230,
        flex: 1
    },
    tableTitle: {
        // flex: 1, 
        backgroundColor: '#E84A5F',
        height: 35
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
        margin: 1
    }, 
    tableScrollView: {
        height: '60%'
    }
});