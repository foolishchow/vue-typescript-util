import Vue from "vue";
import { Store } from "vuex";
export declare type VueModelType<T> = {
    value: T;
    onInput?: (value: T) => void;
} | {
    'v-model'?: T;
};
export interface VueDefaultJSXElementAttributes {
    ref?: string;
    slot?: string;
    'v-show'?: boolean;
    domPropsInnerHTML?: string;
    class?: (string | {
        [key: string]: boolean;
    }) | (string | {
        [key: string]: boolean;
    })[];
    style?: (string | {
        [key: string]: boolean;
    }) | (string | {
        [key: string]: boolean;
    })[];
    key?: string | number;
    onClick?: (e: MouseEvent) => any;
    'on-click'?: (e: MouseEvent) => any;
    onDblclick?: (e: MouseEvent) => any;
    'on-dblclick'?: (e: MouseEvent) => any;
    onMouseenter?: (e: MouseEvent) => any;
    'on-mouseenter'?: (e: MouseEvent) => any;
    onMouseleave?: (e: MouseEvent) => any;
    'on-mouseleave'?: (e: MouseEvent) => any;
}
export interface VueComponent<store extends Store<any> = Store<any>, Props = {}> extends Vue {
    $props: Props & VueDefaultJSXElementAttributes;
    $store: store;
}
export declare class VueComponent<store extends Store<any> = Store<any>, Props = {}> extends Vue {
}
