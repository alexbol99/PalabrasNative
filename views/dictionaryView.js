/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');
var EditView = require('../views/editView').EditView;
var LearnView = require('../views/learnView').LearnView;

var {
    StyleSheet,
    View
    } = React;

export const DictionaryView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    render() {
        var viewInstance = this.props.mode == 'edit' ? (
            <EditView {... this.props} />
        ) : (
            <LearnView { ... this.props} />
        );
        return (
            <View style={{flex:1}}>
                {viewInstance}
            </View>
        );
    }
});

var styles = StyleSheet.create({
});

