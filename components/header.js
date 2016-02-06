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
                        name='fontawesome|long-arrow-left'
                        size={20}
                        color='#fff'
                        style={styles.icon}
                    />
                </TouchableHighlight>

                <Text style={styles.dictionaryTitle}>
                    {this.props.dictionary.get('name')}
                </Text>

                <TouchableHighlight onPress={this.props.onBackHomePressed}>
                    <Icon
                        name='fontawesome|share-alt'
                        size={20}
                        color='#fff'
                        style={styles.icon}
                    />
                </TouchableHighlight>

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
        flex: 4,
        fontSize: 20,
        color: '#fff',
        backgroundColor:'lemon',
        textAlign:'center'
    },
    icon: {
        flex: 1,
        width: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 10
    }
});
