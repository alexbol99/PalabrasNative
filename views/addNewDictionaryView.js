/**
 * Created by alexanderbol on 28/02/2016.
 */
import React from 'react';
var AddNewDictionaryHeaderComponent = require('../components/addNewDictionaryHeader').AddNewDictionaryHeaderComponent;
var globalStyles = require('../styles/styles').styles;
import * as ActionTypes from '../store/actionTypes';

var Dictionaries = require('../models/dictionaries').Dictionaries;
import { Languages } from '../models/languages';

import {
    Text,
    StyleSheet,
    View,
    TextInput,
    Picker,
    Platform,
    BackAndroid,
    Alert
    } from 'react-native';

// var Item = PickerIOS.Item;

export const AddNewDictionaryView = React.createClass ({
    getInitialState() {
        return {
            localDictionary: new Dictionaries()
        }
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    componentDidMount() {
        // Listen Android back button
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.backToDictionaryView);
        }
        this.setState({
            localDictionary: new Dictionaries(this.state.user.parseUser)
        });
    },
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.backToDictionaryView);
        }
    },
    backToDictionaryView() {
        if (!this.validateSaved()) return;
        this.dispatch({
            type: ActionTypes.BACK_HOME_BUTTON_PRESSED,
            needFetchData: true
        });
    },
    saveDictionary() {
        if (!this.validateNameNotEmpty()) return;
        if (!this.validateLanguage1NotEmpty()) return;
        if (!this.validateLanguage2NotEmpty()) return;
        if (!this.validateLanguagesAreDifferent()) return;

        this.updateDictionary();
    },
    /* Update database and state */
    updateDictionary() {
        Dictionaries.updateDictionary(this.state.localDictionary).then(
            (dictionary) => {
                Alert.alert(`Good news`,
                    `Dictionary ${this.state.localDictionary.get('name')}  was saved to your database`);
                this.dispatch({
                    type: ActionTypes.DICTIONARY_UPDATED,
                    dictionary: dictionary
                })
            }),
            (error) => {
                Alert.alert("Problems with connection to server");
            }
    },
    dictionaryNameChanged({name}) {
        this.setState({
            localDictionary: this.state.localDictionary.set('name', name)
        });
    },
    language1Selected({name}) {
        var language = this.state.languages.find( (language_tmp) => (language_tmp.get('name') == name) );
        this.setState({
            localDictionary: this.state.localDictionary.set('language1', language)
        });

        //var isSpeechSupported = Languages.isSpeechSupported(language, this.state.app.locales);
        //if (!isSpeechSupported) {
        //    alert(`Your smartphone does not support text to speech for ${name} language`);
        //}
    },
    language2Selected({name}) {
        var language = this.state.languages.find( (language_tmp) => (language_tmp.get('name') == name) );
        this.setState({
            localDictionary: this.state.localDictionary.set('language2', language)
        });

        //var isSpeechSupported = Languages.isSpeechSupported(language, this.state.app.locales);
        //if (!isSpeechSupported) {
        //    alert(`Your smartphone does not support text to speech for ${name} language`);
        //}
    },
    learnMoreChanged({url}) {
        this.setState({
            localDictionary: this.state.localDictionary.set('learnMore', url)
        });
    },
    validateNameNotEmpty() {
        if (this.state.localDictionary.get('name').length != 0)
            return true;
        Alert.alert(`Wait a minute ...`,
            `Please enter dictionary name`);
        return false;
    },
    validateLanguage1NotEmpty() {
        if (this.state.localDictionary.get('language1'))
            return true;
        Alert.alert(`Wait a minute ...`,
            `Please choose language you learn`);
        return false;
    },
    validateLanguage2NotEmpty() {
        if (this.state.localDictionary.get('language2'))
            return true;
        Alert.alert(`Wait a minute ...`,
            `Please choose your language`);
        return false;

    },
    validateLanguagesAreDifferent() {
        if (this.state.localDictionary.get('language1').id != this.state.localDictionary.get('language2').id)
            return true;
        Alert.alert(`Wait a minute ...`,
            `Please choose two different languages`);
        return false;
    },
    validateSaved() {
        if (this.state.localDictionary.id == this.state.app.currentDictionary.id)
            return true;
        Alert.alert(
            'Are you sure?',
            `Your new dictionary was not saved`,
            [
                {text: 'Cancel', onPress: () => { }, style: 'cancel'},
                {text: 'OK', onPress: () => {
                    this.dispatch({
                        type: ActionTypes.BACK_HOME_BUTTON_PRESSED,
                        needFetchData: true
                    });
                    return true;
                }}
            ]
        );
        return false;
    },
    render() {
        return (
            <View style={styles.container}>
                <AddNewDictionaryHeaderComponent
                    title="Add new dictionary"
                    onBackButtonPressed = {this.backToDictionaryView}
                    onSaveDictionaryButtonPressed = {this.saveDictionary}
                />

                {/* Content: Edit Form */}
                <View style={styles.content}>

                    {/* Edit Directory Name */}
                    <Text style={styles.labelName}>
                        Name:
                    </Text>
                    <TextInput
                        style={styles.input}
                        blurOnSubmit={false}
                        value={this.state.localDictionary.get('name')}
                        onChangeText={(name) => this.dictionaryNameChanged({name})}
                    />

                    {/* Select First Language */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>
                            Language you learn:
                        </Text>
                        <Picker style={{flex:1}}
                                selectedValue={this.state.localDictionary.get('language1') ?
                                    this.state.localDictionary.get('language1').get('name') : ""}
                                onValueChange={(name) => this.language1Selected({name})} >
                            {
                                this.state.languages.map( (language) =>
                                    <Picker.Item key= {language.id}
                                                 label={language.get('localName')}
                                                 value={language.get('name')} />
                                )
                            }
                        </Picker>
                    </View>

                    {/* Select Second Language */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>
                            Your language:
                        </Text>
                        <Picker style={{flex:1}}
                                selectedValue={this.state.localDictionary.get('language2') ?
                                    this.state.localDictionary.get('language2').get('name') : ""}
                                onValueChange={(name) => this.language2Selected({name})} >
                            {
                                this.state.languages.map( (language) =>
                                    <Picker.Item key= {language.id}
                                                 label={language.get('localName')}
                                                 value={language.get('name')} />
                                )
                            }
                        </Picker>
                    </View>

                    {/* Edit Learn More */}
                    <Text style={styles.labelName}>
                        Learn more:
                    </Text>
                    <TextInput
                        style={styles.input}
                        blurOnSubmit={false}
                        value={this.state.localDictionary.get('learnMore')}
                        onChangeText={(url) => this.learnMoreChanged({url})}
                    />
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        backgroundColor: globalStyles.container.backgroundColor
    },
    content: {
        backgroundColor: globalStyles.content.backgroundColor
    },
    description: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        /*color: '#656565'*/
    },
    inputRow: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection:'row',
        alignItems: 'center'
    },
    labelName: {
        flex:1,
        textAlign: 'left',
        fontSize: 16,
        marginTop: 10,
        marginLeft: 10,
    },
    label: {
        flex:1,
        textAlign: 'left',
        fontSize: 16,
    },
    input: {
        height: 36,
        padding: 4,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        /*flex: 4,*/
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'chartreuse', /*'#48BBEC',*/
        borderRadius: 8,
        /*color: '#48BBEC'*/
    },
    picker: {
        height: 36,
        padding: 4,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        /*flex: 4,*/
        borderWidth: 1,
        borderColor: 'chartreuse', /*'#48BBEC',*/
        borderRadius: 8,
        /*color: '#48BBEC'*/
    },
    inputOther: {
        flex:1,
        /*textAlign: 'right',*/

        height: 36,
        padding: 4,
        /*
         marginLeft: 10,
         marginRight: 10,*/
        /*flex: 4,*/
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'chartreuse', /*'#48BBEC',*/
        borderRadius: 8,
        /*color: '#48BBEC'*/
    },
    inputOtherNotEditable: {
        flex: 1,
        /*textAlign: 'right',*/
        height: 36,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgrey', /*'#48BBEC',*/
        borderRadius: 8,
        /*color: '#48BBEC'*/
    }
});

/*
 var styles = StyleSheet.create({
 container: {
 padding:30,
 marginTop: 65,
 alignItems:'center'
 },
 image: {
 width: 217,
 height: 138
 },

 });
 */

/* module.exports = HomeView; */
