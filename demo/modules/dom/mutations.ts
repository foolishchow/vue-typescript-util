import { MutationModule } from "../..";
import { DomState } from "./state";


type DomMutations = {
  setActive: number
}
export const mutations: MutationModule<DomMutations, DomState> = {
  setActive(state, payload) {
    state.active = payload;
  }
}

