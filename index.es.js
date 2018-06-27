import Vue from 'vue';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function getMutatationName(mutation, namespace) {
    return Object.keys(mutation).reduce(function (prev, current) {
        prev[current] = (namespace != undefined ? namespace + "/" : '') + current;
        return prev;
    }, {});
}
function generateMutationDictionary(init) {
    return {};
}
function getActionName(mutation, namespace) {
    return Object.keys(mutation).reduce(function (prev, current) {
        prev[current] = (namespace != undefined ? namespace + "/" : '') + current;
        return prev;
    }, {});
}
//#endregion [action]
function AbstractStoreMutations() {
    // return
}
function FlattenGetters(obj, namespace) {
    if (namespace === void 0) { namespace = ''; }
    var cached = {};
    if (namespace != '') {
        var childKeys = Object.keys(obj).filter(function (k) { return k.indexOf('/') != -1; })
            .filter(function (k) { return k.startsWith(namespace); });
        childKeys.forEach(function (key) {
            var newKey = key.replace(namespace, '').replace(/^\//, '');
            Object.defineProperty(cached, newKey, {
                get: function () {
                    return obj[key];
                }
            });
        });
    }
    if (namespace == '') {
        Object.keys(obj).filter(function (k) { return k.indexOf('/') == -1; }).map(function (key) {
            Object.defineProperty(cached, key, {
                get: function () {
                    return obj[key];
                }
            });
        });
        var namespaces_1 = [];
        Object.keys(obj).filter(function (k) { return k.indexOf('/') > -1; }).map(function (key) {
            var _a = key.split('/'), namespace = _a[0], name = _a[1];
            if (namespaces_1.indexOf(namespace) == -1) {
                namespaces_1.push(namespace);
            }
        });
        namespaces_1.forEach(function (namespace) {
            var NamespaceCached = FlattenGetters(obj, namespace);
            Object.defineProperty(cached, namespace, {
                get: function () {
                    return NamespaceCached;
                }
            });
        });
    }
    return cached;
}
function InjectStore(store) {
    var cahced = FlattenGetters(store.getters);
    Object.defineProperty(store, 'Getters', {
        get: function () {
            return cahced;
        }
    });
    Object.defineProperty(store, 'Commit', {
        get: function () {
            return store.commit;
        }
    });
    Object.defineProperty(store, 'Dispatch', {
        get: function () {
            return store.dispatch;
        }
    });
}
/* interface Deep<T> {
  p1: T;
  p2: T;
}

// changed: for every property of T with key P and value of type T[P],
// there is a property of Nested<T> with key P and value of type Deep<T[P]>
type Nested<T> = {
  [P in keyof T]: Deep<T[P]>;
}

// output is T, input is Nested<T> and a key of Deep<>
function flat<T>(input: Nested<T>, p: keyof Deep<any>): T {
  const put = {} as T; // assert as type T
  for (let k in input)
    put[k] = input[k][p];
  return put; // added return value
}

const foo = flat({
  name: { p1: 'name', p2: 'name' },
  fn: { p1: () => 0, p2: () => 1 },
}, 'p2'); // example code lacked 'p1' or 'p2' argument

foo.name.charAt(0); // works
foo.fn().toFixed(0); // works */

var VueComponent = /** @class */ (function (_super) {
    __extends(VueComponent, _super);
    function VueComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VueComponent;
}(Vue));

// export function VueComponent<Props={}, store extends Store<any> = Store<any>>() {
// }

export { VueComponent, getMutatationName, generateMutationDictionary, getActionName, AbstractStoreMutations, InjectStore };
