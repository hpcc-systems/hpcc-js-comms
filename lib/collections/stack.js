/**
 * A generic Stack
 */
var Stack = (function () {
    function Stack() {
        this.stack = [];
    }
    /**
     * Push element onto the stack
     *
     * @param e - element to push
     */
    Stack.prototype.push = function (e) {
        this.stack.push(e);
        return e;
    };
    /**
     * Pop element off the stack
     */
    Stack.prototype.pop = function () {
        return this.stack.pop();
    };
    /**
     * Top item on the stack
     *
     * @returns Top element on the stack
     */
    Stack.prototype.top = function () {
        return this.stack.length ? this.stack[this.stack.length - 1] : undefined;
    };
    /**
     * Depth of stack
     *
     * @returns Depth
     */
    Stack.prototype.depth = function () {
        return this.stack.length;
    };
    return Stack;
}());
export { Stack };
//# sourceMappingURL=stack.js.map