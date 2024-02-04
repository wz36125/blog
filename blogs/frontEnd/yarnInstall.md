---
title: yarn的安装
date: 2019-09-21
tags:
 - yarn
 - node
 - npm
categories:
 - 前端
---

##  简介
- Yarn 是一个现代化的 JavaScript 包管理工具，旨在提供更快、可靠和安全的包管理体验。它由 Facebook、Google、Exponent 和 Tilde 共同开发，与 npm 相互兼容，并提供了一些增强的功能和性能优化。
- 是一个强大且易于使用的工具，被广泛应用于 JavaScript 和 Node.js 项目的包管理和依赖管理中。它提供了更快、可靠和一致的包管理体验，使开发人员能够更高效地构建和管理项目。
## 1.检查环境
   确保你的计算机上已经安装了 Node.js。Yarn 是基于 Node.js 的，所以首先需要确保 Node.js 已正确安装。你可以在命令行中输入以下命令来检查 Node.js 是否已安装并查看其版本：

   ```shell
   node -v
   ```

   如果 Node.js 尚未安装，请前往 Node.js 官方网站（https://nodejs.org）下载并安装适合你操作系统的版本。

## 2.安装 Yarn
   一旦你确认了 Node.js 的安装，你可以通过以下方式来安装 Yarn：

   在命令行中运行以下命令，使用 Node.js 的包管理器 npm 安装 Yarn：

  ```shell
    npm install -g yarn
  ```

   如果你更喜欢使用其他包管理器，比如 Homebrew（仅适用于 macOS）或 Chocolatey（仅适用于 Windows），可以按照它们的安装说明来安装 Yarn。

## 3.验证安装
   安装完成后，你可以在命令行中输入以下命令来验证 Yarn 是否成功安装：
   ```shell
   yarn --version
   ```
   如果成功显示 Yarn 的版本号，说明安装成功。

## 4.开始使用 Yarn
   一旦 Yarn 安装完成，你可以在你的项目目录中运行 Yarn 命令。以下是几个常用的 Yarn 命令：
   - 初始化一个新项目：
      ```shell
      yarn init
      ```
   - 安装项目依赖：

      ```shell
      yarn install
      ```
   - 添加依赖项到项目：

      ```shell
      yarn add package-name
      ```

   - 删除项目中的依赖项：

      ```shell
      yarn remove package-name
      ```

   - 运行项目的脚本命令：

      ```shell
      yarn run script-name
      ```

   请根据你的具体需求使用适当的 Yarn 命令。你可以通过运行以下命令来获取更多关于 Yarn 命令的帮助和文档：

   ```shell
   yarn help
   ```
## 5.设置镜像
   在 Yarn 中，你可以通过配置镜像来加快包的下载速度或更改默认的包源。以下是一些常用的 Yarn 镜像设置方法：

   - 设置全局镜像：

   ```shell
   yarn config set registry <registry-url>
   ```

   - 其中 `<registry-url>` 是你想要使用的镜像地址，例如 "https://registry.npm.taobao.org" 是淘宝镜像。通过设置全局镜像，所有的项目都将使用该镜像进行包的下载。

   - 设置项目级别镜像： 
   - 在你的项目根目录下，创建一个 `.yarnrc` 文件，并在其中添加以下内容：

   ```shell
   registry <registry-url>
   ```

   - 同样，`<registry-url>` 是你想要使用的镜像地址。这将使得该项目中的 Yarn 命令使用指定的镜像。

   - 临时使用镜像：

   如果你只想临时使用一个镜像，而不改变全局或项目级别的设置，可以在使用 Yarn 命令时添加 `--registry` 参数，如下所示：

   ```shell
   yarn install --registry <registry-url>
   ```

   - 这将在特定的命令中临时使用指定的镜像地址。

   - 常用的 Yarn 镜像源包括淘宝镜像（https://registry.npm.taobao.org）、npm 官方镜像（https://registry.npmjs.org）、cnpm 镜像（https://r.cnpmjs.org）等。