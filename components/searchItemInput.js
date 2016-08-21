/**
 * Created by alexanderbol on 29/07/2016.
 */
import React from 'react';
var globalStyles = require('../styles/styles').styles;
var Icon = require('react-native-vector-icons/FontAwesome');

import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Dimensions
} from 'react-native';

var Button = ({iconName, onButtonPressed}) => {
    return (
        <TouchableOpacity
            activeOpacity={1.0}
            onPress={onButtonPressed}
        >
            <Icon
                name={iconName}
                size={20}
                color='#81c04d'
            />
        </TouchableOpacity>
    );
};

export const SearchItemInput = React.createClass({
    getInitialState() {
        return {
        };
    },
    render()
    {
        var {height, width} = Dimensions.get('window');

        return (
            <View style={[styles.searchPopup, {width: 0.46*width}]}>
                <Button
                    iconName='search'
                    size={16}
                    onButtonPressed = {this.props.onToggleSearchButtonPressed}
                />
                {this.props.searchEnabled ? (
                    <TextInput
                        style={styles.searchPatternInputEnabled}
                        autoCapitalize = 'none'
                        autoCorrect = {false}
                        value={this.props.value}
                        onChangeText={(text) => this.props.onChangeText(text)}
                        onFocus={this.props.onFocus}
                        editable={true}
                    />) : (
                    <TextInput
                        style={styles.searchPatternInputDisabled}
                        editable={false}
                    />
                )
                }
                {/*this.props.value.length != 0 ? (
                    <TouchableOpacity
                        style={this.props.rtl ? styles.iconCleanRTL : styles.iconCleanLTR}
                        activeOpacity={1.0}
                        onPress={this.props.onCleanSearchPatternPressed}
                    >
                        <Icon
                            name='times'
                            size={14}
                            color='#81c04d'
                        />
                    </TouchableOpacity>) : null
                */}
            </View>
        );
    }
});

var styles = StyleSheet.create({
    searchPopup: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    searchPatternInputEnabled: {
        flex: 1,
        height: 34,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#81c04d',
        borderRadius: 4,
        textAlignVertical: 'center',
        padding: 4,
        marginHorizontal: 4,
    },
    searchPatternInputDisabled: {
        flex: 1,
        height: 34,
        /*backgroundColor: 'white',*/
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 4,
        textAlignVertical: 'center',
        padding: 4,
        marginHorizontal: 4,
    },
    iconSearchLTR: {
        position: 'absolute',
        top: 8,
        marginLeft: 4,
        opacity: 0.75,
    },
    iconSearchRTL: {
        position: 'absolute',
        top: 8,
        right: 4,
        marginRight: 4,
        opacity: 0.75,
    },
    iconCleanLTR: {
        position: 'absolute',
        top: 8,
        right: 8,
        marginRight: 4,
    },
    iconCleanRTL: {
        position: 'absolute',
        top: 8,
        marginLeft: 8,
    }
});
