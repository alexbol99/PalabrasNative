/**
 * Created by alexanderbol on 30/01/2016.
 */
var React = require('react-native');

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

export const HeaderComponent = React.createClass ({
    render() {
        return (
            <View style={styles.headerContainer}>
                <TouchableHighlight onPress={this.props.onBackHomePressed}>
                    <Icon
                        name='fontawesome|arrow-circle-o-left'
                        size={30}
                        color='#fff'
                        style={styles.icon}
                    />
                </TouchableHighlight>

                <Text style={styles.dictionaryTitle}>
                    {this.props.currentDictionary.get('name')}
                </Text>
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
    dictionaryTitle: {
        fontSize: 20,
        color: '#fff',
        backgroundColor:'lemon',
        textAlign:'center',
        flex: 1
    },
    icon: {
        width: 28,
        height: 28,
        marginLeft: 5
    }
});
