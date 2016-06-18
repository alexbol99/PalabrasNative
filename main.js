/**
 * Created by alexanderbol on 08/01/2016.
 */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
var Redux = require('redux');

var Reducer = require('./store/reducer');
var App = require('./app');

const store = Redux.createStore(Reducer.reducer);

var MainComponent = React.createClass ({
    componentWillMount() {
        this.state = store.getState();
        store.subscribe(() => {
            this.setState(store.getState());
        });
    },

    render() {
        return (
            <App store={store} />
        );
    }
});

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

module.exports = MainComponent;
