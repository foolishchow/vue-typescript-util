# vue-typescript-util

[English](../README.MD) [中文]
> 更便利的使用 Typescript 书写 Vue

### 模块变量

- `VueComponent<Props={}, store extends Store<any> = Store<any>>`
  配合`vue-class-component`你可以在Vue中使用Typescript 类型推导
  ```typescriptreact
  import Component from "vue-class-component";
  import { Prop } from "vue-property-decorator"
  import { VueComponent } from "vue-typescript-util";
  import { CreateElement } from "vue";

  export type MyComponentPropsType = {
    name:string;
    title?:string;
  }
  //定义一个组件
  @Component
  export class MyComponent extends VueComponent<MyComponentPropsType>{
    @Prop()
    name:string;
    @Prop()
    title:string;
    render(h: CreateElement){

    }
  }
  //在别的组件里面使用
  @Component
  export class MyComponent1 extends VueComponent{
    render(h: CreateElement){
      // 这里会有类型推导报错
      return <MyComponent></MyComponent>
    }
  }
  ```

-
