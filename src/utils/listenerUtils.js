export const StoreListener = class StoreListener {
    constructor(store) {
        this.store = store;
        this.unsubscribers = {};
    }

    removeListener = (name) => {
        if (this.unsubscribers.hasOwnProperty(name)) {
            this.unsubscribers[name]();
            delete this.unsubscribers[name];
            return true;
        } else {
            return false;
        }
    }

    // Adds a listener to the store.
    // Will attempt to remove an existing listener if the name
    // matches that of an existing listener.
    // If no name is provided this is an anonymous lister, it
    // is not registered in the list of unsubscribe functions,
    // returns the unsubscribe function so it can still be handled
    // manually if desired.
    addListener = (listener, name, otherArgs) => {
        // attempt to unsubscribe an existing listener if the new 
        // listener name matches
        // if no name is provided, do nothing
        name && this.removeListener(name);
        const unsubscribe = (() => {
            let oldState = this.store.getState();
            return this.store.subscribe(() => {
                const newState = this.store.getState();
                listener(oldState, newState, {...otherArgs});
                oldState = newState;
            });
        })();
        // if name was provided, add the unsubscribe
        // otherwise this is an "anonymous" listener
        name && (this.unsubscribers[name] = unsubscribe);
        return unsubscribe;
    }

    hasListener = (name) => {
        return this.unsubscribers.hasOwnProperty(name);
    }
};
