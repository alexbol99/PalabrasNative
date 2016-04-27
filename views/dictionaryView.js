/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');

var DictionaryHeaderComponent = require('../components/dictionaryHeader').DictionaryHeaderComponent;
var FooterComponent = require('../components/footer').FooterComponent;
var EditView = require('../views/editView').EditView;
var LearnView = require('../views/learnView').LearnView;
var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';
import Share from 'react-native-share';

var {
    ActionSheetIOS,
    StyleSheet,
    View,
    Platform
    } = React;

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
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    onBackHomeButtonPressed() {
        this.dispatch({
            type: ActionTypes.BACK_HOME_BUTTON_PRESSED
        })
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
                share_URL: `https://dl.dropboxusercontent.com/u/79667427/palabras3_dist/index.html#quiz/${this.state.app.currentDictionary.id}`,
                title: "Word In My Pocket"
            },(e) => {
                console.log(e);
            });
        }
        else {
            ActionSheetIOS.showShareActionSheetWithOptions({
                    url: `https://dl.dropboxusercontent.com/u/79667427/palabras3_dist/index.html#quiz/${this.state.app.currentDictionary.id}`,
                    message: `Learn new words from ${this.state.app.currentDictionary.get('name')}`,
                    subject: 'Word In My Pocket',
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
        flexDirection: 'row'
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

