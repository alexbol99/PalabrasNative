/**
 * Created by alexanderbol on 21/02/2016.
 */
var React = require('react-native');
var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;
var User = require('../models/user').User;

import * as ActionTypes from '../store/actionTypes';
var globalStyles = require('../styles/styles').styles;

var {
    Text,
    StyleSheet,
    View,
    TouchableHighlight
    } = React;

export const LoginView = React.createClass({
    getInitialState() {
        return {
        };
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    },
    componentDidMount() {
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    parseLogin(credentials) {
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
        })
        .done(),                        // what is .done() ?
        (error) => console.log(error);
    },
    onLogin(data) {
        // Login to Parse with obtained credentials
        this.parseLogin(data.credentials);

        this.dispatch({
            type: ActionTypes.USER_LOGGED_IN
        });
    },
    onLogout() {
        this.dispatch({
            type: ActionTypes.USER_LOGGED_OUT
        });
    },
    onLoginFound(data) {
        this.parseLogin(data.credentials);

        this.dispatch({
            type: ActionTypes.USER_LOGIN_FOUND
        });
    },
    onLoginNotFound() {
        this.dispatch({
            type: ActionTypes.USER_LOGIN_NOT_FOUND
        });
    },
    onError(data) {
        this.dispatch({
            type: ActionTypes.USER_LOGIN_ERROR,
            data:data
        });
        alert(ActionTypes.USER_LOGIN_ERROR);
    },
    onCancel() {
        this.dispatch({
            type: ActionTypes.USER_LOGIN_CANCELLED
        });
        alert(ActionTypes.USER_LOGIN_CANCELLED);
    },
    onPermissionMissing(data) {
        this.dispatch({
            type: ActionTypes.USER_LOGIN_MISSING_PERMISSIONS,
            data: data
        });
        alert(ActionTypes.USER_LOGIN_MISSING_PERMISSIONS);
    },
    render() {
        var _this = this;
        return (
            <View style={styles.container}>
                <FBLogin style={styles.loginButton}
                         permissions={["email","user_friends"]}
                         loginBehavior={FBLoginManager.LoginBehaviors.SystemAccount}
                         onLogin={(data) => this.onLogin(data)}
                         onLogout={this.onLogout}
                         onLoginFound={(data) => this.onLoginFound(data)}
                         onLoginNotFound={this.onLoginNotFound}
                         onError={(data) => this.onError(data)}
                         onCancel={this.onCancel}
                         onPermissionsMissing={(data) => this.onPermissionMissing(data)}
                />
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
    loginButton: {
        marginBottom: 10,
        marginTop: 40
    }

});
