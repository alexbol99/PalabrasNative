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
        this.setState(this.props.store.getState());
    },
    componentDidMount() {
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
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

