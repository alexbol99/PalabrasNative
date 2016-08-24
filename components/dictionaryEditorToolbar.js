/**
 * Created by alexanderbol on 20/08/2016.
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

var Button = ({iconName, onButtonPressed, disabled}) => {

    var iconStyle = disabled ?
        [globalStyles.header.icon, styles.iconButtonDimmed] : [globalStyles.header.icon, styles.iconButtonActive];

    return (
        <TouchableOpacity
            style={{flex:1}}
            activeOpacity={1.0}
            disabled={disabled}
            onPress={onButtonPressed}
        >
            <Icon
                name={iconName}
                size={20}
                color='#81c04d'
                style={iconStyle}
            />
        </TouchableOpacity>
    );
};

export const DictionaryEditorToolbar = React.createClass ({
    getInitialState() {
        return {
        };
    },
    render() {
        return (
            <View style={styles.editToolbar}>
                <Button iconName = 'pencil'
                        onButtonPressed = {this.props.onEditItemButtonPressed}
                        disabled = {this.props.buttonDisabled || !this.props.isConnected}
                />
                <Button iconName = 'volume-up'
                        onButtonPressed = {this.props.onSayItButtonPressed}
                        disabled = {this.props.buttonDisabled}
                />
                <Button iconName = 'globe'
                        onButtonPressed = {this.props.onGoWebButtonPressed}
                        disabled = {this.props.buttonDisabled || !this.props.isConnected}
                />
                <Button iconName = 'trash-o'
                        onButtonPressed = {this.props.onDeleteItemButtonPressed}
                        disabled = {this.props.buttonDisabled || !this.props.isConnected}
                />
            </View>

        );
    }
});

var styles = StyleSheet.create({
    editToolbar: {
        flexDirection: 'row',
        marginVertical: 10
    },
    iconButtonActive: {
        opacity: 1.0
    },
    iconButtonDimmed: {
        opacity: 0.5
    },
});
