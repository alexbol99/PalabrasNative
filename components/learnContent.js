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
    TouchableOpacity,
    Animated
    } from 'react-native';

// use http://fortawesome.github.io/Font-Awesome/icons/
var Icon = require('react-native-vector-icons/FontAwesome');

const ItemComponent = React.createClass({
    getInitialState() {
        return {
            fadeAnim: new Animated.Value(1.0)
        };
    },
    componentDidMount() {
        //this.state.fadeAnim.addListener( (fadeAnim) =>{
        //    if (fadeAnim.value == 0.4) {
        //        if (this.props.onItemFadedOut) {
        //            this.props.onItemFadedOut();
        //        }
        //    }
        //}, this);
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.matched) {
            this.startAnimation();
        }
        else {
            this.state.fadeAnim.setValue(1.0);
        }
    },
    startAnimation() {
        Animated.timing(            // Uses easing functions
            this.state.fadeAnim,    // The value to drive
            {toValue: 0.1}          // Configuration
        ).start();                  // Don't forget start!
    },
    render() {
        let itemStyle = this.props.selected ? styles.itemSelected : styles.item;
        return (
            <Animated.View
                style={[itemStyle, {opacity: this.state.fadeAnim}]}
            >
                <TouchableOpacity
                    activeOpacity={1.0}
                    onPress = {this.props.onPress}>
                    <Text style={styles.text}>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        )
    }
});

export const LearnContentComponent = React.createClass ({
    getInitialState() {
        return {
        };
    },
    renderRow(item) {
        var langLeft = this.props.dictionary.get('language1').get('name');   // "spanish";
        var langRight = this.props.dictionary.get('language2').get('name');  // "russian";
        let learnState = this.props.learnState;
        let leftSelected = learnState.selectedLeftItemId == item.left.id;
        let rightSelected = learnState.selectedRightItemId == item.right.id;
        let matched = learnState.selectedLeftItemId == learnState.selectedRightItemId;
        return (
            <View
                style={styles.itemContainer}>
                <ItemComponent
                    text = {item.left.get(langLeft)}
                    selected = {leftSelected}
                    matched = {leftSelected && matched}
                    onPress = {() => this.props.onLeftItemSelected(item.left.id)}
                />
                <ItemComponent
                    text = {item.right.get(langRight)}
                    selected = {rightSelected}
                    matched = {rightSelected && matched}
                    onPress = {() => this.props.onRightItemSelected(item.right.id)}
                />
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
            <Animated.View
                style={[styles.contentContainer, {opacity: this.state.fadeAnim}]}>
                <ListView
                    dataSource={dataSource}
                    initialListSize = {20}
                    renderRow={(item) => this.renderRow(item)}
                    enableEmptySections = {true}
                />
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    contentContainer: {
        flex:1,
        backgroundColor: globalStyles.content.backgroundColor,
    },
    itemContainer: {
        flexDirection: 'row',
        marginLeft:3,
        marginRight:3
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
        paddingVertical: 10,
        textAlign:'left',
        fontSize: 20,

    }
});

