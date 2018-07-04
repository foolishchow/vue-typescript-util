import { Commit, Dispatch, Module, Store, CommitOptions } from "vuex";

//#region [mutation]
export type MutationName<M> = string & { payload: M };
export type MutationNames<Typedef> = {
  readonly [p in keyof Typedef]: MutationName<Typedef[p]>;
}
export type AbstractMutationModule<Typedef, State> = {
  readonly [p in keyof Typedef]: (state: State, payload: Typedef[p]) => void;
}
export function getMutatationName<Typedef>(mutation: AbstractMutationModule<Typedef, any>, namespace?: string) {
  return Object.keys(mutation).reduce((prev, current) => {
    (prev as any)[current] = (namespace != undefined ? `${namespace}/` : '') + current;
    return prev;
  }, {} as MutationNames<Typedef>)
}

/* export function generateMutationDictionary<T, Initial>(init: Initial): T & Initial {
  return {} as any;
} */

//#endregion [mutation]

//#region [getter]
export type AbstractGetterModule<Typedef, State, RootState = any, RootGetter = any> = {
  readonly [p in keyof Typedef]: (state: State, getters: AbstractGetterModule<Typedef, State, RootState, RootGetter>, rootState: RootState, rootGetters: RootGetter) => Typedef[p];
}

export type NamespacedGetters<T, NS = string> = {
  [p in keyof T]: T[p];
}
//#endregion [getter]

//#region [action]
export interface TypedCommit {
  <T>(type: MutationName<T>, payload: T, options?: CommitOptions): void;
  <T = never>(type: MutationName<T>, options?: CommitOptions): void;
}
export interface AbstractActionContext<State, RootState, getters = any, rootGetters =any> {
  dispatch: Dispatch;
  commit: Commit;
  state: State;
  getters: getters;
  rootState: RootState;
  rootGetters: rootGetters;
}
export type AbstractActionHandler<S, RS, G, RG, Payload = any> = (injectee: AbstractActionContext<S, RS, G, RG>, payload: Payload) => any;
export interface AbstractActionObject<S, RS, G, RG, Payload=any> {
  root?: boolean;
  handler: AbstractActionHandler<S, RS, G, RG, Payload>;
}

export type AbstractActionModule<Typedef, State, getters=any, RootState=any, rootGetters=any> = {
  readonly [p in keyof Typedef]: AbstractActionHandler<State, RootState, getters, rootGetters, Typedef[p]> | AbstractActionObject<State, RootState, getters, rootGetters, Typedef[p]>;
}
export type ActionName<M> = string & { payload: M };
export type ActionNames<Typedef> = {
  readonly [p in keyof Typedef]: ActionName<Typedef[p]>;
}
export function getActionName<Typedef>(mutation: AbstractActionModule<Typedef, any>, namespace?: string) {
  return Object.keys(mutation).reduce((prev, current) => {
    (prev as any)[current] = (namespace != undefined ? `${namespace}/` : '') + current;
    return prev;
  }, {} as ActionNames<Typedef>)
}
//#endregion [action]

type _moduleTree<State=any, Getters=any, Mutations=any, Actions=any, rootStates=any, rootGetters=any> = {
  state?: State;
  getters?: AbstractGetterModule<Getters, State, rootStates, rootGetters>;
  mutations?: AbstractMutationModule<Mutations, State>;
  actions?: AbstractActionModule<Actions, State, Getters, rootStates, rootGetters>
}

export function MakeVuexModule<State=any, Getters=any, Mutations=any, Actions=any, rootStates=any, rootGetters=any>(
  moduleTree: _moduleTree<State, Getters, Mutations, Actions, rootStates, rootGetters>,
  moduleName: string,
  namespace: boolean = false
) {
  let _moduleTree = moduleTree as Module<State, rootStates>;
  if (namespace) {
    _moduleTree.namespaced = true;
  }
  let moduleMutations: MutationNames<Mutations> = null as any;
  let rootMutations: MutationNames<Mutations> = null as any;
  if (moduleTree.mutations) {
    moduleMutations = getMutatationName(moduleTree.mutations) as any;
    rootMutations = moduleMutations;
    if (namespace) rootMutations = getMutatationName(moduleTree.mutations, moduleName) as any;
  }
  let rootActions: ActionNames<Actions> = null as any;
  if (moduleTree.actions) {
    rootActions = getActionName(moduleTree.actions, namespace ? moduleName : undefined) as any;
  }
  return {
    module: _moduleTree,
    moduleMutations,
    mutations: rootMutations,
    actions: rootActions
  }
}
export function BindToRootMutation<Mutations=any>(
  mutations: MutationNames<Mutations>, rootMutations: any = -1, namespace: string = ''
) {
  if (rootMutations != -1 && mutations) {
    if (namespace) {
      rootMutations[namespace] = mutations;
    } else {
      Object.keys(mutations).forEach(k => {
        rootMutations[k] = (mutations as any)[k];
      });
    }
  }
}
export function BindToRootActions<Actions=any>(actions: ActionNames<Actions>, rootActions: any = -1, namespace: string = '') {
  if (rootActions != -1 && actions) {
    if (namespace) {
      rootActions[namespace] = actions;
    } else {
      Object.keys(actions).forEach(k => {
        rootActions[k] = (actions as any)[k];
      });
    }
  }
}


type TypedCallBack<M> = ((name: MutationName<M>, payload: M) => void) | ((name: MutationName<M>) => void)
export interface InjectStore<state, getter> extends Store<state> {
  Getters: getter;
  Commit<M>(name: MutationName<M>, payload: M): void;
  Commit<M>(name: MutationName<M>): void;
  Dispatch<M>(name: ActionName<M>, payload: M): void;
  Dispatch<M>(name: ActionName<M>): void;
}

function FlattenGetters(obj: any, namespace: string = '') {
  let cached = {}
  if (namespace != '') {
    let childKeys = Object.keys(obj).filter(k => k.indexOf('/') != -1)
      .filter(k => (k as any).startsWith(namespace));
    childKeys.forEach(key => {
      let newKey = key.replace(namespace, '').replace(/^\//, '');
      Object.defineProperty(cached, newKey, {
        get() {
          return obj[key];
        }
      })
    })
  }
  if (namespace == '') {
    Object.keys(obj).filter(k => k.indexOf('/') == -1).map(key => {
      Object.defineProperty(cached, key, {
        get() {
          return obj[key];
        }
      })
    })
    let namespaces: string[] = [];
    Object.keys(obj).filter(k => k.indexOf('/') > -1).map(key => {
      let [namespace, name] = key.split('/');
      if (namespaces.indexOf(namespace) == -1) {
        namespaces.push(namespace);
      }
    })
    namespaces.forEach(namespace => {
      let NamespaceCached = FlattenGetters(obj, namespace)
      Object.defineProperty(cached, namespace, {
        get() {
          return NamespaceCached;
        }
      })
    })
  }
  return cached;
}
export function InjectStore(store: Store<any>) {
  let cahced = FlattenGetters(store.getters);

  Object.defineProperty(store, 'Getters', {
    get() {
      return cahced;
    }
  })
  Object.defineProperty(store, 'Commit', {
    get() {
      return store.commit;
    }
  })
  Object.defineProperty(store, 'Dispatch', {
    get() {
      return store.dispatch;
    }
  })
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
