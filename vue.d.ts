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
    onClick?: (e: MouseEvent) => any | void;
    'on-click'?: (e: MouseEvent) => any | void;
    onDblclick?: (e: MouseEvent) => any | void;
    'on-dblclick'?: (e: MouseEvent) => any | void;
    onMouseenter?: (e: MouseEvent) => any | void;
    'on-mouseenter'?: (e: MouseEvent) => any | void;
    onMouseleave?: (e: MouseEvent) => any | void;
    'on-mouseleave'?: (e: MouseEvent) => any | void;
}
export interface VueComponent<store extends Store<any> = Store<any>, Props = {}> extends Vue {
    $props: Props & VueDefaultJSXElementAttributes;
    $store: store;
}
export declare class VueComponent<store extends Store<any> = Store<any>, Props = {}> extends Vue {
}
