/**
 * Created by alexanderbol on 06/02/2016.
 */
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

export const LearnContentComponent = React.createClass ({
    getInitialState() {
        return {
        };
    },
    renderRow(item) {
        var langLeft = this.props.dictionary.get('language1').get('name');   // "spanish";
        var langRight = this.props.dictionary.get('language2').get('name');  // "russian";
        return (
            <View style={styles.itemContainer}>
                <View style={styles.leftItemContainer}>
                     <Text style={styles.item}>
                        {item.get(langLeft)}
                    </Text>
                </View>

                <View style={styles.rightItemContainer}>
                    <Text style={styles.item}>
                        {item.get(langRight)}
                    </Text>
                </View>
            </View>

        )
    },
    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.props.items);
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
        flex:8,
        backgroundColor: '#F5FCFF',
    },
    description: {
        marginTop: 10,
        fontSize: 20,
        textAlign: 'center',
        color: '#656565'
    },
    headerContainer: {
        flexDirection: 'row'
    },
    header: {
        flex:1,
        paddingHorizontal: 10,
        marginVertical: 5,
        textAlign:'left',
        fontSize: 20,
        marginBottom: 3,
        /*borderWidth: 1*/
    },
    itemContainer: {
        flexDirection: 'row'
    },
    leftItemContainer: {
        flex:1,
        borderWidth: 1,
        borderColor: 'white',
        marginVertical:5,
    },
    rightItemContainer: {
        flex:1,
        borderWidth: 1,
        borderColor: 'white',
        marginVertical:5,
    },
    item: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        textAlign:'left',
        fontSize: 20,
    },
    listView: {
        flex: 1,
        height: 400
    },
    iconAddItem: {
        width: 40,
        height: 40
    },
    addItemButton: {
        position: 'absolute',
        right: 75,
        bottom: 75
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
