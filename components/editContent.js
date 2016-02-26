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

var globalStyles = require('../styles/styles').styles;

export const EditContentComponent = React.createClass ({
    getInitialState() {
        return {
        };
    },
    renderHeader() {
        var langLeft = this.props.dictionary.get('language1').get('name');   // "spanish";
        var langRight = this.props.dictionary.get('language2').get('name');  // "russian";
        var iconSortStyleLeft = this.props.editState.sortedBy == "leftLanguage" ?
            styles.iconSortActive : styles.iconSortDimmed;
        var iconSortStyleRight = this.props.editState.sortedBy == "rightLanguage" ?
            styles.iconSortActive : styles.iconSortDimmed;

        return (
            <View style={styles.headerContainer}>
                <Text style={styles.header}>
                    {langLeft}
                </Text>
                <TouchableHighlight onPress = {this.props.onLeftSortButtonPressed}>
                    <Icon
                        name='fontawesome|sort-desc'
                        size={20}
                        color='#81c04d'
                        style={iconSortStyleLeft}
                    />
                </TouchableHighlight>
                <Text style={styles.header}>
                    {langRight}
                </Text>
                <TouchableHighlight onPress = {this.props.onRightSortButtonPressed}>
                    <Icon
                        name='fontawesome|sort-desc'
                        size={20}
                        color='#81c04d'
                        style={iconSortStyleRight}
                    />
                </TouchableHighlight>
            </View>
        )
    },
    renderRow(item) {
        var langLeft = this.props.dictionary.get('language1').get('name');   // "spanish";
        var langRight = this.props.dictionary.get('language2').get('name');  // "russian";
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.item}>
                    {item.get(langLeft)}
                </Text>
                <Text style={styles.item}>
                    {item.get(langRight)}
                </Text>
            </View>

        )
    },
    render() {
        var langLeft = this.props.dictionary.get('language1').get('name');   // "spanish";
        var langRight = this.props.dictionary.get('language2').get('name');  // "russian";
        var sortedBy = this.props.editState.sortedBy;
        var sortedItems = this.props.items.sort((item1, item2) => {
            let val1 = sortedBy == "leftLanguage" ? item1.get(langLeft) : item1.get(langRight);
            let val2 = sortedBy == "leftLanguage" ? item2.get(langLeft) : item2.get(langRight);

            if (val1 > val2) {
                return 1;
            }
            if (val1 < val2) {
                return -1;
            }
            if (val1 == val2) {
                return 0;
            }
        });
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(sortedItems);

        return (
            <View style={styles.contentContainer}>
                <ListView
                    dataSource={dataSource}
                    initialListSize = {20}
                    renderSectionHeader={() => this.renderHeader()}
                    renderRow={(item) => this.renderRow(item)}
                />
                <TouchableHighlight style={styles.addItemButton}>
                    <Icon
                        name='fontawesome|plus-circle'
                        size={50}
                        color='#81c04d'
                        style={globalStyles.iconAdd}
                    />
                </TouchableHighlight>
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
    addItemButton: {
        position: 'absolute',
        right: 30,
        bottom: 30
    },
    iconAddItem: {
        width: 50,
        height: 50,
        elevation: 1,
        shadowColor:'darkgray',
        shadowOpacity: 0.8,
        shadowRadius: 4,
        shadowOffset: {
            height:0,
            width:0
        }
    },
    iconSortActive: {
        width:30,
        height: 30,
        opacity: 1.0
    },
    iconSortDimmed: {
        width:30,
        height: 30,
        opacity: 0.3
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
