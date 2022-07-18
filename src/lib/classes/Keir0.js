class Keir0 {
    constructor() {
        this.events = {

        };
    };

    on(name, listener) {
        if(!this.events[name]) this.events[name] = [];

        this.events[name].push(listener);
    };

    removeListener(name, listenerToRemove) {
        if(!this.events[name]) throw new Error(`Can't remove a listener. Event "${name}" doesn't exist!`);

        const filterListeners = (listener) => listener !== listenerToRemove;

        this._events[name] = this._events[name].filter(filterListeners);
    };

    emit(name, data) {
        if(!this.events[name]) throw new Error(`Can't emit an event. Event "${name}" doesn't exist!`);

        const fireCallbacks = (callback) => callback(data);

        this.events[name].forEach(fireCallbacks);
    };
};

module.exports = new Keir0;