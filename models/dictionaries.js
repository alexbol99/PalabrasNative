/**
 * Created by alexanderbol on 16/01/2016.
 */
// var Parse = require('parse').Parse;
var Parse = require('parse/react-native');

// Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");
Parse.initialize('nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H', 'unused');
Parse.serverURL = 'https://palabras99.herokuapp.com/parse';

export class Dictionaries extends Parse.Object {
    constructor() {
        super('Dictionaries');     // Pass the ClassName to the Parse.Object constructor
    }
    fetch(user) {
        var localeQuery = new Parse.Query('Dictionaries')
            .include('language1')
            .include('language2')
            .include('createdBy')
            .equalTo("createdBy", user);
        return localeQuery.find();
    }

    updateDictionary(dictionary) {
        return dictionary.save();
    }

    updateName(dictionary, name) {
        dictionary.set({
            "name": name
        });
        return dictionary.save();
    }

    createEmptyDictionary (user, language1, language2) {
        var dictionary = new Dictionaries();
        dictionary.set({
            "createdBy": user,
            "language1": language1,
            "language2": language2
        });
        return dictionary.save();
    }

    deleteDictionary(dictionary) {
        return dictionary.destroy();
    }
}
