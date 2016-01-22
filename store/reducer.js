/**
 * Created by alexanderbol on 09/01/2016.
 */
import * as ActionTypes from '../store/actionTypes';
var Redux = require('redux');

const initialAppState = {
    navigateTo: 'homeView',
    currentDictionary: ''
};

function app(state=initialAppState, action) {
    switch (action.type) {
        case ActionTypes.DICTIONARY_SELECTED:
            return Object.assign({}, state, {
                currentDictionary: action.dictionary,
                navigateTo: 'dictionaryView'
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
            return action.dictionaries;
        default:
            return state;
    }
}

function items(state = [], action) {
    switch (action.type) {
        case ActionTypes.FETCH_ITEMS_SUCCEED:
            return action.items;
        default:
            return state;
    }
}

export var reducer = Redux.combineReducers({
    app,
    ajaxState,
    dictionaries,
    items
});
