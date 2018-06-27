# vue-typescript-util

> write vue with type check   
this module only work with `/.tsx?/` file 

## important 
to make `VueComponent` active.     
you have to create a `jsx.d.ts` file in project root like [this](https://github.com/foolishchow/vue-typescript/blob/master/jsx.d.ts)

also  you may need this => [how it worked](https://github.com/foolishchow/vue-typescript)

### exposed
  - vue
    - VueComponent
  - vuex
    - MakeVuexModule
    - BindToRootMutation
    - BindToRootActions
    - InjectStore 


### usage 

> see folder `demo`

- `VueComponent<Props={}, store extends Store<any> = Store<any>>`   
  with `vue-class-component` you can use type checking 
  ```typescript
  import Component from "vue-class-component";
  import { Prop } from "vue-property-decorator"
  import { VueComponent } from "vue-typescript-util";
  import { CreateElement } from "vue";

  export type MyComponentPropsType = {
    name:string;
    title?:string;
  }
  //define a component MyComponent
  @Component
  export class MyComponent extends VueComponent<MyComponentPropsType>{
    @Prop()
    name:string;
    @Prop()
    title:string;
    render(h: CreateElement){

    }
  }
  //use MyComponent in MyComponent1
  @Component
  export class MyComponent1 extends VueComponent{
    render(h: CreateElement){
      // type ckeck error 
      return <MyComponent></MyComponent>
    }
  }
  ```

#### about `vuex`

- define vuex module State

  ```typescript
  export type EventState = {
    name: string;
  }
  const state = {
    name: ''
  }
  // declartion migration globalState
  declare module "../.." {
    interface AppStoreStates {
      event: EventState
    }
  }
  ```

- define vuex module getters
  ```typescript
  type EventGetters = {
    // name : return type
    nameLength: number;
  }
  const getters: GetterModule<EventGetters, EventState> = {
    nameLength(state) {
      return state.name.length;
    }
  }
  //AppStoreGetters globalGetters type
  declare module "../.." {
    // common module
    interface AppStoreGetters extends EventGetters { }
    // namespaced module
    interface AppStoreGetters {
      event:EventGetters
    }
  }
  ```

- define vuex mutations

  ```typescript
  type EventMutations = {
    setName: string
  }
  const mutations: MutationModule<EventMutations, EventState> = {
    setName(state, payload) {
      state.name = payload;
    }
  }
  // AppStoreMutations global mutation type
  declare module "../.." {
    interface AppStoreMutations {
      // EventModule result of MakeVuexModule
      event: typeof EventModule.mutations
    }
  }
  ```

 - define vuex Actions
    ```typescript
      type EventActions = {
        clearName: boolean
      }

      const actions: ActionModule<EventActions, EventState, EventGetters> = {
        clearName(context, payload) {
          if (payload) {
            // commit from root
            context.commit(StoreMutations.event.setName, '', { root: true })
          } else {
            // commit from module
            context.commit(ModuleMutations.setName, '')
            console.info(`commit from module`)
          }
        }
      }
      declare module "../.." {
        interface AppStoreActions {
          // EventModule result of MakeVuexModule
          event: typeof EventModule.actions
        }
      }
    ```
- define vuex module   
  `MakeVuexModule(moduleTree:_moduleTree,moduleName: string,namespace: boolean = false)`   
  ```typescript
  const moduleInstance = {
    state,
    getters,
    mutations,
    actions
  }
  // no namespaced
  const EventModule = MakeVuexModule(moduleInstance, 'event',false);
  const ModuleMutations = EventModule.moduleMutations;
  // wrap of BindToRootActions
  registeActions(EventModule.actions, 'event');
  // wrap of BindToRootMutation
  registeMutations(EventModule.mutations, 'event')
  export default EventModule.module;//this is vuex module
  ```

- global store   
  type define global Store 
  ```typescript
  export interface AppStoreStates { }
  export interface AppStoreGetters { }
  export interface AppStoreActions { }
  export interface AppStoreMutations { }
  export interface AppStore extends InjectStore<AppStoreStates, AppStoreGetters> { }
  ```
  define global Actions and Mutaions , then we can use declaration migration to enhance them;   
  ```typescript
  export const StoreActions: AppStoreActions = {} as any;
  export const StoreMutations: AppStoreMutations = {} as any;
  //wrap of Bindings to StoreActions/StoreMutations
  export function registeActions<Actions = any>(actions: ActionNames<Actions>, namespace: string) {
    BindToRootActions(actions, namespace, StoreActions)
  }
  export function registeMutations<Mutations = any>(mutations: MutationNames<Mutations>, namespace: string) {
    BindToRootMutation(mutations, namespace, StoreMutations);
  }
  ```
  
  type define utils of GetterModule,MutationModule,ActionModule
  ```typescript
  export type GetterModule<Typedef, State> = AbstractGetterModule<Typedef, State, AppStoreStates, AppStoreGetters>;
  export type MutationModule<Typedef, State> = AbstractMutationModule<Typedef, State>;
  export type ActionModule<Typedef, State, Getters> = AbstractActionModule<Typedef, State, Getters, AppStoreStates, AppStoreGetters>;
  ```
  define vuex store and InjectIt
  ```typescript
  import dom from './modules/dom';
  import event from './modules/event';

  const store: AppStore = new Vuex.Store({
    modules: {
      dom,
      event
    }
  }) as any;
  InjectStore(store);
  // after 
  //you can use store.Commit with StoreMutations
  //you can use store.Dispatch with StoreMutations
  export { store }

  // define a class Injected AppStore
  export interface PageComponent<Props = {}> extends VueComponent<Props, AppStore> { }
  export class PageComponent<Props = {}> extends VueComponent<Props, AppStore>{ }
  ```