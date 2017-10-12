# create-react-app 

` create-react-app ` 顾名思义就是 ` ReactJS ` 的脚手架工具，利用这个脚手架工具我们就可以很快速的创建一个 `React` 的开发环境了。虽然不能完全满足我们的需求，但是极大多数的问题都帮我们解决了，后续有什么特殊的功能要求，在此基础上添加完善就行了。

> 注意：下面利用 ` npm ` 安装包文件的命令中的 ` npm ` 都可以替换成 ` yarn `，前提是您的本地上全局安装了 ` yarn `，否则免谈。检测本地是否安装了 ` yarn ` 执行命令 ` yarn -v `

### 环境安装

> ` npm install create-react-app -g ` -> 全局安装 ` create-react-app ` 

> ` create-react-app myapp ` -> 在自己的目录利用脚手架工具初始化一个项目环境

> ` cd myapp ` -> 进入刚初始化好的项目环境中

> ` npm start ` -> 启动项目

执行到最后，` node ` 包会起一个监听 ` 3000 ` 端口的服务，并在浏览器里面自动打开。

### 环境介绍

仔细的小伙伴会发现，此时的项目目录文件很少，许多配置文件都没有看见，这样会阻碍我们理解脚手架的执行和编译。大家不必慌张，文件是有的，只是官网为了让我们在初始化开发环境的时候速度快捷把相关的配置文件都隐藏了，为了让配置文件显示出来，只需要执行命令 

> ` npm run eject `

等命令执行完后，大家想看到的文件就都会出现了。

### 加入工具

- 1、加入 ` scss `

> ` npm install sass-loader node-sass --save-dev ` -> 安装 ` sass ` 编译工具

> 修改 ` webpack.config.dev.js ` 配置

```javascript
  loaders: [
    {
      exclude: [
        /\.html$/,
        /\.(js|jsx)$/,
        /\.css$/,
        /\.json$/,
        /\.svg$/,
        /\.scss$/
      ],
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader?importLoaders=1!postcss'
    },
    {
      test: /\.scss$/,
      include: paths.appSrc,
      loaders: ["style-loader", "css-loader", "sass-loader"]
    }
  ]
```

> 修改 ` webpack.config.prod.js ` 配置

```javascript
  loaders: [
    {
      exclude: [
        /\.html$/,
        /\.(js|jsx)$/,
        /\.css$/,
        /\.json$/,
        /\.svg$/,
        /\.scss$/
      ],
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.(scss|sass)$/,
      include: paths.appSrc,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?importLoaders=1!postcss')
    }
  ] 
```

> 注意：这里一定是要修改生产和开发两个配置文件

- 2、加入 ` ant design `

> ` yarn add antd ` -> 从 ` yarn ` 或者 ` npm ` 安装并引入 ` antd `

> 修改 ` src/App.js `，引入 ` antd ` 的按钮组件

```javascript
  import React, { Component } from 'react';
  import Button from 'antd/lib/button';
  import './App.css';

  class App extends Component {
    render() {
      return (
        <div className="App">
          <Button type="primary">Button</Button>
        </div>
      );
    }
  }

  export default App;
```

> 修改 ` src/App.css `，在文件顶部引入 ` antd/dist/antd.css `

```css
  @import '~antd/dist/antd.css';

  .App {
    text-align: center;
  }
```

- 3、按需加入 ` ant design `

> ` yarn add react-app-rewired --dev ` 引入 ` react-app-rewired ` 并修改 ` package.json ` 里面的启动配置

```javascript
  /* package.json */
  "scripts": {
  -   "start": "react-scripts start",
  +   "start": "react-app-rewired start",
  -   "build": "react-scripts build",
  +   "build": "react-app-rewired build",
  -   "test": "react-scripts test --env=jsdom",
  +   "test": "react-app-rewired test --env=jsdom",
  }
```

> 在项目根目录创建一个 ` config-overrides.js ` 用于修改默认配置。

```javascript
  module.exports = function override(config, env) {
    // do stuff with the webpack config...
    return config;
  };
```

> ` yarn add babel-plugin-import --dev ` 加入按需加载组件代码和样式的 ` babel ` 插件，并修改 ` config-overrides.js ` 文件

```javascript
+ const { injectBabelPlugin } = require('react-app-rewired');

  module.exports = function override(config, env) {
+   config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config);
    return config;
  };
```

> 移除前面在 ` src/App.css ` 里全量添加的 ` @import '~antd/dist/antd.css'; ` 样式代码，并且按下面的格式引入模块。  

```javascript
  // scr/App.js
  import React, { Component } from 'react';
- import Button from 'antd/lib/button';
+ import { Button } from 'antd';
  import './App.css';

  class App extends Component {
    render() {
      return (
        <div className="App">
          <Button type="primary">Button</Button>
        </div>
      );
    }
  }

  export default App;
```

- 4、自定义 ` ant design ` 主题

自定义主题需要用到 less 变量覆盖功能

> ` yarn add react-app-rewire-less --dev ` 引入 react-app-rewire 的 less 插件 react-app-rewire-less 来帮助加载 less 样式，同时修改 config-overrides.js 文件。

```javascript
  const { injectBabelPlugin } = require('react-app-rewired');
+ const rewireLess = require('react-app-rewire-less');

  module.exports = function override(config, env) {
-   config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config);
+   config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
+   config = rewireLess(config, env, {
+     modifyVars: { "@primary-color": "#1DA57A" },
+   });
    return config;
  };
```

这里利用了 less-loader 的 modifyVars 来进行主题配置

> 注意：执行这里之前我们做的 ` scss ` 配置样式就不起作用了，但是将 ` scss ` 改成 ` less ` 是 ` OK ` 的，这里先留个问题，怎么在按需加载 ` ant design ` 时，同时引入 ` scss ` 样式文件。