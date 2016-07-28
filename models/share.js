/**
 * Created by alexanderbol on 26/02/2016.
 */
var Parse = require('parse/react-native');

// Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");
Parse.initialize('nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H', 'unused');
Parse.serverURL = 'https://palabras99.herokuapp.com/parse';

export class Shares extends Parse.Object {
    constructor() {
        super('Share');     // Pass the ClassName to the Parse.Object constructor
    }
    static fetch(user) {
        var localeQuery = new Parse.Query(Shares)
            .equalTo("user", user)
            .include("dictionary")
            .include("dictionary.createdBy")
            .select("dictionary");
        return localeQuery.find();
    }

    static findShares(dictionary) {
        var sharedQuery = new Parse.Query(Shares)
            .equalTo("dictionary", dictionary);

        return sharedQuery.find();
    }

    // destroy all share records related to this dictionary
    static deleteShared(dictionary) {
        var sharedQuery = new Parse.Query(Shares)
            .equalTo("dictionary", dictionary);

        sharedQuery.find()
            .then( (respArr) =>
                respArr.forEach( (share) => share.destroy() )
            )
    }

    // add dictionary to current user shared dictionaries
    static share(user, dictionary) {
        if (!dictionary)
            return;
        // do not add to shared if dictionary was created by current user
        if (user.id == dictionary.get('createdBy').id)
            return;

        var share = new Shares();
        share.set({
            user: user,
            dictionary: dictionary
        });

        var query = new Parse.Query(Shares)
            .equalTo('user', share.get('user'))
            .equalTo('dictionary', share.get('dictionary'));

        /* Add unique if not exist */
        query.count()
            .then( (count) => {
                if (count == 0) {
                    return share.save();
                }
            })
    }
}
