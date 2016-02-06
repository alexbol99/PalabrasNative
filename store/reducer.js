/**
 * Created by alexanderbol on 09/01/2016.
 */
import * as ActionTypes from '../store/actionTypes';
var Redux = require('redux');

const initialAppState = {
    navigateTo: 'homeView',
    currentDictionary: '',
    mode: 'edit',
    editState: {
        sortedBy: 'leftLanguage'
    },
    learnState: {
        maxNumLearnItems: 8
    }
};

function app(state=initialAppState, action) {
    switch (action.type) {
        case ActionTypes.DICTIONARY_SELECTED:
            return Object.assign({}, state, {
                currentDictionary: action.dictionary,
                navigateTo: 'dictionaryView'
            });
        case ActionTypes.BACK_HOME:
            return Object.assign({}, state, {
                navigateTo: 'homeView'
            });
        case ActionTypes.SET_EDIT_MODE:
            return Object.assign({}, state, {
                mode: 'edit'
            });
        case ActionTypes.SET_LEARN_MODE:
            return Object.assign({}, state, {
                mode: 'learn'
            });
        case ActionTypes.ADD_NEW_ITEM_REQUEST_SUCCEED:
            return Object.assign({}, state, {

            });
        default:
            return state;
    }
}

function editState(state=initialAppState.editState, action) {
    switch (action.type) {
        case ActionTypes.SET_SORTED_BY:
            return Object.assign({}, state, {
                sortedBy: action.sortedBy
            });
        default:
            return state;
    }
}

function learnState(state=initialAppState.learnState, action) {
    switch (action.type) {
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
    editState,
    learnState,
    ajaxState,
    dictionaries,
    items
});
