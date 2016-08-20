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

var Button = ({iconName, iconStyle, onButtonPressed, disabled}) => {
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
        var iconStyle = this.props.buttonDisabled ?
            [globalStyles.header.icon, styles.iconButtonDimmed] : [globalStyles.header.icon, styles.iconButtonActive];

        return (
            <View style={styles.editToolbar}>
                <Button iconName = 'pencil'
                        iconStyle = {iconStyle}
                        onButtonPressed = {this.props.onEditItemButtonPressed}
                        disabled = {this.props.buttonDisabled}
                />
                <Button iconName = 'volume-up'
                        iconStyle = {iconStyle}
                        onButtonPressed = {this.props.onSayItButtonPressed}
                        disabled = {this.props.buttonDisabled}
                />
                <Button iconName = 'globe'
                        iconStyle = {iconStyle}
                        onButtonPressed = {this.props.onGoWebButtonPressed}
                        disabled = {this.props.buttonDisabled}
                />
                <Button iconName = 'trash-o'
                        iconStyle = {iconStyle}
                        onButtonPressed = {this.props.onDeleteItemButtonPressed}
                        disabled = {this.props.buttonDisabled}
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
