/**
 * Created by alexanderbol on 26/02/2016.
 */
var Parse = require('parse/react-native');

Parse.initialize('nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H', 'unused');
Parse.serverURL = 'https://palabras99.herokuapp.com/parse';

export class Languages extends Parse.Object {
    constructor() {
        super('Language');     // Pass the ClassName to the Parse.Object constructor
    }
    static fetch() {
        var localeQuery = new Parse.Query(Languages);
        return localeQuery.find();
    }
}
