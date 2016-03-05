/**
 * Created by alexanderbol on 28/02/2016.
 */
var React = require('react-native');
var HeaderComponent = require('../components/header').HeaderComponent;
var globalStyles = require('../styles/styles').styles;
import * as ActionTypes from '../store/actionTypes';

var Dictionaries = require('../models/dictionaries').Dictionaries.prototype;

var {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Picker
    } = React;

// var Item = PickerIOS.Item;

export const AddNewDictionaryView = React.createClass ({
    getInitialState() {
        return {
        }
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    backToDictionaryView() {
        this.dispatch({
            type: ActionTypes.BACK_HOME_BUTTON_PRESSED
        })
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
    toggleLanguage1Picker() {
        this.dispatch({
            type: ActionTypes.TOGGLE_LANGUAGE1_PICKER_PRESSED
        })
    },
    toggleLanguage2Picker() {
        this.dispatch({
            type: ActionTypes.TOGGLE_LANGUAGE2_PICKER_PRESSED
        })
    },
    language1Selected({name}) {
        var dictionary = this.state.app.currentDictionary;
        var language = this.state.languages.find( (language_tmp) => (language_tmp.get('name') == name) );
        dictionary.set('language1', language);
        this.updateDictionary(dictionary);
        this.toggleLanguage1Picker();
    },
    language2Selected({name}) {
        var dictionary = this.state.app.currentDictionary;
        var language = this.state.languages.find( (language_tmp) => (language_tmp.get('name') == name) );
        dictionary.set('language2', language);
        this.updateDictionary(dictionary);
        this.toggleLanguage2Picker();
    },
    render() {
        return (
            <View style={styles.container}>
                <HeaderComponent
                    title="Edit New Disctionary"
                    onBackButtonPressed={this.backToDictionaryView}
                />

                {/* Content: Edit Form */}
                <View style={styles.content}>

                    {/* Edit Directory Name */}
                    <Text style={styles.labelName}>
                        Name:
                    </Text>
                    <TextInput
                        style={styles.input}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        value={this.state.app.currentDictionary.get('name')}
                        onChangeText={(name) => this.dictionaryNameChanged({name})}
                    />

                    {/* Select First Language */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>
                            1st Language:
                        </Text>
                        <TouchableHighlight style={{flex:1}}
                            onPress={() => this.toggleLanguage1Picker()}>
                            <TextInput
                                style={styles.input}
                                returnKeyType='next'
                                editable={false}
                                blurOnSubmit={false}
                                value={this.state.app.currentDictionary.get('language1').get('name')}
                            />
                        </TouchableHighlight>
                    </View>

                    {this.state.app.displayLangage1Picker ? (
                        <Picker
                            selectedValue={this.state.app.currentDictionary.get('language1').get('name')}
                            onValueChange={(name) => this.language1Selected({name})} >
                            {
                                this.state.languages.map( (language) =>
                                    <Picker.Item key= {language.id}
                                                 label={language.get('localName')}
                                                 value={language.get('name')} />
                                )
                            }
                        </Picker>
                    ) : null}

                    {/* Select Second Language */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>
                            2nd Language:
                        </Text>

                        <TouchableHighlight style={{flex:1}}
                            onPress={() => this.toggleLanguage2Picker()}>
                            <TextInput
                                style={styles.input}
                                returnKeyType='next'
                                editable={false}
                                blurOnSubmit={false}
                                value={this.state.app.currentDictionary.get('language2').get('name')}
                            />
                        </TouchableHighlight>
                    </View>

                    {this.state.app.displayLangage2Picker ? (
                        <Picker
                            selectedValue={this.state.app.currentDictionary.get('language2').get('name')}
                            onValueChange={(name) => this.language2Selected({name})} >
                            {
                                this.state.languages.map( (language) =>
                                    <Picker.Item key= {language.id}
                                                    label={language.get('localName')}
                                                    value={language.get('name')} />
                                )
                            }
                        </Picker>
                    ): null}

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
