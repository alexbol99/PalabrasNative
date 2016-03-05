/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MainComponent = require('./main');

var {
    AppRegistry,
    StyleSheet,
    View,
    Text
    } = React;

class Palabras extends React.Component {
    render() {
        return (
            <View style={{flex:1}}>
                <MainComponent />
            </View>
        );
    }
}
/*
var Palabras = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});
*/


AppRegistry.registerComponent('Palabras', () => Palabras);
