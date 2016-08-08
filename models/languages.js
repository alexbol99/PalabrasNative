/**
 * Created by alexanderbol on 26/02/2016.
 */
var Platform = require('react-native').Platform;
if (Platform.OS === 'android') {
    var Speech = require('react-native-android-speech');
}
else {
    var Speech = require('react-native-speech');
}

var Parse = require('parse/react-native');

Parse.initialize('nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H', 'unused');
Parse.serverURL = 'https://palabras99.herokuapp.com/parse';

export class Languages extends Parse.Object {
    constructor() {
        super('Language');     // Pass the ClassName to the Parse.Object constructor
    }
    static fetch() {
        var localeQuery = new Parse.Query(Languages)
            .ascending('name');
        return localeQuery.find();
    }
    static getLocales() {
        if (Platform.OS === 'android') {
            return Speech.getLocales();
        }
        else {
            return Speech.supportedVoices();  // ["ar-SA", "en-ZA", "nl-BE", "en-AU", "th-TH", ...]
        }
    }
    static isSpeechSupported(language, locales) {
        // return locales.includes(language);
        var locale = locales.find(
            (locale) => {
                return language.get('lcid').substr(0,2) == locale.substr(0,2);
            }
        );
        return locale != undefined;
    }
}
