/**
 * Created by alexanderbol on 06/02/2016.
 */
import React from 'react';
var ContentComponent = require('../components/learnContent').LearnContentComponent;

var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';

import {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight
    } from 'react-native';

// use http://fortawesome.github.io/Font-Awesome/icons/
var Icon = require('react-native-vector-icons/FontAwesome');

export const LearnView = React.createClass ({
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
        var state = nextProps.store.getState();

        if (state.learnState.itemsToBeRefreshed) {
            this.refreshLearnItems();
        }

        this.setState(state);
    },
    refreshLearnItems() {
        var {leftItems, rightItems} =
            Items.prototype.getLearnItems(this.state.items, this.state.learnState.maxNumLearnItems);

        this.dispatch({
            type: ActionTypes.LEARN_ITEMS_REFRESHED,
            leftItems: leftItems,
            rightItems: rightItems
        });
    },
    toggleLeftItemSelected(id) {
        this.dispatch({
            type: ActionTypes.LEFT_ITEM_CLICKED,
            id: id
        });
        this.checkMatch();
    },
    toggleRightItemSelected(id) {
        this.dispatch({
            type: ActionTypes.RIGHT_ITEM_CLICKED,
            id: id
        });
        this.checkMatch();
    },
    checkMatch: function() {
        let learnState = this.props.store.getState().learnState;  // this.state not up-to-date yet
        if (learnState.selectedLeftItemId == undefined || learnState.selectedRightItemId == undefined)
            return;

        if (learnState.selectedLeftItemId == learnState.selectedRightItemId) {
            var id = learnState.selectedLeftItemId;
            var leftInd = learnState.leftItems.findIndex( (item) => (item.id == id) );
            var rightInd = learnState.rightItems.findIndex( (item) => (item.id == id) );

            if (leftInd == undefined || rightInd == undefined)
                return;

            var itemLeft = learnState.leftItems[leftInd];
            var itemRight = learnState.rightItems[rightInd];
            /*
             if (this.state.sound == "on") {
             var language = this.state.languageOnLeft;
             itemLeft.sayIt(this.state.languageOnLeft, this.state.languageOnRight);           // "spanish");
             }
             */
            this.dispatch({
                type: ActionTypes.ITEMS_MATCHED,
                leftInd: leftInd,
                rightInd: rightInd
            });
        }
    },
    render() {
        var state = this.props.store.getState();
        return (
            <View style={{flex:8}}>
                <ContentComponent {... this.props}
                    onLeftItemSelected = {this.toggleLeftItemSelected}
                    onRightItemSelected = {this.toggleRightItemSelected}
                    dictionary = {state.app.currentDictionary}
                    learnState = {state.learnState}
                    leftItems = {state.learnState.leftItems}
                    rightItems = {state.learnState.rightItems}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
});

