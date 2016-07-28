/**
 * Created by alexanderbol on 21/01/2016.
 */

var Platform = require('react-native').Platform;
if (Platform.OS === 'android') {
    var Speech = require('react-native-android-speech')
}
else {
    var Speech = require('react-native-speech');
}
var Parse = require('parse/react-native');

// Parse.initialize("nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H", "IDxfUbmW9AIn7iej2PAC7FtDAO1KvSdPuqP18iyu");
Parse.initialize('nNSG5uA8wGI1tWe4kaPqX3pFFplhc0nV5UlyDj8H', 'unused');
Parse.serverURL = 'https://palabras99.herokuapp.com/parse';

export class Items extends Parse.Object {
    constructor(ItemsClassName) {
        super(ItemsClassName);     // ('Dictionaries');     // Pass the ClassName to the Parse.Object constructor
    }

    fetch() {
        var localeQuery = new Parse.Query(this.className);
        return localeQuery.find();
    }

    fetchPage(numInPage, numToSkip) {
        var localeQuery = new Parse.Query(this.className)
            .limit(numInPage)
            .skip(numToSkip);
        return localeQuery.find();
    }

    addEmptyItem(dictionary, language1, language2) {
        var pref = '';
        if (dictionary.id.charAt(0) >= '0' && dictionary.id.charAt(0) <= '9') {
            pref = 'a';
        }
        var itemsClassName = pref + dictionary.id;
        var item = new Items(itemsClassName);

        //var selectedCategory = this.get('categories').findWhere({"category": this.get('selectedCategory')});
        //if (selectedCategory) {
        //    item.set({
        //        category_id: selectedCategory.get('category_id'),
        //        category: selectedCategory.get('category')
        //    });
        //}

        // http://stackoverflow.com/questions/9640253/how-to-set-a-dynamic-property-on-a-model-with-backbone-js
        // es6 object literal computed property
        var map = {
            [language1]:'',
            [language2]:''
        };
        /*
        map[language1] = '';
        map[language2] = '';*/
        item.set(map);

        return item.save();             // save to cloud and trigger event "added" on success
    }

    updateItem(item) {
        return item.save();
    }

    deleteItem(item) {
        return item.destroy();
    }

    getFiltered(items, filter) {
        return items;
    }

    getLearnItems(items, maxnum) {
        var leftItems = Items.prototype.getRandom(items, maxnum);
        var rightItems = Items.prototype.shuffle(leftItems);
        return {leftItems, rightItems};
    }

    getRandom(items, maxnum) {
        var newItems = [];
        var inds = [];

        if (items.length <= maxnum) {
            items.forEach((item) => newItems.push(item));
            return newItems;
        }

        while (inds.length < maxnum) {
            let i = Math.floor((Math.random() * (items.length - 1)) + 1);
            if (inds.indexOf(i) == -1) {
                inds.push(i);
            }
        }

        inds.forEach((i) => newItems.push(items[i]));

        return newItems;
    }

    // http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    shuffle(items) {
        var newItems = items.slice();
        var counter = newItems.length, temp, index;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            temp = newItems[counter];
            newItems[counter] = newItems[index];
            newItems[index] = temp;
        }

        return newItems;
    }

    sortItems(items, sortedBy, langLeft, langRight) {
        return items.sort((item1, item2) => {
            let val1 = sortedBy == "leftLanguage" ? item1.get(langLeft) : item1.get(langRight);
            let val2 = sortedBy == "leftLanguage" ? item2.get(langLeft) : item2.get(langRight);

            if (val1 > val2) {
                return 1;
            }
            if (val1 < val2) {
                return -1;
            }
            if (val1 == val2) {
                return 0;
            }
        });
    }

    sayItAndroid(item, language) {
        var langName = language.get('name');
        var voice = language.get('lcid');
        var pitch = 1.5;   // Optional Parameter to set the pitch of Speech,
        return Speech.speak({
            text: item.get(langName),
            forceStop: false,
            language: voice
        });
    }

    sayItIOS(item, language) {
        var langName = language.get('name');
        var voice = language.get('lcid');
        return Speech.speak({
            text: item.get(langName),
            voice: voice,
            rate: 0.4
        });
    }
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