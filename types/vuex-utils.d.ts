import { Commit, Dispatch, Module, Store } from "vuex";
export declare type MutationName<M> = string & {
    payload: M;
};
export declare type MutationNames<Typedef> = {
    readonly [p in keyof Typedef]: MutationName<Typedef[p]>;
};
export declare type AbstractMutationModule<Typedef, State> = {
    readonly [p in keyof Typedef]: (state: State, payload: Typedef[p]) => void;
};
export declare function getMutatationName<Typedef>(mutation: AbstractMutationModule<Typedef, any>, namespace?: string): MutationNames<Typedef>;
export declare type AbstractGetterModule<Typedef, State, RootState = any, RootGetter = any> = {
    readonly [p in keyof Typedef]: (state: State, getters: AbstractGetterModule<Typedef, State, RootState, RootGetter>, rootState: RootState, rootGetters: RootGetter) => Typedef[p];
};
export declare type NamespacedGetters<T, NS = string> = {
    [p in keyof T]: T[p];
};
export interface AbstractActionContext<State, RootState, getters = any, rootGetters = any> {
    dispatch: Dispatch;
    commit: Commit;
    state: State;
    getters: getters;
    rootState: RootState;
    rootGetters: rootGetters;
}
export declare type AbstractActionHandler<S, RS, G, RG, Payload = any> = (injectee: AbstractActionContext<S, RS, G, RG>, payload: Payload) => any;
export interface AbstractActionObject<S, RS, G, RG, Payload = any> {
    root?: boolean;
    handler: AbstractActionHandler<S, RS, G, RG, Payload>;
}
export declare type AbstractActionModule<Typedef, State, getters = any, RootState = any, rootGetters = any> = {
    readonly [p in keyof Typedef]: AbstractActionHandler<State, RootState, getters, rootGetters, Typedef[p]> | AbstractActionObject<State, RootState, getters, rootGetters, Typedef[p]>;
};
export declare type ActionName<M> = string & {
    payload: M;
};
export declare type ActionNames<Typedef> = {
    readonly [p in keyof Typedef]: ActionName<Typedef[p]>;
};
export declare function getActionName<Typedef>(mutation: AbstractActionModule<Typedef, any>, namespace?: string): ActionNames<Typedef>;
declare type _moduleTree<State = any, Getters = any, Mutations = any, Actions = any, rootStates = any, rootGetters = any> = {
    state?: State;
    getters?: AbstractGetterModule<Getters, State, rootStates, rootGetters>;
    mutations?: AbstractMutationModule<Mutations, State>;
    actions?: AbstractActionModule<Actions, State, Getters, rootStates, rootGetters>;
};
export declare function MakeVuexModule<State = any, Getters = any, Mutations = any, Actions = any, rootStates = any, rootGetters = any>(moduleTree: _moduleTree<State, Getters, Mutations, Actions, rootStates, rootGetters>, moduleName: string, namespace?: boolean): {
    module: Module<State, rootStates>;
    moduleMutations: MutationNames<Mutations>;
    mutations: MutationNames<Mutations>;
    actions: ActionNames<Actions>;
};
export declare function BindToRootMutation<Mutations = any>(mutations: MutationNames<Mutations>, namespace: string, rootMutations?: any): void;
export declare function BindToRootActions<Actions = any>(actions: ActionNames<Actions>, namespace: string, rootActions?: any): void;
export interface InjectStore<state, getter> extends Store<state> {
    Getters: getter;
    Commit<M>(name: MutationName<M>, payload: M): void;
    Commit<M>(name: MutationName<M>): void;
    Dispatch<M>(name: ActionName<M>, payload: M): void;
    Dispatch<M>(name: ActionName<M>): void;
}
export declare function InjectStore(store: Store<any>): void;
export {};
