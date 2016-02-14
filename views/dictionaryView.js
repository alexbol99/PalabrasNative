/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');

var HeaderComponent = require('../components/header').HeaderComponent;
var FooterComponent = require('../components/footer').FooterComponent;
var EditView = require('../views/editView').EditView;
var LearnView = require('../views/learnView').LearnView;
var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';

var {
    StyleSheet,
    View
    } = React;

export const DictionaryView = React.createClass ({
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
        var {leftItems, rightItems} =
            Items.prototype.getLearnItems(this.state.items, this.state.learnState.maxNumLearnItems);

        this.dispatch({
            type: ActionTypes.SET_LEARN_MODE,
            leftItems: leftItems,
            rightItems: rightItems
        });
    },
    render() {
        var state = this.props.store.getState();

        var viewInstance = this.props.mode == 'edit' ? (
            <EditView {... this.props} />
        ) : (
            <LearnView { ... this.props} />
        );
        return (
            <View style={{flex:1, flexDirection:'column'}}>
                <HeaderComponent
                    {... this.props}
                    onBackHomePressed = {this.backHome}
                    dictionary = {state.app.currentDictionary}
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

