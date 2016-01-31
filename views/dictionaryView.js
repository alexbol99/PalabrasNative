/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');
var HeaderComponent = require('../components/header').HeaderComponent;
var ContentComponent = require('../components/content').ContentComponent;
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

export const DictionaryView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    _buttonBackPressed() {
        this.props.onBackHomePressed();
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
        var d = 'מילון';
        var viewTitle = `${d} View`;
        return (
            <View style={styles.dictionaryViewContainer}>
                <HeaderComponent
                    currentDictionary = {this.props.currentDictionary}
                    onBackHomePressed={this.props.onBackHomePressed}
                />
                <ContentComponent
                    items = {this.props.items}
                />

            </View>
        );
    }
});

 /*
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
 */

var styles = StyleSheet.create({
    dictionaryViewContainer: {
        backgroundColor: '#F5FCFF'
    },
    headerContainer: {
        backgroundColor:'#81c04d',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
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
