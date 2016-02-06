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

export const FooterComponent = React.createClass ({
    render() {
        return (
            <View style={styles.footerContainer}>
                <View style={styles.footerMenuItem}>
                    <TouchableHighlight onPress={this.props.onEditButtonPressed}>
                        <Text style={styles.description}>
                            Edit
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.footerMenuItem}>
                    <TouchableHighlight onPress={this.props.onLearnButtonPressed}>
                        <Text style={styles.description}>
                            Learn
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection:'row',
        /*
        position:'absolute',
        left:0,
        bottom:30,
        */

        backgroundColor: '#81c04d',
        borderTopWidth: 1,
    },
    footerMenuItem: {
        flex: 1,
        /*borderWidth:1,*/
    },
    description: {
        marginTop: 10,
        fontSize: 25,
        fontWeight:'bold',
        textAlign: 'center',
        color: '#fff'
    },
    listView: {
        flex: 1,
        height: 400
    },
    icon: {
        width: 28,
        height: 28,
        marginLeft: 5
    }
});
