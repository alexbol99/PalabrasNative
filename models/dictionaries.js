/**
 * Created by alexanderbol on 16/01/2016.
 */
// var Parse = require('parse').Parse;
var Parse = require('parse/react-native');

Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");

export class Dictionaries extends Parse.Object {
    constructor() {
        super('Dictionaries');     // Pass the ClassName to the Parse.Object constructor
    }
    fetch() {
        var localeQuery = new Parse.Query(Dictionaries)
            .include('language1')
            .include('language2')
            .include('createdBy');
        return localeQuery.find();
    }
}
