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
                    searchEnabled={this.props.leftSearchEnabled}
                    value={this.props.leftSearchPattern}
                    rtl={this.props.leftRtl}
                    onChangeText={this.props.leftSearchPatternChanged}
                    onFocus={this.props.onLeftSearchInputGotFocus}
                    onCleanSearchPatternPressed={this.props.onLeftCleanSearchPatternPressed}
                    onToggleSearchButtonPressed={this.props.onLeftToggleSearchButtonPressed}
                />
                <SearchItemInput
                    searchEnabled={this.props.rightSearchEnabled}
                    value={this.props.rightSearchPattern}
                    rtl={this.props.rightRtl}
                    onChangeText={this.props.rightSearchPatternChanged}
                    onFocus={this.props.onRightSearchInputGotFocus}
                    onCleanSearchPatternPressed={this.props.onRightCleanSearchPatternPressed}
                    onToggleSearchButtonPressed={this.props.onRightToggleSearchButtonPressed}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        marginLeft: 3,
        alignItems: 'center'
    },
});
