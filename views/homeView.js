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
import Share from 'react-native-share';

var globalStyles = require('../styles/styles').styles;

var {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    Image,
    ActionSheetIOS,
    Platform
    } = React;

// use http://fortawesome.github.io/Font-Awesome/icons/

var Icon = require('react-native-vector-icons/FontAwesome');

const LocalMenu = ({sharePressed, logoutPressed}) => {
    return (
        <View style={styles.localMenu}>
            <TouchableHighlight onPress={sharePressed}>
                <Text style={globalStyles.menuItem}>
                    Share
                </Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={logoutPressed}>
                <Text style={globalStyles.menuItem}>
                    Log Out
                </Text>
            </TouchableHighlight>
        </View>
    )
};


const Header = ({uri, onMenuButtonPressed}) => {
    var userImage = null;

    if (uri) {
        userImage = (
            <Image  style={styles.userpic}
                    source={{uri: uri}}
            />
        );
    }

    return (
        <View style={styles.headerContainer}>
            {userImage}

            <Text style={styles.appTitle}>
                Dictionaries
            </Text>

            <TouchableHighlight onPress={onMenuButtonPressed}>
                <Icon name='bars' size={20} color='white' style={globalStyles.header.icon}>
                </Icon>
            </TouchableHighlight>
        </View>
    )
};

/* */

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
    addEmptyDictionary() {
        var user = this.state.user.parseUser;
        var language = this.state.languages[0];
        if (!user) return;
        Dictionaries.createEmptyDictionary(user, language, language)
            .then( (dictionary) =>
                this.dispatch({
                    type: ActionTypes.NEW_DICTIONARY_SAVE_REQUEST_SUCCEED,
                    dictionary: dictionary
                })
            ),
            (error) => {
                this.dispatch({
                    type: ActionTypes.AJAX_REQUEST_FAILED
                });
            };
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
    toggleHomeMenu() {
        this.dispatch({
            type: ActionTypes.HOME_MENU_BUTTON_PRESSED
        })
    },
    sharePressed() {
        /* on Android use https://github.com/EstebanFuentealba/react-native-share ? */
        if (Platform.OS === 'android') {
            Share.open({
                share_text: "Learn new words",
                share_URL: "https://dl.dropboxusercontent.com/u/79667427/palabras3_dist/index.html",
                title: "Word In My Pocket"
            },(e) => {
                console.log(e);
            });
        }
        else {
            ActionSheetIOS.showShareActionSheetWithOptions({
                    url: `https://dl.dropboxusercontent.com/u/79667427/palabras3_dist/index.html`,
                    message: `Learn new words`,
                    subject: 'Word In My Pocket',
                    excludedActivityTypes: [
                        'com.apple.UIKit.activity.PostToTwitter',
                        'com.apple.UIKit.activity.UIActivityTypeCopyToPasteboard',
                        'com.apple.UIKit.activity.UIActivityTypeAddToReadingList'
                    ]
                },
                (error) => {
                    console.error(error);
                },
                (success, method) => {
                    var text;
                    if (success) {
                        text = `Shared via ${method}`;
                    } else {
                        text = 'You didn\'t share';
                    }
                    console.log(text);
                });
        }
    },
    logoutPressed() {
        this.dispatch({
            type: ActionTypes.MENU_ITEM_LOGOUT_PRESSED
        })
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
                            {dictionary.get('language1').get('localName') + ' - ' +
                            dictionary.get('language2').get('localName')}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render() {
        var addDirectoryButton = this.state.ajaxState == "" ? (
            <TouchableHighlight style={styles.addDirectoryButton}
                                onPress={() => this.addEmptyDictionary()}>
                <Icon
                    name='plus-circle'
                    size={50}
                    color='#81c04d'
                    style={globalStyles.iconAdd}
                />
            </TouchableHighlight>
        ) : null;
/*
        var modal = (
            <Modal animated={true}
                transparent={false}
                visible={true} >
                <View style={{top:100,left:50}}>
                    <Text>MODAL MODAL MODAL</Text>
                </View>
            </Modal>
        );*/
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.state.dictionaries);

        var contentWrapperStyle = this.state.app.showHomeMenu ? styles.contentShifted : styles.contentRegular;

        var content = this.state.dictionaries.length == 0 ? (
            <Text style={styles.description}>
                Words in my pocket
            </Text>
        ) : (
            <ListView
                dataSource={dataSource}
                initialListSize = {20}
                renderRow={(dictionary) => this.renderRow(dictionary)}
            />
        );

        uri = this.state.user && this.state.user.url ? this.state.user.url : undefined;
        var header = (
            <Header uri={uri}
                    onMenuButtonPressed={() => this.toggleHomeMenu()}
            /> );

        /*renderSectionHeader={() => this.renderHeader()}*/

        if (this.state.ajaxState != "") {
            content = (
                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={styles.description}>
                        {/*this.state.ajaxState*/}
                        Connecting to server ...
                    </Text>
                    <Icon
                        name='spinner'
                        size={50}
                        color='darkgray'
                        style={styles.spinner}
                    />
                </View>
            );
        }

        var localMenu = this.state.app.showHomeMenu ? (
            <LocalMenu
                sharePressed={() => this.sharePressed()}
                logoutPressed={() => this.logoutPressed()}
            />
        ) : null;

        return (
            <View style={styles.container}>
                {header}
                <View style={contentWrapperStyle}>
                    {content}
                    {addDirectoryButton}
                </View>
                {localMenu}
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
    contentRegular: {
    },
    contentShifted: {
        right: 100
    },
    spinner: {
        flex:1,
        width: 50,
        height: 50,
        /*color: 'green'*/
    },
    headerContainer: {
        paddingTop:20,
        paddingBottom:10,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: globalStyles.header.backgroundColor
    },

    appTitle: globalStyles.header.title,

    userpic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
        alignSelf: 'center'
    },

    menuIcon: {
        flex:1,
        width: 50,
        height: 50,
        /*color: '#ffffff'*/
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
        /*color: '#656565'*/
    },

    addDirectoryButton: {
        position: 'absolute',
        right: 30,
        bottom: 30
    },

    localMenu: {
        position: 'absolute',
        right: 0,
        top: 80,
        /*backgroundColor: '#F5FCFF',*/
        backgroundColor: globalStyles.header.backgroundColor,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ffffff'
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
