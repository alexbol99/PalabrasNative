/**
 * Created by alexanderbol on 06/02/2016.
 */
/**
 * Created by alexanderbol on 30/01/2016.
 */
import React from 'react';
var Items = require('../models/items').Items;
var SearchItemPopup = require('../components/searchItemPopup').SearchItemPopup;

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

export const EditContentComponent = React.createClass ({
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
                    this.dispatch({
                        type: ActionTypes.ITEM_CHANGE_DONE
                    })
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
        var langLeft = this.state.app.currentDictionary.get('language1').get('name');   // "spanish";
        item.set(langLeft, value);     // update state but don't save while editing not finished
        this.dispatch({
            type: ActionTypes.ITEM_CHANGED,
            item: item
        });
    },
    itemRightChanged({value}) {
        var item = this.state.editState.selectedItem;
        var langRight = this.state.app.currentDictionary.get('language2').get('name');  // "russian";
        item.set(langRight, value);     // update state but don't save while editing not finished
        this.dispatch({
            type: ActionTypes.ITEM_CHANGED,
            item: item
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
    onDeleteItemButtonPressed() {
        var item = this.state.editState.selectedItem;
        if (!item) return;

        /* Disable edit/delete if current user is not an owner of the document */
        // var isOwner = this.state.user.parseUser.id === this.state.app.currentDictionary.get('createdBy').id;
        var isOwner = true;  // allow edit/delete

        if (isOwner) {
            var item = this.state.editState.selectedItem;
            var langLeft = this.state.app.currentDictionary.get('language1').get('name');   // "spanish";
            var langRight = this.state.app.currentDictionary.get('language2').get('name');  // "russian";
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
        var lang1 = this.state.app.currentDictionary.get('language1');
        var lang2 = this.state.app.currentDictionary.get('language2');

        if (Platform.OS === 'android') {
            this.sayItAndroid(item, lang1, lang2);
        }
        else if (Platform.OS === 'ios') {
            this.sayItIOS(item, lang1, lang2);
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

        var scroller = this.refs.itemsList.getScrollResponder();
        var metrics = this.refs.itemsList.getMetrics();
        var index = this.state.items.findIndex(item => item.id == targetItem.id);
        if (metrics && metrics.contentLength &&
            metrics.contentLength > 0 && metrics.renderedRows > 0) {
            var y = (metrics.contentLength / metrics.renderedRows) * index - 100;
            // var y = Math.max(47 * index - 100, 0);

            scroller.scrollTo({x: 0, y: y, animated: true})
        }
    },
    onLeftSearchButtonPressed() {
        this.props.onLeftSortButtonPressed();  // force sort before search
        this.dispatch({
            type: ActionTypes.TOGGLE_LEFT_SEARCH_BUTTON_PRESSED
        })
    },
    onRightSearchButtonPressed() {
        this.props.onRightSortButtonPressed(); // force sort before search
        this.dispatch({
            type: ActionTypes.TOGGLE_RIGHT_SEARCH_BUTTON_PRESSED
        })
    },
    leftSearchPatternChanged({text}) {
        if (text == "") return;
        var leftSearchPattern = text;
        var langLeft = this.state.app.currentDictionary.get('language1').get('name');   // "spanish";
        var targetItem = this.state.items.find( (item) => {
            if (item.get(langLeft) !== undefined && item.get(langLeft).indexOf(leftSearchPattern) == 0) {
                return true;
            }
            return false;
        });

        this.scrollToItem(targetItem);

    },
    rightSearchPatternChanged({text}) {
        if (text == "") return;
        var rightSearchPattern = text;
        var langRight = this.state.app.currentDictionary.get('language2').get('name');  // "russian";
        var targetItem = this.state.items.find( (item) => {
            if (item.get(langRight) !== undefined && item.get(langRight).indexOf(rightSearchPattern) == 0) {
                return true;
            }
            return false;
        });

        this.scrollToItem(targetItem);

    },
    renderHeader() {
        var langLeft = this.state.app.currentDictionary.get('language1').get('localName');   // "spanish";
        var langRight = this.state.app.currentDictionary.get('language2').get('localName');  // "russian";
        var iconSortStyleLeft = this.state.editState.sortedBy == "leftLanguage" ?
            styles.iconSortActive : styles.iconSortDimmed;
        var iconSortStyleRight = this.state.editState.sortedBy == "rightLanguage" ?
            styles.iconSortActive : styles.iconSortDimmed;

        var editButtonDisabled = this.state.editState.selectedItem ? false : true;
        var sayItButtonDisabled = this.state.editState.selectedItem ? false : true;
        var goWebButtonDisabled = this.state.editState.selectedItem ? false : true;
        var deleteButtonDisabled = this.state.editState.selectedItem ? false : true;
        var editButtonIconStyle = editButtonDisabled ?
            [globalStyles.header.icon, styles.iconButtonDimmed] : [globalStyles.header.icon, styles.iconButtonActive];
        var sayItButtonIconStyle = sayItButtonDisabled ?
            [globalStyles.header.icon, styles.iconButtonDimmed] : [globalStyles.header.icon, styles.iconButtonActive];
        var goWebButtonIconStyle = goWebButtonDisabled ?
            [globalStyles.header.icon, styles.iconButtonDimmed] : [globalStyles.header.icon, styles.iconButtonActive];
        var deleteButtonIconStyle = deleteButtonDisabled ?
            [globalStyles.header.icon, styles.iconButtonDimmed] : [globalStyles.header.icon, styles.iconButtonActive];

        var langTitles = (
            <View style={styles.sortToolbarContainer}>
                {/*Left language name button */}
                <Text style={styles.languageTitle}>
                    {langLeft}
                </Text>

                {/* Left Sort button */}
                <TouchableOpacity onPress = {this.props.onLeftSortButtonPressed} activeOpacity={1.0}>
                    <Icon
                        name='sort-desc'
                        size={20}
                        color='#81c04d'
                        style={iconSortStyleLeft}
                    />
                </TouchableOpacity>

                {/* Left Search button */}
                <TouchableOpacity
                    onPress = {() => this.onLeftSearchButtonPressed()}
                    activeOpacity={1.0}>
                    <Icon
                        name='search'
                        size={20}
                        color='#81c04d'
                        style={globalStyles.header.icon}
                    />
                </TouchableOpacity>

                {/* Right language name button */}
                <Text style={styles.languageTitle}>
                    {langRight}
                </Text>

                {/* Right sort button */}
                <TouchableOpacity onPress = {this.props.onRightSortButtonPressed} activeOpacity={1.0}>
                    <Icon
                        name='sort-desc'
                        size={20}
                        color='#81c04d'
                        style={iconSortStyleRight}
                    />
                </TouchableOpacity>

                {/* Right Search button */}
                <TouchableOpacity
                    onPress = {() => this.onRightSearchButtonPressed()}
                    activeOpacity={1.0}>
                    <Icon
                        name='search'
                        size={20}
                        color='#81c04d'
                        style={globalStyles.header.icon}
                    />
                </TouchableOpacity>

            </View>
        );

        /* Edit Item Toolbar opened when item selected */
        var editToolbar = (
            <View style={styles.editToolbar}>
                <TouchableOpacity style={{flex:1}}
                                  activeOpacity={1.0}
                                    disabled = {editButtonDisabled}
                                    onPress = {() => this.onEditItemButtonPressed()}>
                    <Icon
                        name='pencil'
                        size={20}
                        color='#81c04d'
                        style={editButtonIconStyle}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{flex:1}}
                                  activeOpacity={1.0}
                                    disabled = {sayItButtonDisabled}
                                    onPress = {() => this.onSayItButtonPressed()}>
                    <Icon
                        name='volume-up'
                        size={20}
                        color='#81c04d'
                        style={sayItButtonIconStyle}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{flex:1}}
                                    activeOpacity={1.0}
                                    disabled={goWebButtonDisabled}
                                    onPress = {() => this.onGoWebButtonPressed()}>
                    <Icon
                        name='globe'
                        size={20}
                        color='#81c04d'
                        style={goWebButtonIconStyle}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{flex:1}}
                                    activeOpacity={1.0}
                                    disabled = {deleteButtonDisabled}
                                    onPress = {() => this.onDeleteItemButtonPressed()}>
                    <Icon
                        name='trash-o'
                        size={20}
                        color='#81c04d'
                        style={deleteButtonIconStyle}
                    />
                </TouchableOpacity>

            </View>
        );

        return (
            <View style={styles.headerContainer}>
                {editToolbar}
                {langTitles}
            </View>
        )
    },
    renderRow(item) {
        var langLeft = this.state.app.currentDictionary.get('language1').get('name');   // "spanish";
        var langRight = this.state.app.currentDictionary.get('language2').get('name');  // "russian";
        var style = this.state.editState.selectedItem && item.id == this.state.editState.selectedItem.id ?
            [styles.itemContainer, styles.itemSelected] : [styles.itemContainer, styles.itemUnselected];

        return (
            <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => this.toggleSelectItem(item)}>
                {
                    this.state.editState.selectedItem && item.id == this.state.editState.selectedItem.id &&
                    this.state.editState.editItem ? (
                        <View style={style}>
                            <TextInput
                                style={styles.editItem}
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                                value={item.get(langLeft)}
                                onChangeText={(value) => this.itemLeftChanged({value})}
                                onBlur = {() => this.itemChangeDone()}
                            />
                            <TextInput
                                style={styles.editItem}
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                                value={item.get(langRight)}
                                onChangeText={(value) => this.itemRightChanged({value})}
                                onBlur = {() =>this.itemChangeDone()}
                            />
                        </View>
                    ) : (
                        <View style={style}>
                            <Text style={styles.item}>
                                {item.get(langLeft)}
                            </Text>
                            <Text style={styles.item}>
                                {item.get(langRight)}
                            </Text>
                        </View>
                    )
                }
            </TouchableOpacity>
        )
    },
    render() {
        var langLeft = this.state.app.currentDictionary.get('language1').get('name');   // "spanish";
        var langRight = this.state.app.currentDictionary.get('language2').get('name');  // "russian";
        var sortedBy = this.state.editState.sortedBy;
        var sortedItems = [];
        if (this.state.editState.sortEnabled) {
            sortedItems = Items.prototype.sortItems(this.state.items, sortedBy, langLeft, langRight);
        }
        else {
            sortedItems = this.state.items.slice();
        }

        //var leftSearchPattern = this.state.editState.leftSearchPattern;
        //var rightSearchPattern = this.state.editState.rightSearchPattern;

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

        /* does not work in version 0.20
        stickyIndices = this.state.editState.selectedItem ?
            sortedItems.findIndex( item => item.id == this.state.editState.selectedItem.id ) :
            [];*/

        var leftSearchPopup = this.state.editState.leftSearchPopup ? (
            <SearchItemPopup
                viewStyle = {styles.leftSearchPopup}
                value={this.state.editState.leftSearchPattern}
                onChangeText={(text) => this.leftSearchPatternChanged({text})}
            />
        ) : null;

        var rightSearchPopup = this.state.editState.rightSearchPopup ? (
            <SearchItemPopup
                viewStyle = {styles.rightSearchPopup}
                value={this.state.editState.rightSearchPattern}
                onChangeText={(text) => this.rightSearchPatternChanged({text})}
            />
        ) : null;

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

                {leftSearchPopup}

                {rightSearchPopup}
            </View>
        );
    }
});

var styles = StyleSheet.create({
    contentContainer: {
        flex:8,
        backgroundColor: '#F5FCFF',
    },
    description: {
        marginTop: 10,
        fontSize: 20,
        textAlign: 'center',
        /*color: '#656565'*/
    },
    headerContainer: {
        backgroundColor: '#F5FCFF'
    },
    editToolbar: {
        flexDirection: 'row',
        marginVertical: 10
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
        borderColor: globalStyles.item.borderColor
    },
    itemUnselected: {
        backgroundColor: globalStyles.item.backgroundColor
    },
    itemSelected: {
        backgroundColor: globalStyles.itemSelected.backgroundColor
    },
    item: {
        flex:1,
        fontSize: 15
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
        right: 30,
        bottom: 30
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
    iconButtonActive: {
        opacity: 1.0
    },
    iconButtonDimmed: {
        opacity: 0.5
    },
    leftSearchPopup: {
        left: 20,
    },
    rightSearchPopup: {
        left: 220,
    },
});

/*
 var styles = StyleSheet.create({
 container: {
 padding:30,
 marginTop: 65,
 alignItems:'center'
 },
 image: {
 width: 217,
 height: 138
 },
 searchInput: {
 height: 36,
 padding: 4,
 marginRight: 5,
 flex: 4,
 fontSize: 18,
 borderWidth: 1,
 borderColor: '#48BBEC',
 borderRadius: 8,
 color: '#48BBEC'
 }
 });
 */

/* module.exports = HomeView; */
