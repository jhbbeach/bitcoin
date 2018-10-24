let EventEmitter = require('events').EventEmitter;
let singleEventEmitter = {};

singleEventEmitter.singleEventEmitter = function(){
    if(this._singleEventEmitter === undefined){
        this._singleEventEmitter = new EventEmitter();
    }
    return this._singleEventEmitter;
}
export default singleEventEmitter;