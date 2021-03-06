/**
 * Created by alexanderbol on 20/08/2016.
 */
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

var Button = ({iconName, iconStyle, onButtonPressed}) => {
    return (
        <TouchableOpacity
            activeOpacity={1.0}
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

export const DictionaryEditorLanguageBar = React.createClass ({
    getInitialState() {
        return {
        };
    },
    render() {

        return (
            <View style={styles.sortToolbarContainer}>

                {/* Left language name title */}
                <TouchableOpacity
                    style={styles.languageTitleAndSort}
                    activeOpacity={1.0}
                    onPress = {this.props.onLeftSortButtonPressed}
                >
                    <Text style={styles.languageTitle}>
                        {this.props.langLeft}
                    </Text>

                    {/* Left Sort button */}
                    <Button
                        iconName = 'sort-desc'
                        iconStyle = {this.props.iconSortStyleLeft}
                        onButtonPressed = {this.props.onLeftSortButtonPressed}
                    />
                </TouchableOpacity>

                {/* Button exchange */}
                <Button
                    iconName = 'exchange'
                    iconStyle = {{marginLeft:5, marginRight:5}}
                    onButtonPressed = {this.props.onSwitchLanguagePanelsPressed}
                />

                {/* Right language name title */}
                <TouchableOpacity
                    style={styles.languageTitleAndSort}
                    activeOpacity={1.0}
                    onPress = {this.props.onRightSortButtonPressed}
                >
                    <Text style={styles.languageTitle}>
                        {this.props.langRight}
                    </Text>

                    {/* Right Sort button */}
                    <Button
                        iconName = 'sort-desc'
                        iconStyle = {this.props.iconSortStyleRight}
                        onButtonPressed = {this.props.onRightSortButtonPressed}
                    />
                </TouchableOpacity>

            </View>

        );
    }
});

var styles = StyleSheet.create({
    sortToolbarContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        /*justifyContent: 'space-between',*/
        alignItems: 'center',
        /*borderWidth: 1,
         borderColor: '#81c04d'*/
    },
    languageTitleAndSort: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageTitle: {
        marginLeft:5,
        paddingRight:10,
        marginVertical: 5,
        /*textAlign:'left',*/
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    iconSortActive: {
        width:30,
        height: 30,
        opacity: 1.0
    },
    iconSortDimmed: {
        width:30,
        height: 30,
        opacity: 0.5
    },
});
