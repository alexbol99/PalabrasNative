/**
 * Created by alexanderbol on 21/02/2016.
 */
var React = require('react-native');
var User = require('../models/user').User;
import * as ActionTypes from '../store/actionTypes';
var globalStyles = require('../styles/styles').styles;
var Dimensions = require('Dimensions');

var {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    Platform,
    Image
    } = React;

var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

export const LoginView = React.createClass({
    getInitialState() {
        return {
        };
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;

        // On LogOut requested do nothing
        if (this.props.store.getState().user.status != "MENU_ITEM_LOGOUT_PRESSED") {
            /* On Android use FBLoginManager because for some reason
            FBLogin component does not trigger "login found" event */
            if (Platform.OS === 'android' && FBLoginManager.loginWithPermissions) {
                FBLoginManager.loginWithPermissions(["email", "user_friends"],
                    (error, data) => {
                        if (!error) {
                            // for some reason data.profile obtained stringified
                            this.onLoginFound(Object.assign({}, data, {profile: JSON.parse(data.profile)}));
                        }
                        else {
                            console.log(error);
                        }
                    })
            }
        }
        this.setState(this.props.store.getState());

    },
    componentDidMount() {
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
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
    onLogin(data) {
        // Login to Parse with obtained credentials
        if (data.credentials) {  // IOS style
            this.parseLoginIOS(data.credentials);
        }
        else {                   // Android style
            this.parseLoginAndroid(data);
        }
        this.dispatch({
            type: ActionTypes.USER_LOGGED_IN
        });
    },
    onLogout() {
        User.prototype.parseLogout()
            .then(() => {
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
        if (data.credentials) {  // IOS style
            this.parseLoginIOS(data.credentials);
        }
        else {                   // Android style
            this.parseLoginAndroid(data);
        }

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
        var loginBehaviour = FBLoginManager.LoginBehaviors ? FBLoginManager.LoginBehaviors.SystemAccount : undefined;
        var deviceWidth = Dimensions.get('window').width;

        return (
            <View style={styles.container}>
                <Image
                    style={{ width: 360 }}
                    source={require('../assets/images/palabra-470x346.jpg')}
                />
                <Text style={styles.title}>
                    Create you dictionary
                </Text>
                <Text style={styles.title}>
                    Learn new words
                </Text>
                <Text style={styles.title}>
                    Share with your friends
                </Text>
                <FBLogin style={styles.loginButton}
                         permissions={["user_friends"]}
                         loginBehavior={loginBehaviour}
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
    image: {
        width: 470   /*Dimensions.get('window').width*/
    },
    loginButton: {
        flex:1,
    },
    title: {
        color: 'gray',
        textAlign:'center',
        alignSelf:'center',
        fontSize: 20,
        margin:2,
        marginBottom: 20
    },
    subtitle: {
        fontSize: 35,
        color: '#ffffff',
        textAlign:'center',
        alignSelf:'center',
        marginTop: 75,
        marginBottom: 250
    }

});
/*
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
*/
