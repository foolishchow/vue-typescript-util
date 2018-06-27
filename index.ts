import { VueDefaultJSXElementAttributes } from './vue-utils';
import { Store } from "vuex";
import Vue from "vue";

export * from './vue-utils'
export * from './vuex-utils'

export interface VueComponent<Props={}, store extends Store<any> = Store<any>> extends Vue {
  $props: Props & VueDefaultJSXElementAttributes;
  $store: store
}
export class VueComponent<Props={}, store extends Store<any> = Store<any>> extends Vue { }
