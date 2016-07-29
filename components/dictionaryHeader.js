/**
 * Created by alexanderbol on 30/01/2016.
 */
import React from 'react';
var globalStyles = require('../styles/styles').styles;
import * as ActionTypes from '../store/actionTypes';

import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity
    } from 'react-native';

// use http://fortawesome.github.io/Font-Awesome/icons/
var Icon = require('react-native-vector-icons/FontAwesome');

var Button = ({iconName, onButtonPressed}) => {
    return (
        <TouchableOpacity onPress={onButtonPressed} activeOpacity={1.0}>
            <Icon
                name={iconName}
                size={20}
                color={globalStyles.header.color}
                style={styles.icon}
            />
        </TouchableOpacity>
    );
};

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
    render() {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={this.props.onBackHomeButtonPressed} activeOpacity={1.0}>
                    <Icon
                        name='long-arrow-left'
                        size={20}
                        color={globalStyles.header.color}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                <Text style={styles.dictionaryTitle}>
                    {this.props.dictionary.get('name') + ' (' + this.state.items.length + ')'}
                </Text>

                <Button iconName = 'cog'
                        onButtonPressed = {this.props.onConfigButtonPressed}
                />

                <TouchableOpacity onPress={this.props.onShareButtonPressed} activeOpacity={1.0}>
                    <Icon
                        name='share-alt'
                        size={20}
                        color={globalStyles.header.color}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    headerContainer: {
        backgroundColor:globalStyles.header.backgroundColor,
        paddingTop:10,
        paddingBottom:10,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dictionaryTitle: globalStyles.header.title,
    icon: globalStyles.header.icon
});
