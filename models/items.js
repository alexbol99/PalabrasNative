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

    addEmptyItem() {
        var item = new Item();

        //var selectedCategory = this.get('categories').findWhere({"category": this.get('selectedCategory')});
        //if (selectedCategory) {
        //    item.set({
        //        category_id: selectedCategory.get('category_id'),
        //        category: selectedCategory.get('category')
        //    });
        //}

        //var dictionary = app.get("currentDictionary");
        //var language1 = dictionary.get('language1').get('name');
        //var language2 = dictionary.get('language2').get('name');
        // http://stackoverflow.com/questions/9640253/how-to-set-a-dynamic-property-on-a-model-with-backbone-js
        //var map = {};
        //map[language1] = '';
        //map[language2] = '';
        //item.set(map);

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

    sayItInLanguage(item, language) {
        var langName = language.get('name');
        var voice = language.get('lcid');
        if (Speech && voice) {
            Speech.speak({
                text: item.get(langName),
                voice: voice
            });
        }
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