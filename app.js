/**
 * Created by alexanderbol on 09/01/2016.
 */
var React = require('react-native');

var Dictionaries = require('./models/dictionaries').Dictionaries.prototype;
var Items = require('./models/items').Items;

import * as ActionTypes from './store/actionTypes';
var LoginView = require('./views/loginView').LoginView;
var HomeView = require('./views/homeView').HomeView;
var DictionaryView = require('./views/dictionaryView').DictionaryView;
var ConfigView = require('./views/configView').ConfigView;

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
        this.setState(this.props.store.getState());
    },
    componentDidMount() {
        this.fetchData();
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
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
    render() {
        var page;
        switch (this.state.app.navigateTo) {
            case "loginView":
                page = (
                    <LoginView {... this.props} />
                );
                break;
            case "homeView":
                page = (
                    <HomeView {... this.props} />
                );
                break;
            case "dictionaryView":
                page = (
                    <DictionaryView {... this.props} />
                );
                break;
            case "configView":
                page = (
                    <ConfigView {...this.props} />
                );
                break;
            default:
                page = (
                    <HomeView {... this.props} />
                );
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
