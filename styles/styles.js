/**
 * Created by alexanderbol on 19/02/2016.
 */
var React = require('react-native');

var { StyleSheet } = React;


export const styles = {
    container: {
        backgroundColor: '#F5FCFF',
    },
    content: {
        backgroundColor: '#F5FCFF',
    },
    header: {
        backgroundColor:'#81c04d',
        color: 'fff',
        title: {
            flex: 5,
            fontSize: 20,
            color: 'fff',
            textAlign:'center'
        },
        icon: {
            flex: 1,
            width: 20,
            height: 20,
            marginLeft: 10,
            marginRight: 10,
            color: 'fff'
        }
    },
    footer: {
        backgroundColor:'#81c04d',
        color:'fff'
    },
    item: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'honeydew',
        marginVertical: 5,
    }

    };