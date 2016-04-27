/**
 * Created by alexanderbol on 22/02/2016.
 */
var Parse = require('parse/react-native');

// Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");
Parse.initialize('nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H', 'unused');
Parse.serverURL = 'https://palabras99.herokuapp.com/parse';

var FB_PHOTO_WIDTH = 50;

export class User extends Parse.Object {
    constructor() {
        super('User');     // Pass the ClassName to the Parse.Object constructor
    }

    parseLogin(credentials) {
        if (!credentials)
            return;

        var authData = {
            id: credentials.userId,
            access_token: credentials.token,
            expiration_date: credentials.tokenExpirationDate
        };

        return Parse.FacebookUtils.logIn(authData);     // return promise
    }

    parseLogout() {
        return Parse.User.logOut();
    }

    fbFetchData(credentials) {
        var api = `https://graph.facebook.com/v2.3/${credentials.userId}?fields=name,picture&width=${FB_PHOTO_WIDTH}&redirect=false&access_token=${credentials.token}`;

        return fetch(api);                             // return promise

    }

    updateName(name) {
        var user = Parse.User.current();
        if (user) {
            user.set({
                "name": name
            });
        }
        return user.save();
    }
}
