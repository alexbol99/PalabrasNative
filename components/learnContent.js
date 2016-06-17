/**
 * Created by alexanderbol on 06/02/2016.
 */
/**
 * Created by alexanderbol on 30/01/2016.
 */
import React from 'react';
var globalStyles = require('../styles/styles').styles;

import {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableOpacity
    } from 'react-native';

// use http://fortawesome.github.io/Font-Awesome/icons/
var Icon = require('react-native-vector-icons/FontAwesome');

export const LearnContentComponent = React.createClass ({
    getInitialState() {
        return {
        };
    },
    renderRow(item) {
        var langLeft = this.props.dictionary.get('language1').get('name');   // "spanish";
        var langRight = this.props.dictionary.get('language2').get('name');  // "russian";
        var leftStyle = this.props.learnState.selectedLeftItemId == item.left.id ? styles.itemSelected : styles.item;
        var rightStyle = this.props.learnState.selectedRightItemId == item.right.id ? styles.itemSelected : styles.item;

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    style={leftStyle}
                    activeOpacity={1.0}
                    onPress = {() => this.props.onLeftItemSelected(item.left.id)}>
                     <Text style={styles.text}>
                        {item.left.get(langLeft)}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={rightStyle}
                    activeOpacity={1.0}
                    onPress = {() => this.props.onRightItemSelected(item.right.id)}>
                    <Text style={styles.text}>
                        {item.right.get(langRight)}
                    </Text>
                </TouchableOpacity>
            </View>

        )
    },
    render() {
        var items = [];

        this.props.leftItems.forEach( function(item, i) {
            items.push({
                left: item,
                right: this.props.rightItems[i]
            });
        }, this);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(items);
        var langLeft = this.props.dictionary.get('language1').get('name');   // "spanish";
        var langRight = this.props.dictionary.get('language2').get('name');  // "russian";

        return (
            <View style={styles.contentContainer}>
                <ListView
                    dataSource={dataSource}
                    initialListSize = {20}
                    renderRow={(item) => this.renderRow(item)}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    contentContainer: {
        flex:1,
        backgroundColor: globalStyles.content.backgroundColor,
    },
    itemContainer: {
        flexDirection: 'row'
    },
    item: {
        flex:1,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'honeydew',
        marginVertical:5,
        paddingLeft: 3,
        paddingRight: 3
    },
    itemSelected: {
        flex:1,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'lightcyan',
        marginVertical:5,
        paddingLeft: 3,
        paddingRight: 3
    },
    text: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        textAlign:'left',
        fontSize: 20,

    }
});

/*
 var styles = StyleSheet.create({
 container: {
 padding:30,
 marginTop: 65,
 alignItems:'center'
 },
 image: {
 width: 217,
 height: 138
 },
 searchInput: {
 height: 36,
 padding: 4,
 marginRight: 5,
 flex: 4,
 fontSize: 18,
 borderWidth: 1,
 borderColor: '#48BBEC',
 borderRadius: 8,
 color: '#48BBEC'
 }
 });
 */

/* module.exports = HomeView; */
