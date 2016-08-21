/**
 * Created by alexanderbol on 09/01/2016.
 */
import * as ActionTypes from '../store/actionTypes';
var Redux = require('redux');

const initialAppState = {
    navigateTo: 'loginView',
    currentDictionary: '',
    mode: 'edit',
    showHomeMenu: false,
    needFetchData: true,
    needFetchItems: true,
    numItemsInPage: 100,
    numItemsToSkip: 0,
    fetchItemsStarted: false,
    itemsParse: undefined,    /* Parse Object represented correspondent Parse document */
    locales: [],
    editState: {
        sortEnabled: true,
        sortedBy: 'leftLanguage',
        selectedItem: undefined,
        editItem: false,
        autotranslate: true,
        leftSearchPattern: '',
        rightSearchPattern: ''
    },
    learnState: {
        maxNumLearnItems: 8,
        leftItems: [],
        rightItems: [],
        selectedLeftItemId: undefined,
        selectedRightItemId: undefined,
        itemsToBeRefreshed: true
    },
};

const initialUserState = {
    parseUser: '',           // parse user object
    status: '',
    name: '',
    url: '',
    data: null
};

function app(state=initialAppState, action) {
    switch (action.type) {
        case ActionTypes.USER_LOGGED_IN_TO_PARSE:
            return Object.assign({}, state, {
                navigateTo: 'homeView',
                needFetchData: true,
                showHomeMenu: false
            });
        case ActionTypes.HOME_MENU_BUTTON_PRESSED:
            return Object.assign({}, state, {
                showHomeMenu: !state.showHomeMenu
            });
        case ActionTypes.MENU_ITEM_LOGOUT_PRESSED:
            return Object.assign({}, state, {
                navigateTo: 'loginView'
            });
        case ActionTypes.DICTIONARY_SELECTED:
            var needFetchItems = state.currentDictionary.id != action.dictionary.id;
            return Object.assign({}, state, {
                currentDictionary: action.dictionary,
                itemsParse: action.itemsParse,
                navigateTo: 'dictionaryView',
                mode: 'edit',
                needFetchItems: needFetchItems
            });
        case ActionTypes.BACK_HOME_BUTTON_PRESSED:
            return Object.assign({}, state, {
                navigateTo: 'homeView',
                needFetchData: action.needFetchData || false
            });
        case ActionTypes.CONFIG_BUTTON_PRESSED: {
            return Object.assign({}, state, {
                navigateTo: 'configView'
            })
        }
        case ActionTypes.EDIT_MODE_BUTTON_PRESSED:
            return Object.assign({}, state, {
                mode: 'edit'
            });
        case ActionTypes.LEARN_MODE_BUTTON_PRESSED:
            return Object.assign({}, state, {
                mode: 'learn'
            });
        case ActionTypes.BACK_TO_DICTIONARY_VIEW_PRESSED:
            return Object.assign({}, state, {
                navigateTo: 'dictionaryView'
            });
        case ActionTypes.DICTIONARY_UPDATED:
            return Object.assign({}, state, {
                currentDictionary: action.dictionary
            });
        case ActionTypes.NEW_DICTIONARY_SAVE_REQUEST_SUCCEED:
            //return Object.assign({}, state, {
            //    currentDictionary: action.dictionary,
            //    navigateTo: 'addNewDictionaryView'
            //});
        case ActionTypes.ADD_NEW_DICTIONARY_BUTTON_PRESSED:
            return Object.assign({}, state, {
                navigateTo: 'addNewDictionaryView'
            });
        case ActionTypes.DELETE_DICTIONARY_BUTTON_PRESSED:
            return Object.assign({}, state, {
                navigateTo: 'homeView',
                needFetchData: true
            });
        case ActionTypes.GO_WEB_BUTTON_PRESSED:
            return Object.assign({}, state, {
                navigateTo: 'goWebView'
            });
        case ActionTypes.FETCH_ITEMS_STARTED:
            return Object.assign({}, state, {
                fetchItemsStarted: true
            });
        /* page of items fetched successfully */
        case ActionTypes.FETCH_ITEMS_PAGE_SUCCEED:
            return Object.assign({}, state, {
                numItemsToSkip: state.numItemsToSkip + state.numItemsInPage
            });
        /* all items fetched successfully */
        case ActionTypes.FETCH_ITEMS_SUCCEED:
            return Object.assign({}, state, {
                numItemsToSkip: 0,
                fetchItemsStarted: false,
                needFetchItems: false
            });
        case ActionTypes.SHARE_DICTIONARY_REQUEST_SUCCEED:
            return Object.assign({}, state, {
                needFetchData: true
            });
        case ActionTypes.TTS_LOCALES_REQUEST_SUCCEED:
            return Object.assign({}, state, {
                locales: action.locales
            });
        default:
            return state;
    }
}

function editState(state=initialAppState.editState, action) {
    switch (action.type) {
        case ActionTypes.DICTIONARY_SELECTED:
            return Object.assign({}, state, {
                leftSearchPattern: '',
                rightSearchPattern: '',
                sortEnabled: true
            });
        case ActionTypes.BUTTON_SORTED_BY_PRESSED:
            return Object.assign({}, state, {
                sortedBy: action.sortedBy,
                sortEnabled: true
            });
        case ActionTypes.LEFT_SEARCH_INPUT_GOT_FOCUS:
            return Object.assign({}, state, {
                rightSearchPattern: ''
            });
        case ActionTypes.RIGHT_SEARCH_INPUT_GOT_FOCUS:
            return Object.assign({}, state, {
                leftSearchPattern: ''
            });
        case ActionTypes.LEFT_SEARCH_PATTERN_CHANGED:
            return Object.assign({}, state, {
                leftSearchPattern: action.leftSearchPattern
            });
        case ActionTypes.RIGHT_SEARCH_PATTERN_CHANGED:
            return Object.assign({}, state, {
                rightSearchPattern: action.rightSearchPattern
            });
        case ActionTypes.LEFT_CLEAN_SEARCH_PATTERN_PRESSED:
            return Object.assign({}, state, {
                leftSearchPattern: ''
            });
        case ActionTypes.RIGHT_CLEAN_SEARCH_PATTERN_PRESSED:
            return Object.assign({}, state, {
                rightSearchPattern: ''
            });
        case ActionTypes.SELECT_ITEM_PRESSED:
            // if none selected - select
            // if same selected - unselect
            // if other selected - change selection to current
            return Object.assign({}, state, {
                selectedItem: state.selectedItem == undefined ? action.item :
                    (state.selectedItem.id == action.item.id ? undefined : action.item),
                editItem: false,
                sortEnabled: true
            });
        case ActionTypes.EDIT_ITEM_BUTTON_PRESSED:
            return Object.assign({}, state, {
                editItem: !state.editItem,
                sortEnabled: state.editItem    /* enable sort when editItem mode is going closed */
            });
        case ActionTypes.FORCE_EDIT_ITEM_PRESSED:
            return Object.assign({}, state, {
                selectedItem: action.item,
                editItem: true,
                sortEnabled: false
            });
        case ActionTypes.DELETE_ITEM_REQUEST_SUCCEED:
            return Object.assign({}, state, {
                selectedItem: undefined,
                editItem: false,
                sortEnabled: true
            });
        case ActionTypes.ADD_NEW_ITEM_REQUEST_SUCCEED:
            return Object.assign({}, state, {
                selectedItem: action.item,
                editItem: true,
                sortEnabled: false
            });
        case ActionTypes.ITEM_CHANGED:
            return Object.assign({}, state, {
                sortEnabled: false
            });
        /*case ActionTypes.ITEM_CHANGE_DONE:
            return Object.assign({}, state, {
                sortEnabled: true
            });*/
        case ActionTypes.AUTO_TRANSLATE_SWITCH_TOGGLED:
            return Object.assign({}, state, {
                autotranslate: !state.autotranslate
            });
        default:
            return state;
    }
}

function learnState(state=initialAppState.learnState, action) {
    switch (action.type) {
        case ActionTypes.LEARN_MODE_BUTTON_PRESSED:
            return Object.assign({}, state, {
                leftItems: action.leftItems,
                rightItems: action.rightItems
            });
        case ActionTypes.LEARN_ITEMS_REFRESHED:
            return Object.assign({}, state, {
                leftItems: action.leftItems,
                rightItems: action.rightItems,
                itemsToBeRefreshed: false
            });
        case ActionTypes.LEFT_ITEM_CLICKED:
            return Object.assign({}, state, {
                selectedLeftItemId: state.selectedLeftItemId == action.id ? undefined : action.id
            });
        case ActionTypes.RIGHT_ITEM_CLICKED:
            return Object.assign({}, state, {
                selectedRightItemId: state.selectedRightItemId == action.id ? undefined : action.id
            });
        case ActionTypes.ITEMS_MATCHED:
            let itemsToBeRefreshed = state.leftItems.length == 1 ? true : false;
            return Object.assign({}, state, {
                leftItems: state.leftItems
                    .slice(0, action.leftInd)
                    .concat(state.leftItems.slice(action.leftInd+1)),
                rightItems: state.rightItems
                    .slice(0, action.rightInd)
                    .concat(state.rightItems.slice(action.rightInd+1)),
                itemsToBeRefreshed: itemsToBeRefreshed,
                selectedLeftItemId: undefined,
                selectedRightItemId: undefined
            });
        default:
            return state;
    }
}

function ajaxState( state = "", action ) {
    switch (action.type) {
        case ActionTypes.AJAX_REQUEST_STARTED:
            return action.type;
        case ActionTypes.AJAX_REQUEST_FAILED:
            return action.type;
        case ActionTypes.AJAX_REQUEST_RESET:
            return "";
        default:
            return state;
    }
}
function dictionaries(state = [], action) {
    switch (action.type) {
        case ActionTypes.FETCH_DICTIONARIES_REQUEST_SUCCEED:
            return (action.dictionaries);

        case ActionTypes.FETCH_SHARES_REQUEST_SUCCEED:
            var newDictionaries = state.slice();
            // Add dictionaries shared to current user
            // User can share to himself, check this is not in the list already
            action.shares.forEach( (share) => {
                if (!state.find( (dictionary) => dictionary.id == share.get('dictionary').id ) ) {
                    newDictionaries.push(share.get('dictionary'));
                }
            });
            return newDictionaries;

        case ActionTypes.NEW_DICTIONARY_SAVE_REQUEST_SUCCEED:
            return (state
            .slice()
            .concat([action.dictionary]));

        case ActionTypes.DICTIONARY_UPDATED:
            var index = state.findIndex( (dictionary_tmp) => (dictionary_tmp.id == action.dictionary.id) );
            return (state
            .slice(0, index)
            .concat([action.dictionary])
            .concat(state.slice(index+1)));

        case ActionTypes.DELETE_DICTIONARY_REQUEST_SUCCEED:
            var index = state.findIndex( (dictionary_tmp) => (dictionary_tmp.id == action.dictionary.id) );
            return (state
                .slice(0, index)
                .concat(state.slice(index+1)));

        default:
            return state;
    }
}

function items(state = [], action) {
    switch (action.type) {
        case ActionTypes.FETCH_ITEMS_STARTED:
            return [];
        case ActionTypes.FETCH_ITEMS_PAGE_SUCCEED:
            return state.concat(action.items);
        case ActionTypes.ITEM_CHANGED:
            var index = state.findIndex( (item_tmp) => (item_tmp.id == action.item.id) );
            return (state
                .slice(0, index)
                .concat([action.item])
                .concat(state.slice(index+1)));
        case ActionTypes.DELETE_ITEM_REQUEST_SUCCEED:
            var index = state.findIndex( (item_tmp) => (item_tmp.id == action.item.id) );
            return (state
                .slice(0, index)
                .concat(state.slice(index+1)));
        case ActionTypes.ADD_NEW_ITEM_REQUEST_SUCCEED:
            /* insert item to be first in the list */
            return ([action.item].concat(state.slice()));
        default:
            return state;
    }
}

function user(state = initialUserState, action) {
    switch (action.type) {
        case ActionTypes.USER_LOGGED_IN_TO_PARSE:
            return Object.assign({}, state, {
                status: action.type,
                parseUser: action.user
            });
        case ActionTypes.MENU_ITEM_LOGOUT_PRESSED:
            return Object.assign({}, state, {
                status: action.type
            });
        case ActionTypes.USER_LOGGED_OUT:
            return initialUserState;
        case ActionTypes.FETCH_USER_DATA_REQUEST_SUCCEED:
            return Object.assign({}, state, {
                name: action.name,
                url : action.url
            });
        default:
            return state;
    }
}

function languages(state = [], action) {
    switch (action.type) {
        case ActionTypes.FETCH_LANGUAGES_REQUEST_SUCCEED:
            return action.languages;
        default:
            return state;
    }
}

export var reducer = Redux.combineReducers({
    ajaxState,
    user,
    app,
    editState,
    learnState,
    dictionaries,
    items,
    languages
});
