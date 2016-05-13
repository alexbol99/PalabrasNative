/**
 * Created by alexbol on 3/6/2016.
 */
var React = require('react-native');
var HeaderComponent = require('../components/header').HeaderComponent;

import * as ActionTypes from '../store/actionTypes';

var {
    Text,
    StyleSheet,
    View,
    WebView,
    Platform,
    BackAndroid
    } = React;

// use http://fortawesome.github.io/Font-Awesome/icons/
var Icon = require('react-native-vector-icons/FontAwesome');

export const GoWebView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    },
    componentDidMount() {
        // Listen Android back button
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.backToDictionaryView);
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.backToDictionaryView);
        }
    },
    onNavigationStateChange(navState) {
        // console.log(navState);
    },
    backToDictionaryView() {
        this.dispatch({
            type: ActionTypes.BACK_TO_DICTIONARY_VIEW_PRESSED
        });
        return true;
    },
    render() {
        var item = this.state.editState.selectedItem;
        var currentDictionary = this.state.app.currentDictionary;

        if (item == undefined || currentDictionary == undefined)
            return null;

        var langLeft = currentDictionary.get('language1').get('name');
        var learnMore = currentDictionary.get('learnMore');
        if (learnMore.indexOf('google') > 0) {
            var url = learnMore + '?q=' + item.get(langLeft);
        }
        else {
            var url = learnMore + item.get(langLeft);
        }

        return (
            <View style={styles.webView}>
                <HeaderComponent
                    title={`${item.get(langLeft)} in WEB`}
                    onBackButtonPressed={this.backToDictionaryView}
                />

                <WebView
                    source={{uri: url}}
                    automaticallyAdjustContentInsets={false}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    webView: {
        flex:1
    }
});
