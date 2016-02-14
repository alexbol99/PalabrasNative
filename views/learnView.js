/**
 * Created by alexanderbol on 06/02/2016.
 */
var React = require('react-native');
var ContentComponent = require('../components/learnContent').LearnContentComponent;

var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';

var {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight
    } = React;

// use http://fortawesome.github.io/Font-Awesome/icons/
var { Icon,
    } = require('react-native-icons');

export const LearnView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
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
    setEditMode() {
        this.dispatch({
            type: ActionTypes.SET_EDIT_MODE
        })
    },
    setLearnMode() {
        var {leftItems, rightItems} =
            Items.prototype.getLearnItems(this.state.items, this.state.learnState.maxNumLearnItems);

        this.dispatch({
            type: ActionTypes.SET_LEARN_MODE,
            leftItems: leftItems,
            rightItems: rightItems
        });
    },
    refreshLearnItems() {
        var {leftItems, rightItems} =
            Items.prototype.getLearnItems(this.state.items, this.state.learnState.maxNumLearnItems);

        this.dispatch({
            type: ActionTypes.REFRESH_LEARN_ITEMS,
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
        if (this.state.learnState.selectedLeftItemId == undefined || this.state.learnState.selectedRightItemId == undefined)
            return;

        if (this.state.learnState.selectedLeftItemId == this.state.learnState.selectedRightItemId) {
            var id = this.state.learnState.selectedLeftItemId;
            var leftInd = this.state.learnState.leftItems.findIndex( (item) => (item.id == id) );
            var rightInd = this.state.learnState.rightItems.findIndex( (item) => (item.id == id) );

            if (leftInd == undefined || rightInd == undefined)
                return;

            var itemLeft = this.state.learnState.leftItems[leftInd];
            var itemRight = this.state.learnState.rightItems[rightInd];
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
                    onEditButtonPressed = {this.setEditMode}
                    onLearnButtonPressed = {this.setLearnMode}
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
