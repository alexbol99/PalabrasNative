/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');

var {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight
    } = React;

export const DictionaryView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    renderRow(item) {
        return (
            <Text>
                {item.get('spanish') + ' ' + item.get('russian')}
            </Text>
        )
    },
    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.props.items);

        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Dictionary View
                </Text>
                <ListView
                    dataSource={dataSource}
                    renderRow={(item) => this.renderRow(item)}
                    renderSectionHeader={ () =>
                        <Text style={styles.description}>
                            {this.props.currentDictionary.get('name')}
                        </Text>
                    }
                    renderFooter={ () =>
                        <Text style={styles.description}>
                            Footer
                        </Text>
                    }
                />
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
        marginTop: 0,
        fontSize: 20,
        textAlign: 'center',
        color: '#656565'
    },
    listView: {
        flex: 1,
        height: 400
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
