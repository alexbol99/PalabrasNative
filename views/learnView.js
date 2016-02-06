/**
 * Created by alexanderbol on 06/02/2016.
 */
var React = require('react-native');
var HeaderComponent = require('../components/header').HeaderComponent;
var ContentComponent = require('../components/learnContent').LearnContentComponent;
var FooterComponent = require('../components/footer').FooterComponent;

var {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight
    } = React;

// use http://fortawesome.github.io/Font-Awesome/icons/
var { Icon,
    } = require('react-native-icons');

export const LearnView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    render() {
        return (
            <View style={{flex:1}}>
                <HeaderComponent {... this.props} />
                <ContentComponent {... this.props}
                    items = {this.props.learnItems}
                />
                <FooterComponent {... this.props} />
            </View>
        );
    }
});

var styles = StyleSheet.create({
});

