/**
 * Created by alexanderbol on 06/02/2016.
 */
/**
 * Created by alexanderbol on 30/01/2016.
 */
import React from 'react';
var Items = require('../models/items').Items;
var SearchItemPopup = require('../components/searchItemInput').SearchItemPopup;
var DictionaryEditorToolbar = require('../components/dictionaryEditorToolbar').DictionaryEditorToolbar;
var DictionaryEditorLanguageBar = require('../components/dictionaryEditorLanguageBar').DictionaryEditorLanguageBar;
var DictionaryEditorSearchBar = require('../components/dictionaryEditorSearchBar').DictionaryEditorSearchBar;

import * as ActionTypes from '../store/actionTypes';

import {
    Alert,
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    Platform
    } from 'react-native';

// use http://fortawesome.github.io/Font-Awesome/icons/
var Icon = require('react-native-vector-icons/FontAwesome');

var globalStyles = require('../styles/styles').styles;

var intervalId;

export const DictionaryEditorView = React.createClass ({
    getInitialState() {
        return {
        };
    },
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    },
    componentDidMount() {
        var selectedItem = this.state.editState.selectedItem;
        if (selectedItem) {
            this.scrollToItem(selectedItem);
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    componentDidUpdate() {
        // this.scrollToItem();
    },
    updateItem() {
        var item = this.state.editState.selectedItem;
        var itemEdited = this.state.editState.editItem;
        if (item && itemEdited) {
            Items.prototype.updateItem(item)         // save item in db and enable sorting
                .then((item) => {
                    this.scrollToItem(item);
                    /*
                    this.dispatch({
                        type: ActionTypes.ITEM_CHANGE_DONE
                    })*/
                }),
                (error) => {
                    alert("Problems with connection to server");
                }
        }
    },
    toggleSelectItem(item) {
        this.updateItem();     // before switch/unselect update item in database

        this.dispatch({
            type: ActionTypes.SELECT_ITEM_PRESSED,
            item: item
        });
    },
    forceEditItem(item) {
        if (!this.state.app.isConnected) return;
        this.dispatch({
            type: ActionTypes.FORCE_EDIT_ITEM_PRESSED,
            item: item
        });
    },
    onEditItemButtonPressed() {
        /* Disable edit/delete if current user is not an owner of the document */
        // var isOwner = this.state.user.parseUser.id === this.state.app.currentDictionary.get('createdBy').id;
        var isOwner = true;  // allow edit/delete

        this.updateItem();         // before switch to "not edit" update current item in database

        if (isOwner) {
            this.dispatch({
                type: ActionTypes.EDIT_ITEM_BUTTON_PRESSED
            });
        }
        else {
            Alert.alert(
                'Alert',
                `You are not the owner of ${this.state.app.currentDictionary.get('name')}`,
                [
                    {text: 'OK', onPress: () => {}, style: 'cancel'}
                ]
            )
        }
    },

    itemLeftChanged({value}) {
        var item = this.state.editState.selectedItem;
        var langLeft = this.state.app.langLeft.get('name'); // currentDictionary.get('language1').get('name');   // "spanish";
        var langRight = this.state.app.langRight.get('name'); // currentDictionary.get('language2').get('name');  // "russian";

        item.set(langLeft, value);     // update state but don't save while editing not finished

        this.dispatch({
            type: ActionTypes.ITEM_CHANGED,
            item: item
        });

        if (!this.state.editState.autotranslate) return;   // auto translate disabled

        // go google translate
        var source = this.state.app.langLeft.get('lcid').substr(0,2); // currentDictionary.get('language1').get('lcid').substr(0,2);
        var target = this.state.app.langRight.get('lcid').substr(0,2); // currentDictionary.get('language2').get('lcid').substr(0,2);
        this.googleTranslate(value, source, target)
            .then((response) => response.json())
            .then((responseJson) => {

                var translatedValue = responseJson.data.translations[0].translatedText;
                item.set(langRight, translatedValue);     // update state but don't save while editing not finished

                this.dispatch({
                    type: ActionTypes.ITEM_CHANGED,
                    item: item
                });
            })
            .catch((error) => {
                console.error(error);
            });

    },
    itemRightChanged({value}) {
        var item = this.state.editState.selectedItem;
        var langLeft = this.state.app.langLeft.get('name'); // currentDictionary.get('language1').get('name');   // "spanish";
        var langRight = this.state.app.langRight.get('name'); // currentDictionary.get('language2').get('name');  // "russian";

        item.set(langRight, value);     // update state but don't save while editing not finished
        this.dispatch({
            type: ActionTypes.ITEM_CHANGED,
            item: item
        });

        if (!this.state.editState.autotranslate) return;   // auto translate disabled

        // go google translate
        var source = this.state.app.langRight.get('lcid').substr(0,2); // currentDictionary.get('language2').get('lcid').substr(0,2);
        var target = this.state.app.langLeft.get('lcid').substr(0,2); // currentDictionary.get('language1').get('lcid').substr(0,2);
        this.googleTranslate(value, source, target)
            .then((response) => response.json())
            .then((responseJson) => {
                // return responseJson.movies;
                var translatedValue = responseJson.data.translations[0].translatedText;
                item.set(langLeft, translatedValue);     // update state but don't save while editing not finished

                this.dispatch({
                    type: ActionTypes.ITEM_CHANGED,
                    item: item
                });
            })
            .catch((error) => {
                console.error(error);
            });


    },
    itemChangeDone() {
        var item = this.state.editState.selectedItem;
        Items.prototype.updateItem(item)         // save item in db and enable sorting
            .then( (item) => {
                this.dispatch({
                    type: ActionTypes.ITEM_CHANGE_DONE
                })
            }),
            (error) => {
                alert("Problems with connection to server");
            }
    },
    googleTranslate(value,source,target) {
        const url = 'https://www.googleapis.com/language/translate/v2';
        const apiKey = 'AIzaSyDBPG8spZ7NXjOuiljdt_WBwetnyWShfR4';
        const urlString = `${url}?key=${apiKey}&q=${value}&source=${source}&target=${target}`;
        // fetch('https://www.googleapis.com/language/translate/v2?key=AIzaSyDBPG8spZ7NXjOuiljdt_WBwetnyWShfR4&q=hello%20world&source=en&target=de')
        return fetch(urlString)
    },
    onDeleteItemButtonPressed() {
        var item = this.state.editState.selectedItem;
        if (!item) return;

        /* Disable edit/delete if current user is not an owner of the document */
        // var isOwner = this.state.user.parseUser.id === this.state.app.currentDictionary.get('createdBy').id;
        var isOwner = true;  // allow edit/delete

        if (isOwner) {
            var item = this.state.editState.selectedItem;
            var langLeft = this.state.app.langLeft.get('name'); // currentDictionary.get('language1').get('name');   // "spanish";
            var langRight = this.state.app.langRight.get('name'); // currentDictionary.get('language2').get('name');  // "russian";
            Alert.alert(
                'Are you sure?',
                `Item ${item.get(langLeft)} - ${item.get(langRight)} will be deleted`,
                [
                    {text: 'Cancel', onPress: () => { }, style: 'cancel'},
                    {text: 'OK', onPress: () => this.deleteItem()}
                ]
            )
        }
        else {
            Alert.alert(
                'Alert',
                `You are not the owner of ${this.state.app.currentDictionary.get('name')}`,
                [
                    {text: 'OK', onPress: () => {}, style: 'cancel'}
                ]
            )
        }
    },
    deleteItem() {
        var item = this.state.editState.selectedItem;
        Items.prototype.deleteItem(item)
            .then( (item) => {
                this.dispatch({
                    type: ActionTypes.DELETE_ITEM_REQUEST_SUCCEED,
                    item: item
                })
            },
            (error) => {
                alert("Problems with connection to server");
            });

    },
    onAddNewItemButtonPressed() {
        this.updateItem();        // before add new item update selected item in database

        var dictionary = this.state.app.currentDictionary;
        var language1 = dictionary.get('language1').get('name');
        var language2 = dictionary.get('language2').get('name');

        Items.prototype.addEmptyItem(dictionary, language1, language2)
            .then( (item) => {
                this.dispatch({
                    type: ActionTypes.ADD_NEW_ITEM_REQUEST_SUCCEED,
                    item: item
                })
            },
            (error) => {
                alert("Problems with connection to server");
            });
        // Scroll to top of list view
        this.refs.itemsList.getScrollResponder().scrollTo({x:0, y:0, animated: true})
    },
    onSayItButtonPressed() {
        var item = this.state.editState.selectedItem;
        if (!item) return;
        var langLeft = this.state.app.langLeft; // currentDictionary.get('language1');
        var langRight = this.state.app.langRight; // currentDictionary.get('language2');

        if (Platform.OS === 'android') {
            this.sayItAndroid(item, langLeft, langRight);
        }
        else if (Platform.OS === 'ios') {
            this.sayItIOS(item, langLeft, langRight);
        }
    },
    onGoWebButtonPressed() {       // go search web for additional info
        if (!this.state.editState.selectedItem) return;

        this.updateItem();       // before go web update selected item

        this.dispatch({
            type: ActionTypes.GO_WEB_BUTTON_PRESSED,
            item: this.state.editState.selectedItem
        })
    },
    sayItAndroid(item, lang1, lang2) {
        var intervalId;
        Items.prototype.sayItAndroid(item, lang1)
            .then(isSpeaking => {
                intervalId = setTimeout(() => {
                    Items.prototype.sayItAndroid(item, lang2)
                        .then( isSpeaking => {
                            clearTimeout(intervalId)
                        })
                        .catch((error) => console.log(error));
                }, 2500);
            })
            .catch((error) => console.log(error));
    },
    sayItIOS(item, lang1, lang2) {
        var intervalId;
        Items.prototype.sayItIOS(item, lang1)
            .then(started => {
                intervalId = setTimeout(() => {
                    Items.prototype.sayItIOS(item, lang2)
                        .then( started => {
                            clearTimeout(intervalId)
                        }),
                        (error) => console.log(error);
                }, 2000);
            }),
            (error) => console.log(error);
    },
    // Scroll to selected item
    scrollToItem(targetItem) {
        if (!targetItem) return;
        if (!this.refs.itemsList) return;

        var scroller = this.refs.itemsList.getScrollResponder();
        var metrics = this.refs.itemsList.getMetrics();
        var index = this.state.items.findIndex(item => item.id == targetItem.id);
        if (metrics && metrics.contentLength &&
            metrics.contentLength > 0 && metrics.renderedRows > 0) {
            var y = (metrics.contentLength / metrics.renderedRows) * index;
            // var y = Math.max(47 * index - 100, 0);

            scroller.scrollTo({x: 0, y: y, animated: true})
        }
    },
    onLeftSortButtonPressed() {
        this.setSortedBy("leftLanguage");
    },
    onRightSortButtonPressed() {
        this.setSortedBy("rightLanguage");
    },
    setSortedBy(sortedBy) {
        this.dispatch({
            type: ActionTypes.BUTTON_SORTED_BY_PRESSED,
            sortedBy: sortedBy
        });
    },
    onLeftSearchInputGotFocus() {
        this.onLeftSortButtonPressed();  // force sort before search
        this.dispatch({
            type: ActionTypes.LEFT_SEARCH_INPUT_GOT_FOCUS
        });
    },
    onRightSearchInputGotFocus() {
        this.onRightSortButtonPressed(); // force sort before search
        this.dispatch({
            type: ActionTypes.RIGHT_SEARCH_INPUT_GOT_FOCUS
        });
    },
    leftSearchPatternChanged({text}) {
        if (text != "") {
            var leftSearchPattern = text;
            var langLeft = this.state.app.langLeft.get('name'); // currentDictionary.get('language1').get('name');   // "spanish";
            var targetItem = this.state.items.find((item) => {
                if (item.get(langLeft) !== undefined && item.get(langLeft).indexOf(leftSearchPattern) == 0) {
                    return true;
                }
                return false;
            });
            this.scrollToItem(targetItem);
        }

        this.dispatch({
            type: ActionTypes.LEFT_SEARCH_PATTERN_CHANGED,
            leftSearchPattern: text
        })

    },
    rightSearchPatternChanged({text}) {
        if (text != "") {
            var rightSearchPattern = text;
            var langRight = this.state.app.langRight.get('name'); // currentDictionary.get('language2').get('name');  // "russian";
            var targetItem = this.state.items.find((item) => {
                if (item.get(langRight) !== undefined && item.get(langRight).indexOf(rightSearchPattern) == 0) {
                    return true;
                }
                return false;
            });
            this.scrollToItem(targetItem);
        }

        this.dispatch({
            type: ActionTypes.RIGHT_SEARCH_PATTERN_CHANGED,
            rightSearchPattern: text
        })

    },
    onLeftCleanSearchPatternPressed() {
        var type = ActionTypes.LEFT_CLEAN_SEARCH_PATTERN_PRESSED;
        this.dispatch({
            type: type
        })
    },
    onRightCleanSearchPatternPressed() {
        this.dispatch({
            type: ActionTypes.RIGHT_CLEAN_SEARCH_PATTERN_PRESSED
        })
    },
    onLeftToggleSearchButtonPressed() {
        this.dispatch({
            type: ActionTypes.LEFT_TOGGLE_SEARCH_BUTTON_PRESSED
        })
    },
    onRightToggleSearchButtonPressed() {
        this.dispatch({
            type: ActionTypes.RIGHT_TOGGLE_SEARCH_BUTTON_PRESSED
        })
    },
    onSwitchLanguagePanelsPressed() {
        this.dispatch({
            type: ActionTypes.SWITCH_LANGUAGE_PANELS_PRESSED
        })
    },
    renderHeader() {
        var langLeftLocalName = this.state.app.langLeft.get('localName');
        var langRightLocalName = this.state.app.langRight.get('localName');
        var isLeftRtl = this.state.app.langLeft.get('rtl');
        var isRightRtl = this.state.app.langRight.get('rtl');
        var iconSortStyleLeft = this.state.editState.sortedBy == "leftLanguage" ?
            styles.iconSortActive : styles.iconSortDimmed;
        var iconSortStyleRight = this.state.editState.sortedBy == "rightLanguage" ?
            styles.iconSortActive : styles.iconSortDimmed;

        var buttonDisabled = this.state.editState.selectedItem ? false : true;

        var editorLanguageBar = (
            <DictionaryEditorLanguageBar
                langLeft = {langLeftLocalName}
                langRight = {langRightLocalName}
                iconSortStyleLeft = {iconSortStyleLeft}
                iconSortStyleRight = {iconSortStyleRight}
                onLeftSortButtonPressed = {this.onLeftSortButtonPressed}
                onRightSortButtonPressed = {this.onRightSortButtonPressed}
                onSwitchLanguagePanelsPressed = {this.onSwitchLanguagePanelsPressed}
            />
        );

        /* Edit Item Toolbar opened when item selected */
        var editorToolbar = (
            <DictionaryEditorToolbar
                onEditItemButtonPressed = {this.onEditItemButtonPressed}
                onSayItButtonPressed = {this.onSayItButtonPressed}
                onGoWebButtonPressed = {this.onGoWebButtonPressed}
                onDeleteItemButtonPressed = {this.onDeleteItemButtonPressed}
                buttonDisabled = {buttonDisabled}
                isConnected = {this.state.app.isConnected}
            />
        );

        var editorSearchBar = (
            <DictionaryEditorSearchBar
                leftSearchEnabled={this.state.editState.leftSearchEnabled}
                leftSearchPattern={this.state.editState.leftSearchPattern}
                leftRtl = {isLeftRtl}
                leftSearchPatternChanged={(text) => this.leftSearchPatternChanged({text})}
                onLeftSearchInputGotFocus={this.onLeftSearchInputGotFocus}
                onLeftCleanSearchPatternPressed={this.onLeftCleanSearchPatternPressed}
                onLeftToggleSearchButtonPressed={this.onLeftToggleSearchButtonPressed}
                rightSearchEnabled={this.state.editState.rightSearchEnabled}
                rightSearchPattern={this.state.editState.rightSearchPattern}
                rightRtl = {isRightRtl}
                rightSearchPatternChanged={(text) => this.rightSearchPatternChanged({text})}
                onRightSearchInputGotFocus={this.onRightSearchInputGotFocus}
                onRightCleanSearchPatternPressed={this.onRightCleanSearchPatternPressed}
                onRightToggleSearchButtonPressed={this.onRightToggleSearchButtonPressed}
            />
        );

        return (
            <View style={styles.editorHeader}>
                {editorToolbar}
                {editorLanguageBar}
                {editorSearchBar}
            </View>
        )
    },
    renderRow(item) {
        var langLeft = this.state.app.langLeft.get('name');
        var langRight = this.state.app.langRight.get('name');
        var isSelectedItem = this.state.editState.selectedItem && item.id == this.state.editState.selectedItem.id;
        var style = isSelectedItem ?
            [styles.itemContainer, styles.itemSelected] : [styles.itemContainer, styles.itemUnselected];

        var isLeftRtl = this.state.app.langLeft.get('rtl');
        var isRightRtl = this.state.app.langRight.get('rtl');
        var leftAlign = isLeftRtl ? 'right' : 'left';
        var rightAlign = isRightRtl ? 'right' : 'left';

        var itemLeftValue = item.get(langLeft);
        var itemRightValue = item.get(langRight);

        return (
            <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => this.toggleSelectItem(item)}
                onLongPress={() => this.forceEditItem(item)}>
                {
                    isSelectedItem && this.state.editState.editItem ? (
                        <View style={style}>
                            <TextInput
                                style={[styles.editItem, {textAlign: leftAlign}]}
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                                value={itemLeftValue}
                                onChangeText={(value) => this.itemLeftChanged({value})}
                                onBlur = {() => this.itemChangeDone()}
                            />
                            <TextInput
                                style={[styles.editItem, {textAlign: rightAlign}]}
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                                value={itemRightValue}
                                onChangeText={(value) => this.itemRightChanged({value})}
                                onBlur = {() =>this.itemChangeDone()}
                            />
                        </View>
                    ) : (
                        <View style={style}>
                            <Text style={[styles.item, {textAlign: leftAlign}]}>
                                {itemLeftValue}
                            </Text>
                            <Text style={[styles.item, {textAlign: rightAlign}]}>
                                {itemRightValue}
                            </Text>
                        </View>
                    )
                }
            </TouchableOpacity>
        )
    },
    render() {
        var langLeft = this.state.app.langLeft.get('name');
        var langRight = this.state.app.langRight.get('name');
        var sortedBy = this.state.editState.sortedBy;
        var sortedItems = [];
        if (this.state.editState.sortEnabled) {
            if (this.state.app.isConnected) {
                sortedItems = Items.prototype.sortItems(this.state.items, sortedBy, langLeft, langRight);
            }
            else {
                sortedItems = Items.prototype.sortItemsOffline(this.state.items, sortedBy, langLeft, langRight);
            }
        }
        else {
            sortedItems = this.state.items.slice();
        }

        filteredItems = sortedItems.slice();
        /*
        var filteredItems = sortedItems.filter( (item) => {
            if (item.get(langLeft) !== undefined && item.get(langLeft).indexOf(leftSearchPattern) == 0 &&
                item.get(langRight) !== undefined && item.get(langRight).indexOf(rightSearchPattern) == 0) {
                return true;
            }
            return false;
        });
*/
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(filteredItems);

        var sectionHeader = this.renderHeader();

        return (
            <View style={styles.contentContainer}>
                {sectionHeader}
                <ListView ref='itemsList'
                    dataSource={dataSource}
                    initialListSize = {20}
                          enableEmptySections = {true}
                    renderRow={(item) => this.renderRow(item)}
                />

                {this.state.app.isConnected ? (
                    <TouchableOpacity style={styles.addItemButton}
                                         activeOpacity={1.0}
                                         onPress={() => this.onAddNewItemButtonPressed()}>
                        <Icon
                            name='plus-circle'
                            size={50}
                            color='#81c04d'
                            style={globalStyles.iconAdd}
                        />
                    </TouchableOpacity>
                ) : null
                }
            </View>
        );
    }
});

var styles = StyleSheet.create({
    contentContainer: {
        flex:8,
        backgroundColor: '#F5FCFF',
    },
    editorHeader: {
        backgroundColor: '#F5FCFF'
    },
    sortToolbarContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        /*borderWidth: 1,
        borderColor: '#81c04d'*/
    },
    languageTitle: {
        flex:1,
        marginLeft:5,
        paddingRight:10,
        marginVertical: 5,
        textAlign:'left',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        borderWidth: globalStyles.item.borderWidth,
        borderColor: globalStyles.item.borderColor,
        alignItems: 'center',
    },
    itemUnselected: {
        backgroundColor: globalStyles.item.backgroundColor
    },
    itemSelected: {
        backgroundColor: globalStyles.itemSelected.backgroundColor
    },
    item: {
        flex:1,
        fontSize: 15,
        alignItems: 'center',
        textAlignVertical: 'center'
    },
    editItem: {
        flex:1,
        height: 40,
        margin:5,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    addItemButton: {
        position: 'absolute',
        right: 40,
        bottom: 120
    },
    iconAddItem: {
        width: 50,
        height: 50,
        elevation: 1,
        shadowColor:'darkgray',
        shadowOpacity: 0.8,
        shadowRadius: 4,
        shadowOffset: {
            height:0,
            width:0
        }
    },
    iconSortActive: {
        width:30,
        height: 30,
        opacity: 1.0
    },
    iconSortDimmed: {
        width:30,
        height: 30,
        opacity: 0.5
    },
    leftSearchPopup: {
        left: 20,
    },
    rightSearchPopup: {
        left: 220,
    },
});
