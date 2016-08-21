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

export const SearchItemInput = React.createClass({
    getInitialState() {
        return {
        };
    },
    render()
    {
        var {height, width} = Dimensions.get('window');

        return (
            <View style={[styles.searchPopup, {width: 0.49*width}]}>
                <TextInput
                    style={styles.searchPatternInput}
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    autoFocus = {true}
                    value={this.props.value}
                    onChangeText={(text) => this.props.onChangeText(text)}
                    onFocus={this.props.onFocus}
                />
                {this.props.value.length == 0 ? (
                    <Icon
                        name='search'
                        size={14}
                        color='#81c04d'
                        style={styles.icon}
                    />) : null
                }
                {this.props.value.length != 0 ? (
                    <TouchableOpacity
                        style={styles.iconClean}
                        activeOpacity={1.0}
                        onPress={this.props.onCleanSearchPatternPressed}
                    >
                        <Icon
                            name='times'
                            size={14}
                            color='#81c04d'
                        />
                    </TouchableOpacity>) : null
                }
            </View>
        );
    }
});

var styles = StyleSheet.create({
    searchPopup: {
        justifyContent: 'center',
    },
    searchPatternInput: {
        flex: 1,
        height: 34,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#81c04d',
        borderRadius: 4,
        textAlignVertical: 'center',
        padding: 4,
    },
    icon: {
        position: 'absolute',
        top: 8,
        marginLeft: 4,
        opacity: 0.75,
    },
    iconClean: {
        position: 'absolute',
        top: 8,
        right: 4,
        marginRight: 4,
    }
});
