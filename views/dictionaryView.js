/**
 * Created by alexanderbol on 21/01/2016.
 */
import React from 'react';
var Swiper = require('react-native-swiper');
var Icon = require('react-native-vector-icons/FontAwesome');

var DictionaryHeaderComponent = require('../components/dictionaryHeader').DictionaryHeaderComponent;
// var FooterComponent = require('../components/dictionaryFooter').FooterComponent;
var DictionaryEditorView = require('../views/dictionaryEditorView').DictionaryEditorView;
var LearnView = require('../views/learnView').LearnView;
var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';
import Share from 'react-native-share';

import {
    Animated,
    ActionSheetIOS,
    StyleSheet,
    View,
    Platform,
    BackAndroid,
    Text,
    AsyncStorage
    } from 'react-native';

const LearnButton = () => {
    return (
        <View style={styles.swiperButton}>
            <Icon
                name='hand-o-right'
                size={20}
                color='#81c04d'
            />
        </View>
    );
};
const EditButton = () => {
    return (
        <View style={styles.swiperButton}>
            <Icon
                name='hand-o-left'
                size={20}
                color='#81c04d'
            />
        </View>
    );
};
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

            if (this.state.app.isConnected) {
                this.fetchItems();
            }
            else {
                this.fetchItemsOffline();
            }
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

                let key = "@Palabras:" + itemsParse.className;
                AsyncStorage.setItem(key, JSON.stringify(items))
                    .then((resp) => console.log(resp));


            }
        });
    },
    fetchItemsOffline() {
        let itemsParse = this.state.app.itemsParse;  /* object represent Parse document */
        let key = "@Palabras:" + itemsParse.className;
        AsyncStorage.getItem(key)
            .then( (resp) => {
                var items = [];
                if (resp) {
                    items = JSON.parse(resp).map( (item) => {
                        return Object.assign({}, item, {
                            id: item.objectId,
                            get : function(prop) { return item[prop] }
                        })
                    });
                }
                this.dispatch({
                    type: ActionTypes.FETCH_ITEMS_PAGE_SUCCEED,
                    items: items
                });
                this.dispatch({
                    type: ActionTypes.FETCH_ITEMS_SUCCEED
                });
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
    _onMomentumScrollEnd(e, state, context) {
        // console.log(state, context.state)
        if (state.index == 0) {
            this.setEditMode();
        }
        else {
            this.setLearnMode();
        }
    },
    render() {
        /*
        var viewInstance = this.state.app.mode == 'edit' ? (
            <EditView {... this.props} />
        ) : (
            <LearnView { ... this.props} />
        );
        */
        return (
            <View style={{flex:1, flexDirection:'column'}}>
                <DictionaryHeaderComponent
                    {... this.props}
                    name = {this.state.app.currentDictionary.get('name')}
                    onBackHomeButtonPressed = {this.onBackHomeButtonPressed}
                    onConfigButtonPressed = {this.onConfigButtonPressed}
                    onShareButtonPressed = {this.onShareButtonPressed}
                    isConnected = {this.state.app.isConnected}
                />

                <Swiper
                    showsButtons = {true}
                    nextButton = {<LearnButton />}
                    prevButton = {<EditButton />}
                    loop = {false}
                    onMomentumScrollEnd ={this._onMomentumScrollEnd}
                >
                    <DictionaryEditorView {... this.props} />
                    <LearnView { ... this.props} />
                </Swiper>


            </View>
        );
    }
});

/* {viewInstance} */

/*
 <FooterComponent
 onEditButtonPressed = {this.setEditMode}
 onLearnButtonPressed = {this.setLearnMode}
 />
 */

var styles = StyleSheet.create({
    headerContainer: {
        backgroundColor:'#81c04d',
        paddingTop:30,
        paddingBottom:10,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    swiperButton: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: 'chartreuse',
        borderRadius: 10,
        backgroundColor: 'transparent',
    },
    swiperButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#81c04d',
        /*color: '#ffffff',*/
        transform: [{ rotate: '90deg'}],
    }

});

