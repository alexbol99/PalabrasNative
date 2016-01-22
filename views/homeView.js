/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');

var {
    Text,
    StyleSheet,
    View,
    TouchableHighlight
    } = React;

export const HomeView = React.createClass ({
    getInitialState() {
        return {}
    },
    _handlePress(dictionary) {
        this.props.dictionarySelected(dictionary);
    },
    render() {
        var content = this.props.dictionaries.length == 0 ? (
            <Text style={styles.description}>
                You personal dictionary
            </Text>
        ) : (
            this.props.dictionaries.map( (dictionary) => {
                return (
                    <TouchableHighlight
                        onPress={() => this._handlePress(dictionary)}
                        key={dictionary.id}>
                        <Text style={styles.description}>
                            {dictionary.get('name')}
                        </Text>

                    </TouchableHighlight>
                );
            })
        );

        if (this.props.ajaxState != "") {
            content = (
                <Text style={styles.description}>
                    {this.props.ajaxState}
                </Text>
            );
        }

        return (
            <View style={styles.container}>
                {content}
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    description: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        color: '#656565'
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
