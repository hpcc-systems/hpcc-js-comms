export var root = new Function("try{return global;}catch(e){return window;}")();
export var isBrowser = new Function("try{return this===window;}catch(e){return false;}");
export var isNode = new Function("try{return this===global;}catch(e){return false;}");
export var isTravis = new Function("try{return process.env.TRAVIS;}catch(e){return false;}");
//# sourceMappingURL=platform.js.map