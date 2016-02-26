/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');
var HeaderComponent = require('../components/header').HeaderComponent;

var Shares = require('../models/share').Shares.prototype;
var Dictionaries = require('../models/dictionaries').Dictionaries.prototype;
var Languages = require('../models/languages').Languages.prototype;
var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';

var globalStyles = require('../styles/styles').styles;

var {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    Image
    } = React;

// use http://fortawesome.github.io/Font-Awesome/icons/
var { Icon,
    } = require('react-native-icons');

export const HomeView = React.createClass ({
    getInitialState() {
        return {}
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;

        var user = this.props.store.getState().user;
        var needFetchData = this.props.store.getState().app.needFetchData;
        if (user && needFetchData) {
            this.fetchData(user);
        }

        var state = this.props.store.getState();
        this.setState(state);
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    fetchData(user) {
        Dictionaries.fetch(user.parseUser)
            .then( (dictionaries) => {
                this.dispatch({
                    type: ActionTypes.FETCH_DICTIONARIES_REQUEST_SUCCEED,
                    dictionaries: dictionaries
                });
                return Shares.fetch(user.parseUser);
            })
            .then( (shares) => {
                this.dispatch({
                    type: ActionTypes.FETCH_SHARES_REQUEST_SUCCEED,
                    shares: shares
                });
                return Languages.fetch();
            })
            .then( (languages) => {
                this.dispatch({
                    type: ActionTypes.FETCH_LANGUAGES_REQUEST_SUCCEES,
                    languages: languages
                });
                this.dispatch({
                    type:ActionTypes.AJAX_REQUEST_RESET
                })
            }),

            (error) => {
                this.dispatch({
                    type: ActionTypes.AJAX_REQUEST_FAILED
                });
            };

        this.dispatch({
            type: ActionTypes.AJAX_REQUEST_STARTED
        })
    },
    dictionarySelected(dictionary) {
        this.dispatch({
            type: ActionTypes.DICTIONARY_SELECTED,
            dictionary: dictionary
        });
        this.createItems(dictionary);
    },
    createItems(dictionary) {
        var pref = '';
        if (dictionary.id.charAt(0) >= '0' && dictionary.id.charAt(0) <= '9') {
            pref = 'a';
        }
        var itemsClassName = pref + dictionary.id;
        var items = new Items(itemsClassName);
        items.fetch().then( (items) => {
            this.dispatch({
                type: ActionTypes.FETCH_ITEMS_SUCCEED,
                items: items
            });
        });
    },
    renderHeader() {
        var userImage = null;

        if (this.state.user && this.state.user.url) {
            userImage = (
                <Image  style={styles.userpic}
                        source={{uri: this.state.user.url}}
                />
            );
        }

        return (
            <View style={styles.headerContainer}>
                {userImage}

                <Text style={styles.appTitle}>
                    Dictionaries
                </Text>

                <Icon
                    name='fontawesome|bars'
                    size={20}
                    color='white'
                    style={globalStyles.header.icon}
                />
            </View>
        )
    },
    renderRow(dictionary) {
        return (
            <TouchableHighlight key={dictionary.id}
                                onPress={() => this.dictionarySelected(dictionary)} >
                <View style={styles.dictionaryContainer} >
                    <Text style={styles.dictionaryName}>
                        {dictionary.get('name')}
                    </Text>
                    <View style={styles.dictionarySubtitle} >
                        <Text style={styles.createdBy}>
                            {'Created by ' + dictionary.get('createdBy').get('name')}
                        </Text>

                        <Text style={styles.languages}>
                            {dictionary.get('language1').get('name') + ' - ' + dictionary.get('language2').get('name')}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render() {
        var addDirectoryButton = this.state.ajaxState == "" ? (
            <TouchableHighlight style={styles.addDirectoryButton}>
                <Icon
                    name='fontawesome|plus-circle'
                    size={50}
                    color='#81c04d'
                    style={globalStyles.iconAdd}
                />
            </TouchableHighlight>
        ) : null;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.state.dictionaries);
        var content = this.state.dictionaries.length == 0 ? (
            <Text style={styles.description}>
                Words in my pocket
            </Text>
        ) : (
            <ListView
                dataSource={dataSource}
                initialListSize = {20}
                renderSectionHeader={() => this.renderHeader()}
                renderRow={(dictionary) => this.renderRow(dictionary)}
            />
        );

        if (this.state.ajaxState != "") {
            content = (
                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={styles.description}>
                        {/*this.state.ajaxState*/}
                        Connecting to server ...
                    </Text>
                    <Icon
                        name='fontawesome|spinner'
                        size={50}
                        color='darkgray'
                        style={styles.spinner}
                    />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                {content}
                {addDirectoryButton}
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        /*alignItems: 'center',*/
        backgroundColor: '#F5FCFF'
    },
    spinner: {
        flex:1,
        width: 50,
        height: 50,
        color: 'green'
    },
    headerContainer: {
        paddingTop:30,
        paddingBottom:10,
        marginTop: 0,
        flexDirection: 'row',
        backgroundColor: globalStyles.header.backgroundColor
    },

    appTitle: globalStyles.header.title,

    userpic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10
    },

    menuIcon: {
        flex:1,
        width: 50,
        height: 50,
        color: 'fff'
    },

    dictionaryContainer: globalStyles.item,

    dictionaryName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 10
    },
    dictionarySubtitle: {
        flex:1,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10
    },
    createdBy: {
        flex:1,
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'left'
    },
    languages: {
        flex:1,
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'right'
    },
    description: {
        marginBottom: 20,
        marginTop: 250,
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#656565'
    },

    addDirectoryButton: {
        position: 'absolute',
        right: 30,
        bottom: 30
    },

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
