/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MainComponent = require('./main');

var {
    AppRegistry,
    View,
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
          Welcome to My Pocket Dictionary!
        </Text>
        <Text style={styles.instructions}>
          To get started change something
        </Text>
        <Text style={styles.instructions}>
          Shake shake shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
*/
debugger;
AppRegistry.registerComponent('Palabras', () => Palabras);
