import Vue from 'vue';

function getMutatationName(mutation, namespace) {
    return Object.keys(mutation).reduce((prev, current) => {
        prev[current] = (namespace != undefined ? `${namespace}/` : '') + current;
        return prev;
    }, {});
}
function generateMutationDictionary(init) {
    return {};
}
function getActionName(mutation, namespace) {
    return Object.keys(mutation).reduce((prev, current) => {
        prev[current] = (namespace != undefined ? `${namespace}/` : '') + current;
        return prev;
    }, {});
}
//#endregion [action]
function AbstractStoreMutations() {
    // return
}
function FlattenGetters(obj, namespace = '') {
    let cached = {};
    if (namespace != '') {
        let childKeys = Object.keys(obj).filter(k => k.indexOf('/') != -1)
            .filter(k => k.startsWith(namespace));
        childKeys.forEach(key => {
            let newKey = key.replace(namespace, '').replace(/^\//, '');
            Object.defineProperty(cached, newKey, {
                get() {
                    return obj[key];
                }
            });
        });
    }
    if (namespace == '') {
        Object.keys(obj).filter(k => k.indexOf('/') == -1).map(key => {
            Object.defineProperty(cached, key, {
                get() {
                    return obj[key];
                }
            });
        });
        let namespaces = [];
        Object.keys(obj).filter(k => k.indexOf('/') > -1).map(key => {
            let [namespace, name] = key.split('/');
            if (namespaces.indexOf(namespace) == -1) {
                namespaces.push(namespace);
            }
        });
        namespaces.forEach(namespace => {
            let NamespaceCached = FlattenGetters(obj, namespace);
            Object.defineProperty(cached, namespace, {
                get() {
                    return NamespaceCached;
                }
            });
        });
    }
    return cached;
}
function InjectStore(store) {
    let cahced = FlattenGetters(store.getters);
    Object.defineProperty(store, 'Getters', {
        get() {
            return cahced;
        }
    });
    Object.defineProperty(store, 'Commit', {
        get() {
            return store.commit;
        }
    });
    Object.defineProperty(store, 'Dispatch', {
        get() {
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

class VueComponent extends Vue {
}

export { VueComponent, getMutatationName, generateMutationDictionary, getActionName, AbstractStoreMutations, InjectStore };
