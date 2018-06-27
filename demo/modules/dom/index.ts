import { actions } from "./actions";
import { getters, DomGetters } from "./getters";
import { mutations } from "./mutations";
import { state, DomState } from "./state";
import { getActionName, getMutatationName } from "../../..";
import { StoreActions, StoreMutations } from "../..";
import { MakeVuexModule, BindToRootActions, BindToRootMutation } from "../../..";

const ActionNames = getActionName(actions, 'dom')
StoreActions.dom = ActionNames;
const MutationsNames = getMutatationName(mutations, 'dom');
StoreMutations.dom = MutationsNames;

export const ModuleMutations = getMutatationName(mutations);
declare module "../.." {
  interface AppStoreStates {
    dom: DomState
  }
  interface AppStoreGetters {
    dom: DomGetters
  }
  interface AppStoreMutations {
    dom: typeof domModule.mutations
  }
  interface AppStoreActions {
    dom: typeof domModule.actions
  }
}
const m = {
  state,
  getters,
  mutations,
  actions
};
const domModule = MakeVuexModule(m, 'dom', true);
BindToRootActions(domModule.actions, 'dom', StoreActions);
BindToRootMutation(domModule.mutations, 'dom', StoreMutations);
export default domModule.module;


