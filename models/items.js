/**
 * Created by alexanderbol on 21/01/2016.
 */

var Speech = require('react-native-speech');
var Parse = require('parse/react-native');

Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");

export class Items extends Parse.Object {
    constructor(ItemsClassName) {
        super(ItemsClassName);     // ('Dictionaries');     // Pass the ClassName to the Parse.Object constructor
    }

    fetch() {
        var localeQuery = new Parse.Query(this.className);
        return localeQuery.find();
    }
/*
    sync(selectionMode, category, numWeeksBefore, orderedBy) {
        if (selectionMode == "all") {
            var numTiksBefore = (numWeeksBefore * 7 * 24 * 3600 * 1000);
            var currentDate = new Date();
            var newItemsDate = new Date(currentDate.getTime() - (numTiksBefore));

            this.query.greaterThanOrEqualTo("createdAt", newItemsDate);
            if (this.query._where.category) {
                delete this.query._where.category;
            }
            this.query.limit(1000); // limit to at most 1000 results
        }
        else {
            this.query.equalTo("category", category);
            if (this.query._where.createdAt) {
                delete this.query._where.createdAt
            }
        }

        this.query.ascending(orderedBy);    // "spanish");

        return this.fetch({reset: true});

    }
*/
}

/*
Speech.speak({
    text: 'שלום ישראל',
    voice: 'he-IL'
});
Speech.supportedVoices()
    .then(locales => {
        console.log(locales); // ["ar-SA", "en-ZA", "nl-BE", "en-AU", "th-TH", ...]
    });

*/