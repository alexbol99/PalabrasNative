/**
 * Created by alexanderbol on 26/02/2016.
 */
var Parse = require('parse/react-native');

Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");

export class Shares extends Parse.Object {
    constructor() {
        super('Share');     // Pass the ClassName to the Parse.Object constructor
    }
    fetch(user) {
        var localeQuery = new Parse.Query(Shares)
            .equalTo("user", user)
            .include("dictionary")
            .select("dictionary");
        return localeQuery.find();
    }
}
