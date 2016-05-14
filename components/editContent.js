/**
 * Created by alexanderbol on 06/02/2016.
 */
/**
 * Created by alexanderbol on 30/01/2016.
 */
var React = require('react-native');
var Items = require('../models/items').Items;

import * as ActionTypes from '../store/actionTypes';

var {
    Alert,
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    Platform
    } = React;

// use http://fortawesome.github.io/Font-Awesome/icons/
var Icon = require('react-native-vector-icons/FontAwesome');

var globalStyles = require('../styles/styles').styles;

var intervalId;

var SearchInputPopup = ({viewStyle, inputStyle, value, onChangeText}) => {
    return (
        <View style={viewStyle}>
            <TextInput
                style={inputStyle}
                autoCapitalize = 'none'
                autoCorrect = {false}
                autoFocus = {true}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

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
        this.scrollToItem();
    },
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    },
    componentDidUpdate() {
    },
    toggleSelectItem(item) {
        this.dispatch({
            type: ActionTypes.SELECT_ITEM_PRESSED,
            item: item
        });
    },
    onEditItemButtonPressed() {
        /* Disable edit/delete if current user is not an owner of the document */
        var isOwner = this.state.user.parseUser.id === this.state.app.currentDictionary.get('createdBy').id;

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
        item.set(langLeft, value);
        this.dispatch({
            type: ActionTypes.ITEM_CHANGED,
            item: item
        });
        Items.prototype.updateItem(item)
            .then( (item) => {/*do nothing*/}),
            (error) => {
                alert("Problems with connection to server");
            }
    },
    itemRightChanged({value}) {
        var item = this.state.editState.selectedItem;
        var langRight = this.state.app.currentDictionary.get('language2').get('name');  // "russian";
        item.set(langRight, value);
        this.dispatch({
            type: ActionTypes.ITEM_CHANGED,
            item: item
        });
        Items.prototype.updateItem(item)
            .then( (item) => {/*do nothing*/}),
            (error) => {
                alert("Problems with connection to server");
            }
    },
    onDeleteItemButtonPressed() {
        var item = this.state.editState.selectedItem;
        if (!item) return;

        /* Disable edit/delete if current user is not an owner of the document */
        var isOwner = this.state.user.parseUser.id === this.state.app.currentDictionary.get('createdBy').id;

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
        Items.prototype.addEmptyItem(this.state.app.currentDictionary)
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
                }, 2000);
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
    scrollToItem() {
        var selectedItem = this.state.editState.selectedItem;
        if (!selectedItem) return;

        var scroller = this.refs.itemsList.getScrollResponder();
        var metrics = this.refs.itemsList.getMetrics();
        var index = this.state.items.findIndex(item => item.id == selectedItem.id);
        // var y = (metrics.contentLength / metrics.renderedRows) * index - 100;
        var y = 41 * index - 100;

        scroller.scrollTo({x:0, y:y, animated: true})
    },
    onLeftSearchButtonPressed() {
        this.dispatch({
            type: ActionTypes.TOGGLE_LEFT_SEARCH_BUTTON_PRESSED
        })
    },
    onRightSearchButtonPressed() {
        this.dispatch({
            type: ActionTypes.TOGGLE_RIGHT_SEARCH_BUTTON_PRESSED
        })
    },
    leftSearchPatternChanged({text}) {
        this.dispatch({
            type: ActionTypes.LEFT_SEARCH_PATTERN_CHANGED,
            text: text
        });
    },
    rightSearchPatternChanged({text}) {
        this.dispatch({
            type: ActionTypes.RIGHT_SEARCH_PATTERN_CHANGED,
            text: text
        });
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
                            />
                            <TextInput
                                style={styles.editItem}
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                                value={item.get(langRight)}
                                onChangeText={(value) => this.itemRightChanged({value})}
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
        var sortedItems = this.state.items.sort((item1, item2) => {
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

        var leftSearchPattern = this.state.editState.leftSearchPattern;
        var rightSearchPattern = this.state.editState.rightSearchPattern;

        var filteredItems = sortedItems.filter( (item) => {
            if (item.get(langLeft).indexOf(leftSearchPattern) == 0 &&
                item.get(langRight).indexOf(rightSearchPattern) == 0) {
                return true;
            }
            return false;
        });

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(filteredItems);

        /* does not work in version 0.20
        stickyIndices = this.state.editState.selectedItem ?
            sortedItems.findIndex( item => item.id == this.state.editState.selectedItem.id ) :
            [];*/

        var leftSearchPopup = this.state.editState.leftSearchPopup ? (
            <SearchInputPopup
                viewStyle = {[styles.searchPopup, styles.leftSearchPopup]}
                inputStyle = {[styles.searchPatternInput]}
                value={this.state.editState.leftSearchPattern}
                onChangeText={(text) => this.leftSearchPatternChanged({text})}
            />
        ) : null;

        var rightSearchPopup = this.state.editState.rightSearchPopup ? (
            <SearchInputPopup
                viewStyle = {[styles.searchPopup, styles.rightSearchPopup]}
                inputStyle = {[styles.searchPatternInput]}
                value={this.state.editState.rightSearchPattern}
                onChangeText={(text) => this.rightSearchPatternChanged({text})}
            />
        ) : null;

        return (
            <View style={styles.contentContainer}>
                <ListView ref='itemsList'
                    dataSource={dataSource}
                    initialListSize = {20}
                    renderSectionHeader={() => this.renderHeader()}
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
        flex: 1,
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
    listView: {
        flex: 1,
        height: 400
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
    searchPopup: {
        position: 'absolute',
        top: 80,
        width: 100,
        height: 45,
        alignItems: 'center',
        /*borderWidth: 1,
        elevation: 1,
        shadowColor:'darkgray',
        borderColor: '#81c04d',
        shadowOpacity: 0.8,
        shadowOffset: {
            height:0,
            width:0
        }*/
    },
    searchPatternInput: {
        /*position: 'absolute',
        top: 80,
        width: 100,*/
        height: 40,
        marginLeft:2,
        marginRight:2,
        paddingLeft:5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#81c04d',
        textAlignVertical: 'center',
        elevation: 5,
    }
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
