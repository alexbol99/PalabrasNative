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
} from 'react-native';

export const SearchItemPopup = React.createClass({
    getInitialState() {
        return {
            value: ""
        };
    },
    onChange({text}) {
        this.setState({
            value: text
        });
        this.props.onChangeText(text);
    },
    cleanText() {
        this.setState({
            value: ''
        })

    },
    render()
    {
        return (
            <View style={[this.props.viewStyle, styles.searchPopup]}>
                <TextInput
                    style={styles.searchPatternInput}
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    autoFocus = {true}
                    value={this.state.value}
                    onChangeText={(text) => this.onChange({text})}
                />
                {this.state.value.length == 0 ? (
                    <Icon
                        name='search'
                        size={14}
                        color='#81c04d'
                        style={styles.icon}
                    />) : null
                }
                {this.state.value.length != 0 ? (
                    <TouchableOpacity
                        style={styles.iconClean}
                        activeOpacity={1.0}
                        onPress={this.cleanText}
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
        position: 'absolute',
        top: 80,
        justifyContent: 'center',
    },
    searchPatternInput: {
        width: 120,
        height: 24,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#81c04d',
        borderRadius: 4,
        textAlignVertical: 'center',
        padding: 4,
        elevation: 5,
    },
    icon: {
        position: 'absolute',
        top: 4,
        marginLeft: 4,
        opacity: 0.75,
    },
    iconClean: {
        position: 'absolute',
        top: 4,
        right: 4,
        marginRight: 4,
    }
});
