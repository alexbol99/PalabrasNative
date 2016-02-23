/**
 * Created by alexanderbol on 19/02/2016.
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

var BackButton = ({onButtonPressed}) => {
    return (
        <TouchableHighlight onPress={onButtonPressed}>
            <Icon
                name='fontawesome|long-arrow-left'
                size={20}
                color={globalStyles.header.color}
                style={styles.icon}
            />
        </TouchableHighlight>
    );
};
var Title = ({title}) => {
    return <Text style={styles.title}> {title} </Text>
};

export const HeaderComponent = React.createClass ({
    render() {
        return (
            <View style={styles.headerContainer}>
                <BackButton onButtonPressed={this.props.onBackButtonPressed} />
                <Title title={this.props.title} />
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
    title: globalStyles.header.title,
    icon: globalStyles.header.icon
});
