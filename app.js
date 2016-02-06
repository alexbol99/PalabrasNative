/**
 * Created by alexanderbol on 09/01/2016.
 */
var React = require('react-native');

var Dictionaries = require('./models/dictionaries').Dictionaries.prototype;
var Items = require('./models/items').Items;

import * as ActionTypes from './store/actionTypes';
var HomeView = require('./views/homeView').HomeView;
var DictionaryView = require('./views/dictionaryView').DictionaryView;

var {
    Text,
    StyleSheet,
    View,
    Component,
    } = React;

var App = React.createClass ({
    getInitialState() {
        return {
        }
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
    },
    componentDidMount() {
        this.fetchData();
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState())
    },
    fetchData() {
        Dictionaries.fetch().then(
            (dictionaries) => {
                this.dispatch({
                    type: ActionTypes.FETCH_DICTIONARIES_REQUEST_SUCCEED,
                    dictionaries: dictionaries
                });
                this.dispatch({
                    type:ActionTypes.AJAX_REQUEST_RESET
                })
            },
            (error) => {
                this.dispatch({
                    type: ActionTypes.AJAX_REQUEST_FAILED
                });
            }
        );
        this.dispatch({
            type: ActionTypes.AJAX_REQUEST_STARTED
        })
    },
    dictionarySelected(dictionary) {
        this.dispatch({
            type: ActionTypes.DICTIONARY_SELECTED,
            dictionary: dictionary
        });
        this.createItems(dictionary);
    },
    createItems(dictionary) {
        var pref = '';
        if (dictionary.id.charAt(0) >= '0' && dictionary.id.charAt(0) <= '9') {
            pref = 'a';
        }
        var itemsClassName = pref + dictionary.id;
        var items = new Items(itemsClassName);
        items.fetch().then( (items) => {
                this.dispatch({
                    type: ActionTypes.FETCH_ITEMS_SUCCEED,
                    items: items
                })
            });
    },
    backHome() {
        this.dispatch({
            type: ActionTypes.BACK_HOME
        })
    },
    setEditMode() {
        this.dispatch({
            type: ActionTypes.SET_EDIT_MODE
        })
    },
    setLearnMode() {
        this.dispatch({
            type: ActionTypes.SET_LEARN_MODE
        })
    },
    addItem() {
        var state = this.props.store.getState();
        Items.prototype.addEmptyItem(state).then( (item) => {
            this.dispatch({
                type: ActionTypes.ADD_NEW_ITEM_REQUEST_SUCCEED,
                item: item
            });
        });
    },
    setSortedBy(sortedBy) {
        this.dispatch({
            type: ActionTypes.SET_SORTED_BY,
            sortedBy: sortedBy
        })
    },
    render() {
        var state = this.props.store.getState();
        var page;
        switch (state.app.navigateTo) {
            case "homeView":
                page = (
                    <HomeView
                        dictionaries = {state.dictionaries}
                        dictionarySelected = {this.dictionarySelected}
                        ajaxState = {state.ajaxState}
                    />
                );
                break;
            case "dictionaryView":
                page = (
                    <DictionaryView
                        onBackHomePressed = {this.backHome}
                        onEditButtonPressed = {this.setEditMode}
                        onLearnButtonPressed = {this.setLearnMode}
                        onLeftSortButtonPressed = {() => this.setSortedBy("leftLanguage")}
                        onRightSortButtonPressed = {() => this.setSortedBy("rightLanguage")}
                        onAddItemPressed = {this.addItem}
                        dictionary = {state.app.currentDictionary}
                        mode = {state.app.mode}
                        editItems = {Items.prototype.getFiltered(state.items)}
                        learnItems = {Items.prototype.getRandom(state.items,state.learnState.maxNumLearnItems)}
                        editState = {state.editState}
                        learnState = {state.learnState}
                        ajaxState = {state.ajaxState}
                    />
                );
                break;
            default:
                break;
        }

        return (
            <View style={{flex:1}}>
                {page}
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        /*flex: 1,*/
        backgroundColor: '#F5FCFF'
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
 searchInput: {
 height: 36,
 padding: 4,
 marginRight: 5,
 flex: 4,
 fontSize: 18,
 borderWidth: 1,
 borderColor: '#48BBEC',
 borderRadius: 8,
 color: '#48BBEC'
 }
 });
 */

module.exports = App;
