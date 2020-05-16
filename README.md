# react脚手架（TypeScrpit版）
简介：react脚手架（TypeScrpit版），基于create-react-app3.2打造，内部集成typescript，tslint
框架内部实现路由（react-router-dom）、与后端交互（使用axios）、权限体系（基于token）、redux、数据mock、环境及变量（区分dev，demo，prod环境）、自动生成代码等功能  
为保证正常使用本脚手架，请确保以下功能正确安装：  
1、visual studio code  
参考：https://code.visualstudio.com/  
2、node.js  
参考：https://nodejs.org/en/  
3、create-react-app  
参考：https://www.jianshu.com/p/e16a9da931ec 
4、git  
参考：https://git-scm.com/book/zh/v1/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git 

## 一、快速开始
### 安装依赖
npm install

### 启动
npm start

## 二、关键点
### 1、前端权限校验
由于react-router-dom没有提供像vue-router的导航守卫函数，所以权限校验只能自己写，本框架使用高阶组件方式实现，具体代码在：src/display/components/AuthRoute.tsx 中，其中TO-DO处，需要增加判断逻辑，首先判断是否登录，其次判断当前登录用户是否具有权限访问即将访问路由。未登录的可以跳转到登录页，没有权限的跳转到无授权页

### 2、设置请求header
在src/utils/ajaxUtils.ts文件中，有一个setHeader方法，内部需要获取当前登录用户，将得到的token等设置到请求header中

### 3、请求/响应拦截
同样在2中的文件里，有请求过滤器和响应过滤器，可以在这两处增加逻辑，如请求之前设置header（与2步相同），根据响应的http-code，封装返回等

### 4、登录信息扩充
src/dataModel/IToken.ts定义了判断权限需要的必要参数，其中IPages和ILoginInfo是可以扩展的，分别在同级目录下的IPages.ts和ILoginInfo.ts中，框架中定义了常用的字段，可根据项目扩充

## 三、待完善内容
### 1、mock
### 2、主页面布局
参见antd Layout，每个项目应根据项目需要进行布局，并通过全局css，控制布局样式

### 3、自动生成代码
npm run cre
#### (1)、生成一个接口
npm run cre a [name] [module]  
[name] 接口名称  
[module] 生成在那个模块下  

#### (2)、生成一个普通module
npm run cre m [name] [parent]  
[name] 模块名称
[parent] 模块上级目录，支持多级目录，例如Home/xxx/xxx

#### (3)、生成一个路由module
npm run cre m-r [name] [parent]  
参数说明同普通module，不同的是，生成时，会生成Swtich结构，以及router.tsx文件，在router.tsx中设置子路由

### 4、CI/CD，不同环境打包不同参数
