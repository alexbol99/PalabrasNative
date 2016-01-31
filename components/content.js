/**
 * Created by alexanderbol on 30/01/2016.
 */
var React = require('react-native');

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

export const ContentComponent = React.createClass ({
    renderRow(item) {
        return (
            <View style={{flexDirection:'row'}}>
                <Text style={styles.item}>
                    {item.get('spanish')}
                </Text>
                <Text style={styles.item}>
                    {item.get('russian')}
                </Text>
            </View>

        )
    },
    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.props.items);
        return (
            <View style={styles.contentContainer}>
                <ListView
                    dataSource={dataSource}
                    renderRow={(item) => this.renderRow(item)}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#F5FCFF',
    },
    description: {
        marginTop: 10,
        fontSize: 20,
        textAlign: 'center',
        color: '#656565'
    },
    item: {
        flex:1,
        paddingHorizontal: 10,
        marginVertical: 5,
        textAlign:'left',
        fontSize: 15
    },
    listView: {
        flex: 1,
        height: 400
    },
    icon: {
        width: 28,
        height: 28,
        marginLeft: 5
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
