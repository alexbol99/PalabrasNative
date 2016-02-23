/**
 * Created by alexanderbol on 21/01/2016.
 */
var React = require('react-native');
var HeaderComponent = require('../components/header').HeaderComponent;

var Items = require('../models/items').Items;
var User = require('../models/user').User;

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

        var state = this.props.store.getState();
        if (state.user.data) {
            User.prototype.parseLogin(state.user.data);

            User.prototype.fbFetchPhoto(state.user.data)
                .then( (response) => response.json() )
                .then((responseData) => {
                    this.dispatch( {
                        type: ActionTypes.FETCH_USER_PHOTO_REQUEST_SUCCEED,
                        photo: {
                            url: responseData.data.url,
                            height: responseData.data.height,
                            width: responseData.data.width
                        }
                    });
                })
                .done();
        }

        this.setState(state);
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
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
    render() {
        var header = (
            <View style={styles.headerContainer}>
                <Text style={styles.appTitle}>
                    Dictionaries
                </Text>
            </View>
        );

        var userImage = null;
        if (this.state.user && this.state.user.photo) {
            var photo = this.state.user.photo;

            userImage = (
                <Image
                    style={photo &&
                        {
                          height: photo.height,
                          width: photo.width,
                        }
                    }
                    source={{uri: photo && photo.url}}
                />
            );
        }

        var content = this.state.dictionaries.length == 0 ? (
            <Text style={styles.description}>
                Words in my pocket
            </Text>
        ) : (
            this.state.dictionaries.map( (dictionary) => {
                return (
                    <TouchableHighlight key={dictionary.id}
                          onPress={() => this.dictionarySelected(dictionary)} >
                        <View style={styles.dictionaryContainer} >
                            <Text style={styles.dictionaryName}>
                                {dictionary.get('name')}
                            </Text>
                            <View style={styles.dictionarySubtitle} >
                                <Text style={styles.createdBy}>
                                    {'Created by ' + dictionary.get('createdBy').id}
                                </Text>

                                <Text style={styles.languages}>
                                    {dictionary.get('language1').get('name') + ' - ' + dictionary.get('language2').get('name')}
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    );
            })
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
                {header}
                {userImage}
                {content}
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
        margin: 50,
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
