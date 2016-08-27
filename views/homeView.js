/**
 * Created by alexanderbol on 21/01/2016.
 */
import React from 'react';
// svar HeaderComponent = require('../components/header').HeaderComponent;

var Shares = require('../models/share').Shares;
import { Dictionaries } from '../models/dictionaries';
import { Languages } from '../models/languages';
var Items = require('../models/items').Items;

var ActionTypes = require('../store/actionTypes.js');

var globalStyles = require('../styles/styles').styles;

var ReactNative = require('react-native');
var Share = require('react-native-share');

var {Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    ActionSheetIOS,
    Platform,
    Linking,
    AsyncStorage,
    Alert
    } = ReactNative;

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


const Header = ({uri, onMenuButtonPressed, isConnected, onOfflineButtonPressed}) => {
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

            { isConnected ? (
                <TouchableOpacity
                    onPress={onMenuButtonPressed}
                    activeOpacity={1.0}>
                    <Icon name='bars' size={20} color='white' style={globalStyles.header.icon}>
                    </Icon>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={onOfflineButtonPressed}
                    activeOpacity={1.0}>
                    <Icon name='ban' size={20} color='white' style={globalStyles.header.icon}>
                    </Icon>
                </TouchableOpacity>
            ) }
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
        var state = this.props.store.getState();

        if (state.user && state.app.needFetchData) {

            if (state.app.isConnected) {
                this.fetchData(state.user);
                this.processLink(state.user);
            }
            else {
                AsyncStorage.getItem('@Palabras:state')
                    .then((resp) => {
                        let offlineState = JSON.parse(resp);
                        // augment first language structures, then dictionary structure to avoid closure
                        offlineState.dictionaries = offlineState.dictionaries.map((dictionary) =>
                            Object.assign({}, dictionary,
                            {
                                language1: Object.assign({}, dictionary.language1, {
                                    id: dictionary.language1.objectId,
                                    get: function(prop) { return dictionary.language1[prop] }
                                }),
                                language2: Object.assign({}, dictionary.language2, {
                                    id: dictionary.language2.objectId,
                                    get: function(prop) { return dictionary.language2[prop] }
                                }),
                                createdBy: Object.assign({}, dictionary.createdBy, {
                                    id: dictionary.createdBy.objectId,
                                    get: function(prop) { return dictionary.createdBy[prop] }
                                })
                            })
                        );

                        offlineState.dictionaries = offlineState.dictionaries.map((dictionary) =>
                            Object.assign({}, dictionary,
                                {
                                    id: dictionary.objectId,
                                    get: function(prop) { return dictionary[prop]},
                                })
                        );

                        offlineState.user.parseUser.id = offlineState.user.parseUser.objectId;
                        offlineState.user.parseUser.get = function(prop) { return offlineState.user.parseUser[prop]};

                        this.dispatch({
                            type: ActionTypes.ASYNC_STORAGE_GET_STATE_SUCCEED,
                            offlineState: offlineState
                        })
                    });
            }
        }

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
                    type: ActionTypes.FETCH_LANGUAGES_REQUEST_SUCCEED,
                    languages: languages
                });
                this.dispatch({
                    type: ActionTypes.AJAX_REQUEST_RESET
                });
                // clean AsyncStorage before asking to store the new one
                return AsyncStorage.removeItem('@Palabras:state');
            })
            .then( (resp) => {
                // keep current state in AsyncStorage
                let state = this.props.store.getState();
                return AsyncStorage.setItem('@Palabras:state', JSON.stringify(state))
            })
            .then( (resp) => {
                // Get available locales for text-to-speech - doesn't work on Android
                return Languages.getLocales()
            })
            .then((locales) => {
                // alert(locales);  TBD: do something with this locales
                this.dispatch({
                    type: ActionTypes.TTS_LOCALES_REQUEST_SUCCEED,
                    locales: locales
                })
            })
            .then((resp) => {
                // console.log(resp);
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
    processLink(user) {
        Linking.getInitialURL()
            .then((url) => {
                if (url && url.split('/')[2] == "quiz" && url.split('/')[3] != "") {
                    var dictionaryId = url.split('/')[3];
                    // Alert.alert('Linking','Initial url is: ' + url);
                    return Dictionaries.findById(dictionaryId);
                }
            })
            .then( (dictionary) => {
                return Shares.share(user.parseUser, dictionary);
            })
            .then( (share) => {
                /* do nothing with share but re-fetch data */
                this.dispatch({
                    type: ActionTypes.SHARE_DICTIONARY_REQUEST_SUCCEED
                })
            }),
            (error) => {
                this.dispatch({
                    type: ActionTypes.AJAX_REQUEST_FAILED
                });
            };

    },
    dictionarySelected(dictionary) {
        var itemsParse = this.createItems(dictionary);
        this.dispatch({
            type: ActionTypes.DICTIONARY_SELECTED,
            dictionary: dictionary,
            itemsParse: itemsParse,
            needFetchItems: this.state.app.currentDictionary == undefined ||
                this.state.app.currentDictionary.id != dictionary.id
        });
    },
    addNewDictionaryButtonPressed() {
        this.dispatch({
            type: ActionTypes.ADD_NEW_DICTIONARY_BUTTON_PRESSED
        });
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
        var id = dictionary.id || dictionary.objectId;
        if (id.charAt(0) >= '0' && id.charAt(0) <= '9') {
            pref = 'a';
        }
        var itemsClassName = pref + id;
        return new Items(itemsClassName);
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
                share_URL: "https://dl.dropboxusercontent.com/u/79667427/palabras_redirect.html",
                title: "Palabras"
            },(e) => {
                console.log(e);
            });
        }
        else {
            ActionSheetIOS.showShareActionSheetWithOptions({
                    url: `https://dl.dropboxusercontent.com/u/79667427/palabras_redirect.html`,
                    message: `Learn new words`,
                    subject: 'Palabras',
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
    onOfflineButtonPressed() {
        Alert.alert("You are working in offline mode");
    },
    renderRow(dictionary) {
        let createdBy = dictionary.get('createdBy').get('name');

        if (!createdBy) {
            if (dictionary.get('createdBy').id == this.state.user.parseUser.id) {
                createdBy = this.state.user.parseUser.get('name')
            }
            else {
                createdBy = 'unknown';
            }
        }

        return (
            <TouchableOpacity key={dictionary.id}
                                onPress={() => this.dictionarySelected(dictionary)} >
                <View style={styles.dictionaryContainer} >
                    <Text style={styles.dictionaryName}>
                        {dictionary.get('name')}
                    </Text>
                    <View style={styles.dictionarySubtitle} >
                        <Text style={styles.createdBy}>
                            {'Created by ' + createdBy}
                        </Text>

                        <Text style={styles.languages}>
                            {dictionary.get('language1').get('localName') + ' - ' +
                            dictionary.get('language2').get('localName')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    },
    render() {
        var addDirectoryButton = this.state.ajaxState == "" && this.state.app.isConnected ? (
            <TouchableOpacity style={styles.addDirectoryButton}
                                onPress={() => this.addNewDictionaryButtonPressed()}>
                <Icon
                    name='plus-circle'
                    size={50}
                    color='#81c04d'
                    style={globalStyles.iconAdd}
                />
            </TouchableOpacity>
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
                Press plus button to add new dictionary
            </Text>
        ) : (
            <ListView ref="dictionariesList"
                dataSource={dataSource}
                initialListSize = {20}
                renderRow={(dictionary) => this.renderRow(dictionary)}
            />
        );

        uri = this.state.user && this.state.user.url ? this.state.user.url : undefined;
        var header = (
            <Header uri={uri}
                    onMenuButtonPressed={() => this.toggleHomeMenu()}
                    isConnected = {this.state.app.isConnected}
                    onOfflineButtonPressed = {this.onOfflineButtonPressed}
            /> );

        /*renderSectionHeader={() => this.renderHeader()}*/

        if (this.state.ajaxState != "") {
            content = (
                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={styles.description}>
                        {/*this.state.ajaxState*/}
                        Connecting to server ...
                    </Text>
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
                {content}
                {addDirectoryButton}
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
        flex:1
    },
    contentShifted: {
        flex:1,
        right: 100
    },
    spinner: {
        flex:1
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
        fontSize: 10,
        fontStyle: 'italic',
        textAlign: 'left'
    },
    languages: {
        flex:1,
        fontSize: 10,
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
        right: 40,
        bottom: 40
    },

    localMenu: {
        position: 'absolute',
        right: 0,
        top: 90,
        /*backgroundColor: '#F5FCFF',*/
        backgroundColor: globalStyles.header.backgroundColor,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ffffff',
        elevation: 1,
        shadowColor:'darkgray',
        shadowOpacity: 0.8,
        shadowOffset: {
            height:0,
            width:0
        }
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

/*
<Icon
    name='spinner'
    size={50}
    color='darkgray'
    style={styles.spinner}
/>
*/