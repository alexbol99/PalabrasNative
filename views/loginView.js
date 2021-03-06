/**
 * Created by alexanderbol on 21/02/2016.
 */
import React from 'react';
var User = require('../models/user').User;
import * as ActionTypes from '../store/actionTypes';
var globalStyles = require('../styles/styles').styles;
var Dimensions = require('Dimensions');

import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    Image,
    Alert,
    AsyncStorage
    } from 'react-native';

// var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

export const LoginView = React.createClass({
    getInitialState() {
        return {
            showLoginButton: false
        };
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());

    },
    componentDidMount() {
        // On LogOut requested run Logout
        if (this.props.store.getState().user.status == "MENU_ITEM_LOGOUT_PRESSED") {
            this.onLogout();
        }

        if (this.state.app.isConnected) {
            this.fbloginStart();
        }
        else {       // in offline mode pass around authentication due to some error on Android. TBD: Investigate later
            AsyncStorage.getItem('@Palabras:state')
                .then((resp) => {
                    let offlineState = JSON.parse(resp);
                    if (offlineState.user.parseUser) {
                        offlineState.user.parseUser.id = offlineState.user.parseUser.objectId;
                        offlineState.user.parseUser.get = function(prop) { return offlineState.user.parseUser[prop]};
                        this.dispatch({
                            type: ActionTypes.USER_LOGGED_IN_TO_PARSE,
                            user: offlineState.user.parseUser
                        });
                    }
                });
        }

        /*
        var _this = this;
        if (FBLoginManager.getCredentials) {
            FBLoginManager.getCredentials(function (error, data) {
                if (error) {
                    _this.setState({
                        showLoginButton: true
                    })
                }
                else {
                    _this.onLoginFound(data);
                }
            });
        }
        */

    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    fbloginStart() {
        /* how to set loginBehaviour ??? */
        var loginBehaviour = FBLoginManager.LoginBehaviors ? FBLoginManager.LoginBehaviors.SystemAccount : undefined;
        FBLoginManager.FBSDKLoginBehavior = loginBehaviour;
        if (FBLoginManager.loginWithPermissions) {
            FBLoginManager.loginWithPermissions(["email", "user_friends"],
                (error, data) => {
                    if (error) {
                        this.setState({
                            showLoginButton: true
                        });
                    }
                    else {
                        this.onLoginFound(data);
                    }
                })
        }
    },
    fbLogout() {
        var _this = this;
        FBLoginManager.logout(function(error, data){
            if (!error) {
                _this.setState({
                    showLoginButton : true
                });
            } else {
                console.log(error, data);
            }
        });
    },
    parseLoginIOS(credentials) {
        User.prototype.parseLogin(credentials)                       // login to Parse
        .then( (user) => {                                           // login succeed
            this.dispatch({
                type: ActionTypes.USER_LOGGED_IN_TO_PARSE,
                user: user
            });
            /*if (user.existed()) {*/
                return User.prototype.fbFetchData(credentials);   // request user photo
            /*}*/
        })
        .then( (response) => response.json() )
        .then((responseData) => {
            this.dispatch( {
                type: ActionTypes.FETCH_USER_DATA_REQUEST_SUCCEED,
                name: responseData.name,
                url: responseData.picture.data.url
            });
            return User.prototype.updateName(responseData.name);
        }),
                                // what is .done() ?
        (error) => console.log(error);
    },
    parseLoginAndroid(data) {
        data = Object.assign({}, data, {profile: JSON.parse(data.profile)});

        var credentials = {
            userId : data.profile.id,
            token : data.token,
            tokenExpirationDate : data.expiration
        };

        User.prototype.parseLogin(credentials)                           // login to Parse
            .then( (user) => {                                           // login succeed
                this.dispatch({
                    type: ActionTypes.USER_LOGGED_IN_TO_PARSE,
                    user: user
                });
                return User.prototype.updateName(data.profile.name);
            });

        this.dispatch({
            type: ActionTypes.FETCH_USER_DATA_REQUEST_SUCCEED,
                    name: data.profile.name,
                    url: data.profile.picture.data.url
                });
    },
    onLogout() {
        User.prototype.parseLogout()
            .then(() => {
                this.fbLogout();
                this.dispatch({
                    type: ActionTypes.USER_LOGGED_OUT
                });
        });
    },
    onLoginFound(data) {
        // On LogOut requested do nothing
        if (this.state.user.status == "MENU_ITEM_LOGOUT_PRESSED")
            return;

        // Login to Parse with obtained credentials
        if (this.state.app.isConnected) {
            if (data.credentials) {  // IOS style
                this.parseLoginIOS(data.credentials);
            }
            else {                   // Android style
                this.parseLoginAndroid(data);
            }
        }
        else {
            AsyncStorage.getItem('@Palabras:state')
                .then((resp) => {
                    let offlineState = JSON.parse(resp);
                    if (offlineState.user.parseUser) {
                        offlineState.user.parseUser.id = offlineState.user.parseUser.objectId;
                        offlineState.user.parseUser.get = function(prop) { return offlineState.user.parseUser[prop]};
                        this.dispatch({
                            type: ActionTypes.USER_LOGGED_IN_TO_PARSE,
                            user: offlineState.user.parseUser
                        });
                    }
                });
        }

        //this.dispatch({
        //    type: ActionTypes.USER_LOGIN_FOUND
        //});
    },
    render() {
        var deviceWidth = Dimensions.get('window').width;
        var _this = this;
        var loginButton = this.state.showLoginButton ? (
            <TouchableOpacity
                activeOpacity={1.0}
                style={[styles.FBLoginButton]}
                onPress={this.fbloginStart}
            >
                <Image
                    source={require('../assets/images/fb_login.png')} />
            </TouchableOpacity>
        ) : null;

        return (
            <View style={styles.container}>
                <Image
                    style = {{opacity: 0.8}}
                    source={require('../assets/images/note-pad-1415071-639x1072.jpg')}
                >
                    <Text style={[styles.title]}>
                        Palabras
                    </Text>
                    <Text style={[styles.subtitle]}>
                        My personal dictionary
                    </Text>

                    {/*Login with Facebook button*/}
                    {loginButton}

                </Image>

            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor: globalStyles.container.backgroundColor
    },
    image: {
        width: 470   /*Dimensions.get('window').width*/
    },
    title: {
        color: '#ffffff',
        backgroundColor: 'transparent',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 250,
        /*marginBottom: 20,*/
    },
    subtitle: {
        color: '#ffffff',
        backgroundColor: 'transparent',
        textAlign:'center',
        alignSelf:'center',
        fontSize: 20,
        fontWeight: 'bold',
        margin:50,
        marginBottom: 100
    },
    FBLoginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
