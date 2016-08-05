/**
 * Created by alexanderbol on 30/01/2016.
 */
/* CHANGED BY SWIPER */
import React from 'react';
var globalStyles = require('../styles/styles').styles;
import {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableOpacity
    } from 'react-native';

export const FooterComponent = React.createClass ({
    render() {
        return (
            <View style={styles.footerContainer}>
                <View style={styles.footerMenuItem}>
                    <TouchableOpacity onPress={this.props.onEditButtonPressed}
                                      activeOpacity={1.0}>
                        <Text style={styles.description}>
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerMenuItem}>
                    <TouchableOpacity onPress={this.props.onLearnButtonPressed}
                                      activeOpacity={1.0}>
                        <Text style={styles.description}>
                            Learn
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection:'row',
        /*
        position:'absolute',
        left:0,
        bottom:30,
        */

        backgroundColor: globalStyles.footer.backgroundColor,
        borderTopWidth: 1,
    },
    footerMenuItem: {
        flex: 1,
        /*borderWidth:1,*/
    },
    description: {
        marginTop: 10,
        fontSize: 25,
        fontWeight:'bold',
        textAlign: 'center',
        /*color: globalStyles.footer.color*/
    }
});
