/**
 * Created by alexanderbol on 21/01/2016.
 */
import React from 'react';

var DictionaryHeaderComponent = require('../components/dictionaryHeader').DictionaryHeaderComponent;
var FooterComponent = require('../components/dictionaryFooter').FooterComponent;
var EditView = require('../views/editView').EditView;
var LearnView = require('../views/learnView').LearnView;
var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';
import Share from 'react-native-share';

import {
    ActionSheetIOS,
    StyleSheet,
    View,
    Platform,
    BackAndroid
    } from 'react-native';

export const DictionaryView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    },
    componentDidMount() {
        // Listen Android back button
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackHomeButtonPressed);
        }
        /* Start fetch items */
        if (this.state.app.needFetchItems) {
            this.dispatch({
                type: ActionTypes.FETCH_ITEMS_STARTED
            });
            this.fetchItems();
        }
    },
    componentWillReceiveProps(nextProps) {
        var state = nextProps.store.getState();
        if (state.app.fetchItemsStarted && state.app.numItemsToSkip != this.state.app.numItemsToSkip ) {
            this.fetchItems(state.app.numItemsToSkip);
        }
        this.setState(nextProps.store.getState());
    },
    componentReceivedProps() {
    },
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackHomeButtonPressed);
        }
    },
    fetchItems(num) {
        var numInPage = this.state.app.numItemsInPage;
        var numToSkip = num || this.state.app.numItemsToSkip;
        var itemsParse = this.state.app.itemsParse;  /* object represent Parse document */
        if (!itemsParse) return;
        itemsParse.fetchPage(numInPage, numToSkip).then( (items) => {
            if (items.length == 0) {    /* finished */
                this.dispatch({
                    type: ActionTypes.FETCH_ITEMS_SUCCEED
                });
            }
            else {
                this.dispatch({
                    type: ActionTypes.FETCH_ITEMS_PAGE_SUCCEED,
                    items: items
                });
            }
        });
    },
    onBackHomeButtonPressed() {
        this.dispatch({
            type: ActionTypes.BACK_HOME_BUTTON_PRESSED
        });
        return true;
    },
    onConfigButtonPressed() {
        this.dispatch({
            type: ActionTypes.CONFIG_BUTTON_PRESSED
        })
    },
    onShareButtonPressed() {
        /* on Android use https://github.com/EstebanFuentealba/react-native-share ? */
        if (Platform.OS === 'android') {
            Share.open({
                share_text: `Learn new words from ${this.state.app.currentDictionary.get('name')}`,
                share_URL: `https://dl.dropboxusercontent.com/u/79667427/palabras_redirect.html#quiz/${this.state.app.currentDictionary.id}`,
                title: "Palabras"
            },(e) => {
                console.log(e);
            });
        }
        else {
            ActionSheetIOS.showShareActionSheetWithOptions({
                    url: `https://dl.dropboxusercontent.com/u/79667427/palabras_redirect.html#quiz/${this.state.app.currentDictionary.id}`,
                    message: `Learn new words from ${this.state.app.currentDictionary.get('name')}`,
                    subject: 'Palabras',
                    excludedActivityTypes: [
                        'com.apple.UIKit.activity.PostToTwitter',
                        'com.apple.UIKit.activity.UIActivityTypeCopyToPasteboard',
                        'com.apple.UIKit.activity.UIActivityTypeAddToReadingList'
                    ]
                },
                (error) => {
                    console.error(error);
                },
                (success, method) => {
                    var text;
                    if (success) {
                        text = `Shared via ${method}`;
                    } else {
                        text = 'You didn\'t share';
                    }
                    console.log(text);
                });
        }
        /*
        this.dispatch({
            type:ActionTypes.SHARE_DICTIONARY_BUTTON_PRESSED
        })*/
    },
    setEditMode() {
        this.dispatch({
            type: ActionTypes.EDIT_MODE_BUTTON_PRESSED
        })
    },
    setLearnMode() {
        var {leftItems, rightItems} =
            Items.prototype.getLearnItems(this.state.items, this.state.learnState.maxNumLearnItems);

        this.dispatch({
            type: ActionTypes.LEARN_MODE_BUTTON_PRESSED,
            leftItems: leftItems,
            rightItems: rightItems
        });
    },
    render() {
        var viewInstance = this.state.app.mode == 'edit' ? (
            <EditView {... this.props} />
        ) : (
            <LearnView { ... this.props} />
        );
        return (
            <View style={{flex:1, flexDirection:'column'}}>
                <DictionaryHeaderComponent
                    {... this.props}
                    dictionary = {this.state.app.currentDictionary}
                    onBackHomeButtonPressed = {this.onBackHomeButtonPressed}
                    onConfigButtonPressed = {this.onConfigButtonPressed}
                    onShareButtonPressed = {this.onShareButtonPressed}
                />

                {viewInstance}

                <FooterComponent
                    onEditButtonPressed = {this.setEditMode}
                    onLearnButtonPressed = {this.setLearnMode}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    headerContainer: {
        backgroundColor:'#81c04d',
        paddingTop:30,
        paddingBottom:10,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    footerContainer: {
        flex: 1,
        flexDirection:'row',
        /*
         position:'absolute',
         left:0,
         bottom:30,
         */

        backgroundColor: '#81c04d',
        borderTopWidth: 1
    }

});

