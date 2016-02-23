/**
 * Created by alexanderbol on 19/02/2016.
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
    TextInput
    } = React;

export const ConfigView = React.createClass ({
    getInitialState() {
        return {}
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
            type: ActionTypes.BACK_TO_DICTIONARY_VIEW_PRESSED
        })
    },
    _focusNextField(nextField) {
        this.refs[nextField].focus()
    },
    dictionaryNameChanged({name}) {
        var dictionary = this.state.app.currentDictionary;
        Dictionaries.updateName(dictionary, name).then(
            (dictionary) => {
                var index = this.state.dictionaries.findIndex( (dictionary_tmp) => (dictionary_tmp.id == dictionary.id) );
                this.dispatch({
                    type: ActionTypes.DICTIONARY_NAME_UPDATED,
                    dictionary: dictionary,
                    index: index
                })
            }),
            (error) => {
                alert("Problems with connection to server");
            }


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
        color: '#656565'
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
