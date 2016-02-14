/**
 * Created by alexanderbol on 06/02/2016.
 */
var React = require('react-native');
var ContentComponent = require('../components/editContent').EditContentComponent;
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

export const EditView = React.createClass ({
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
        this.setState(state);
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
        });
    },
    render() {
        var state = this.props.store.getState();
        return (
            <View style={{flex:8}}>
                <ContentComponent {... this.props}
                    onLeftSortButtonPressed = {() => this.setSortedBy("leftLanguage")}
                    onRightSortButtonPressed = {() => this.setSortedBy("rightLanguage")}
                    onAddItemPressed = {this.addItem}
                    dictionary = {state.app.currentDictionary}
                    mode = {state.app.mode}
                    items = {Items.prototype.getFiltered(state.items)}
                    editState = {state.editState}
                    learnState = {state.learnState}
                    ajaxState = {state.ajaxState}
                />
            </View>
        );
    }
});
