/**
 * Created by alexanderbol on 22/02/2016.
 */
var Parse = require('parse/react-native');

Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");

var FB_PHOTO_WIDTH = 200;

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

        Parse.FacebookUtils.logIn(authData, {
            success: (user) => {
                if (user.existed()) {
                    console.log("user existed");
                }
            }
        })

    }

    fbFetchPhoto(credentials) {
        var api = `https://graph.facebook.com/v2.3/${credentials.userId}/picture?width=${FB_PHOTO_WIDTH}&redirect=false&access_token=${credentials.token}`;

        return fetch(api);
        /*
        .then( (response) => response.json() )
        .then((responseData) => {
            console.log(responseData);
        })
        .done();
*/
    }
}
