/**
 * A generic Stack
 */
export declare class Stack<T> {
    private stack;
    /**
     * Push element onto the stack
     *
     * @param e - element to push
     */
    push(e: T): T;
    /**
     * Pop element off the stack
     */
    pop(): T | undefined;
    /**
     * Top item on the stack
     *
     * @returns Top element on the stack
     */
    top(): T | undefined;
    /**
     * Depth of stack
     *
     * @returns Depth
     */
    depth(): number;
}
