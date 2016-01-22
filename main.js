/**
 * Created by alexanderbol on 08/01/2016.
 */
var React = require('react-native');
var Redux = require('redux');
// var ReactRedux = require('react-redux');
var Parse = require('parse').Parse;

var Reducer = require('./store/reducer');
var App = require('./app');

const store = Redux.createStore(Reducer.reducer);

var {
    StyleSheet,
    Component,
    } = React;

class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        store.subscribe(() => {
            this.setState(store.getState());
        });
    }

    render() {
        return (
            <App store={store}
            />
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    description: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        color: '#656565'
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

module.exports = MainComponent;
