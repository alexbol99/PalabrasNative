/**
 * Created by alexanderbol on 29/07/2016.
 */
import React from 'react';
var globalStyles = require('../styles/styles').styles;

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
            </View>
        );
    }
});

var styles = StyleSheet.create({
    searchPopup: {
        position: 'absolute',
        top: 80,
        width: 100,
        height: 45,
        alignItems: 'center',
        /*borderWidth: 1,
         elevation: 1,
         shadowColor:'darkgray',
         borderColor: '#81c04d',
         shadowOpacity: 0.8,
         shadowOffset: {
         height:0,
         width:0
         }*/
    },
    searchPatternInput: {
        /*position: 'absolute',
         top: 80,
         width: 100,*/
        height: 40,
        marginLeft:2,
        marginRight:2,
        paddingLeft:5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#81c04d',
        textAlignVertical: 'center',
        elevation: 5,
    }
});
