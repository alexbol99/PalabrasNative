/**
 * Created by alexanderbol on 30/01/2016.
 */
var React = require('react-native');
var globalStyles = require('../styles/styles').styles;
import * as ActionTypes from '../store/actionTypes';

var {
    Text,
    StyleSheet,
    View,
    TouchableHighlight
    } = React;

// use http://fortawesome.github.io/Font-Awesome/icons/
var { Icon,
    } = require('react-native-icons');

export const DictionaryHeaderComponent = React.createClass ({
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
    onBackHomePressed() {
        this.dispatch({
            type: ActionTypes.BACK_HOME_BUTTON_PRESSED
        })
    },
    onConfigButtonPressed() {
        this.dispatch({
            type: ActionTypes.CONFIG_BUTTON_PRESSED
        })
    },
    render() {
        return (
            <View style={styles.headerContainer}>
                <TouchableHighlight onPress={this.onBackHomePressed}>
                    <Icon
                        name='fontawesome|long-arrow-left'
                        size={20}
                        color={globalStyles.header.color}
                        style={styles.icon}
                    />
                </TouchableHighlight>

                <Text style={styles.dictionaryTitle}>
                    {this.props.dictionary.get('name')}
                </Text>

                <TouchableHighlight onPress={this.onConfigButtonPressed}>
                    <Icon
                        name='fontawesome|cog'
                        size={20}
                        color={globalStyles.header.color}
                        style={styles.icon}
                    />
                </TouchableHighlight>

                <TouchableHighlight onPress={this.props.onBackHomePressed}>
                    <Icon
                        name='fontawesome|share-alt'
                        size={20}
                        color={globalStyles.header.color}
                        style={styles.icon}
                    />
                </TouchableHighlight>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    headerContainer: {
        backgroundColor:globalStyles.header.backgroundColor,
        paddingTop:30,
        paddingBottom:10,
        marginTop: 0,
        flexDirection: 'row'
    },
    dictionaryTitle: globalStyles.header.title,
    icon: globalStyles.header.icon
});
