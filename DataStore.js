const Store = require("electron-store");

class DataStore extends Store {
    constructor(settings) {
        super(settings);

        // initialize with todos or empty array

        // this.contacts = this.get("contacts") || [];
        // this.contacts = this.contacts || [];
    }

    setContacts(clientNumber, contacts) {
        // save todos to JSON file
        this.set(clientNumber, contacts);
        this.contacts = contacts;
        // returning 'this' allows method chaining
        return this;
    }

    getContacts(clientNumber) {
        // set object's todos to todos in JSON file
        this.contacts = this.get(clientNumber) || [];

        return this;
    }

    // addTodo(todo) {
    //     // merge the existing todos with the new todo
    //     this.todos = [...this.todos, todo];

    //     return this.saveTodos();
    // }

    // deleteTodo(todo) {
    //     // filter out the target todo
    //     this.todos = this.todos.filter((t) => t !== todo);

    //     return this.saveTodos();
    // }
}

module.exports = DataStore;
