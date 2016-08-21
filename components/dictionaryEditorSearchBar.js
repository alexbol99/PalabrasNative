/**
 * Created by alexanderbol on 29/07/2016.
 */
import React from 'react';
var SearchItemInput = require('../components/searchItemInput').SearchItemInput;
import {
    StyleSheet,
    View,
} from 'react-native';

export const DictionaryEditorSearchBar = React.createClass({
    getInitialState() {
        return {
        };
    },
    render()
    {
        return (
            <View style={styles.searchBar}>
                <SearchItemInput
                    value={this.props.leftSearchPattern}
                    onChangeText={this.props.leftSearchPatternChanged}
                    onFocus={this.props.onLeftSearchInputGotFocus}
                    onCleanSearchPatternPressed={this.props.onLeftCleanSearchPatternPressed}
                />
                <SearchItemInput
                    value={this.props.rightSearchPattern}
                    onChangeText={this.props.rightSearchPatternChanged}
                    onFocus={this.props.onRightSearchInputGotFocus}
                    onCleanSearchPatternPressed={this.props.onRightCleanSearchPatternPressed}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        marginLeft: 3,
    },
});
