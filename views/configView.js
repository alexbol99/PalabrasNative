/**
 * Created by alexanderbol on 19/02/2016.
 */
import React from 'react';
var HeaderComponent = require('../components/header').HeaderComponent;
var globalStyles = require('../styles/styles').styles;
import * as ActionTypes from '../store/actionTypes';

var Dictionaries = require('../models/dictionaries').Dictionaries;
var Shares = require('../models/share').Shares;

import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Platform,
    BackAndroid,
    Alert
    } from 'react-native';

export const ConfigView = React.createClass ({
    getInitialState() {
        return {}
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    },
    componentDidMount() {
        // Listen Android back button
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.backToDictionaryView);
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.backToDictionaryView);
        }
    },
    backToDictionaryView() {
        this.dispatch({
            type: ActionTypes.BACK_TO_DICTIONARY_VIEW_PRESSED
        });
        return true;
    },
    _focusNextField(nextField) {
        this.refs[nextField].focus()
    },
    /* Update database and state */
    updateDictionary(dictionary) {
        this.dispatch({
            type: ActionTypes.DICTIONARY_UPDATED,
            dictionary: dictionary
        });
        Dictionaries.updateDictionary(dictionary).then(
            (dictionary) => {/*
             this.dispatch({
             type: ActionTypes.DICTIONARY_UPDATED,
             dictionary: dictionary
             })*/
            }),
            (error) => {
                alert("Problems with connection to server");
            }
    },
    dictionaryNameChanged({name}) {
        var dictionary = this.state.app.currentDictionary;
        dictionary.set('name', name);
        this.updateDictionary(dictionary);
    },
    learnMoreChanged({url}) {
        var dictionary = this.state.app.currentDictionary;
        dictionary.set('learnMore', url);
        this.updateDictionary(dictionary);
    },
    deleteDictionaryButtonPressed() {
        var isOwner = this.state.user.parseUser.id === this.state.app.currentDictionary.get('createdBy').id;

        if (isOwner) {
            Alert.alert(
                'Are you sure?',
                `Dictionary ${this.state.app.currentDictionary.get('name')} will be deleted`,
                [
                    {text: 'Cancel', onPress: () => { }, style: 'cancel'},
                    {text: 'OK', onPress: () => this.deleteDictionary()}
                ]
            );
        }
        else {
            Alert.alert(
                'Alert',
                `You are not the owner of ${this.state.app.currentDictionary.get('name')}`,
                [
                    {text: 'OK', onPress: () => {}, style: 'cancel'}
                ]
            )
        }
    },
    deleteDictionary() {
        // destroy dictionary itself
        Dictionaries.deleteDictionary(this.state.app.currentDictionary)
            .then((dictionary) => {
                this.dispatch({
                    type: ActionTypes.DELETE_DICTIONARY_REQUEST_SUCCEED,
                    dictionary: dictionary
                });
                return Shares.findShares(dictionary);
            })
            // destroy all shared records related to this dictionary
            .then((shares) => {
                shares.forEach((share) => {
                    share.destroy()
                        .then((share) =>
                            this.dispatch({
                                type: ActionTypes.DELETE_DICTIONARY_REQUEST_SUCCEED,
                                dictionary: share.get('dictionary')
                            })
                        )
                });
            });

        // This will close Config View and move to Home View
        this.dispatch({
            type: ActionTypes.DELETE_DICTIONARY_BUTTON_PRESSED
        });
    },
    render() {
        return (
            <View style={styles.container}>
                <HeaderComponent
                    title="Config"
                    onBackButtonPressed={this.backToDictionaryView}
                />

                {/* Content: Edit Form */}
                <View style={styles.content}>

                    {/* Edit Directory Name */}
                    <TextInput
                        ref='1'
                        style={styles.input}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        value={this.state.app.currentDictionary.get('name')}
                        onChangeText={(name) => this.dictionaryNameChanged({name})}
                        onSubmitEditing={() => this._focusNextField('2')}
                    />

                    {/* First Language not editable */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>
                            1st language
                        </Text>
                        <TextInput
                            style={styles.inputOtherNotEditable}
                            returnKeyType='next'
                            editable={false}
                            blurOnSubmit={false}
                            value = {this.state.app.currentDictionary.get('language1').get('localName')}
                            onChangeText={(text) => this.dictionaryNameChanged({text})}
                        />
                    </View>

                    {/* Second Language not editable */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>
                            2nd language
                        </Text>
                        <TextInput
                            style={styles.inputOtherNotEditable}
                            returnKeyType='next'
                            editable={false}
                            blurOnSubmit={false}
                            value = {this.state.app.currentDictionary.get('language2').get('localName')}
                            onChangeText={(text) => this.dictionaryNameChanged({text})}
                        />
                    </View>

                    {/* Edit Learn More */}
                    <Text style={styles.labelName}>
                        Learn more:
                    </Text>
                    <TextInput
                        style={styles.input}
                        blurOnSubmit={false}
                        value={this.state.app.currentDictionary.get('learnMore')}
                        onChangeText={(url) => this.learnMoreChanged({url})}
                    />
                </View>

                {/* Delete Button */}
                <View style={styles.deleteButton}>
                    <TouchableHighlight
                        onPress={() => this.deleteDictionaryButtonPressed()}>
                        <Text style={styles.description}>
                            Delete dictionary
                        </Text>
                    </TouchableHighlight>
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
    },
    deleteButton: {
        flex:1,
        height: 36,
        padding: 4,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        /*flex: 4,*/
        /*fontSize: 18,*/
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 8,
        position: 'absolute',
        bottom: 50
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
