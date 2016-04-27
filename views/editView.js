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
var Icon = require('react-native-vector-icons/FontAwesome');

export const EditView = React.createClass ({
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
    addItem() {
        Items.prototype.addEmptyItem(this.state).then( (item) => {
            this.dispatch({
                type: ActionTypes.ADD_NEW_ITEM_REQUEST_SUCCEED,
                item: item
            });
        });
    },
    setSortedBy(sortedBy) {
        this.dispatch({
            type: ActionTypes.BUTTON_SORTED_BY_PRESSED,
            sortedBy: sortedBy
        });
    },
    render() {
        return (
            <View style={{flex:8}}>
                <ContentComponent {... this.props}
                    onLeftSortButtonPressed = {() => this.setSortedBy("leftLanguage")}
                    onRightSortButtonPressed = {() => this.setSortedBy("rightLanguage")}
                    onAddItemPressed = {this.addItem}
                    dictionary = {this.state.app.currentDictionary}
                    mode = {this.state.app.mode}
                    items = {Items.prototype.getFiltered(this.state.items)}
                    editState = {this.state.editState}
                    learnState = {this.state.learnState}
                    ajaxState = {this.state.ajaxState}
                />
            </View>
        );
    }
});
