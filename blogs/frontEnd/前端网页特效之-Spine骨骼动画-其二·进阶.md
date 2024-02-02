---
title: 前端网页特效之-Spine骨骼动画-其二·进阶
date: 2023-01-12
tags:
 - JavaScript
 - Spine
 - Canvas
categories:
 - 前端
---
## 前言
在上节(其一)中简单介绍如何基础使用Spine骨骼动画，在这节中将展示更进一步的玩法。
在主线程中渲染大量的特效，如果此时运算量比较高导致的卡顿，会导致用户的体验不够好，接下来来优化播放骨骼的环境。
已知 JavaScript 是一种单线程的语言，但可以使用 web workers 弥补语言的不足，使用 Worker 来增加`多线程`的机制。
函数的环境解决了，现在来解决画布的环境，使用Canvas api 中的 OffscreenCanvas ，它提供了一个可以脱离屏幕渲染的 canvas 对象，它与 Worker 的搭配是很不错的。
>1. 以上提到的API 都需要浏览器是否支持，建议使用 Chrome 或 Edge 浏览器
>2. 以上 API 的基本用法，需要有所了解
>3. 离屏渲染是一种优化图形渲染性能的技术，它允许在主线程之外的线程中进行图形渲染，从而不会阻塞用户的交互操作。然而，由于离屏渲染发生在主线程之外，因此它无法直接处理用户的交互事件，如点击或滑动等
## 实操

* 新建一个html文件，我取名为`离屏`
```javascript
<!DOCTYPE html>  
<html lang="zh">  
<head>  
  <meta charset="UTF-8">  
  <title>Title</title>  
  <style>  
      * {  
          margin: 0;  
          padding: 0;  
      }  
  
      body,  
      html {  
          height: 100%  
      }  
  
      canvas {  
          position: absolute;  
          width: 100%;  
          height: 100%;  
          transform: translate3d(0, 0, 0);  
      }  
  </style>  
</head>  
<body>  
  
<center>  
  <div class="btns">  
    <span>动画名称:</span>  
    <select id="animationList"></select>  
  </div>  
</center>  
  
<script>  
  // 创建 worker 线程
  let worker = new Worker('worker.js');  
  let canvas = document.createElement("canvas");  
  canvas.className = 'spine-animation';  
  canvas.width = window.innerWidth;  
  canvas.height = window.innerHeight;  
  document.body.appendChild(canvas);  
  let animationlist = document.getElementById("animationList");  
  // HTMLCanvasElement.transferControlToOffscreen()`将控制转移到一个在主线程或者 web worker 的对象上, 会返回一个 OffscreenCanvas 对象。
  let canvas2 = canvas.transferControlToOffscreen();  
  let path = "sgs/zh/";
  // 接收信息
  worker.onmessage = function (ev) {  
    let data = ev.data;  
    if (data.message == 'DATA') {  
      let animations = data.animations;  
      let frag = document.createDocumentFragment();  
      for (let i = 0; i < animations.length; i++) {  
        let option = document.createElement("option");  
        option.value = animations[i];  
        option.text = animations[i];  
        if (option.text == data.now) option.selected = true;  
        frag.appendChild(option);  
      }  
      animationlist.appendChild(frag);  
      animationlist.onchange = changeAnimation;  
    }  
  }  
  // 发送信息
  worker.postMessage({message: 'INIT', canvas: canvas2, path, name: "XingXiang"}, [canvas2]);  
  
  window.addEventListener("resize", function () {  
    worker.postMessage({  
      message: 'UPDATE',  
      width: canvas.clientWidth,  
      height: canvas.clientHeight  
    })  
  })  
  
  function changeAnimation(e) {  
    worker.postMessage({message: 'CHANGE', animation: this.value})  
  }  
  
</script>  
</body>  
</html>
```
	 这次演示的骨骼动画是一个二进制的文件，二进制对人类不可读，json对人类可读，生成二进制的文件是对性能的进一步需求
* 新建一个js文件，我取名为 `worker`
```javascript
// 引入 spine 运行库，也可以加载其它的封装库
importScripts('spine.js');  
  
var window = self;  
var devicePixelRatio = 1;  
var documentZoom = 1;  
var HTMLCanvasElement = function () {  
  return 'HTMLCanvasElement';  
};  
var HTMLElement = function () {  
  return 'HTMLElement';  
};  
  
var canvas, gl, shader, batcher, skeletonRenderer, assetManager, sprite;  
var mvp = new spine.webgl.Matrix4();  
var filename,filepath;  
  
function init() {  
  gl = canvas.getContext('webgl2', {alpha: true});  
  // 初始化Spine运行时  
  // 着色器  
  shader = spine.webgl.Shader.newTwoColoredTextured(gl);  
  // 多边形渲染器  
  batcher = new spine.webgl.PolygonBatcher(gl);  
  mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);  
  // 骨骼渲染器  
  skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);  
  
  // 资源管理器，第二个参数可以传路径 默认的资源路径  
  assetManager = new spine.webgl.AssetManager(gl);  
  
  // 加载资源  
  assetManager.loadBinary(filepath + filename + '.skel');  
  // 这个方法会将.atlas文件内相关的图片文件一并加载到管理器中  
  // assetManager.loadTextureAtlas(filepath + filename + '.atlas');  
  assetManager.loadText(filepath + filename + '.atlas',function (path, data) {  
    var imageName = null;  
    var atlasReader = new spine.TextureAtlasReader(data);  
    while (true) {  
      var line = atlasReader.readLine();  
      if (line == null) break;  
      line = line.trim();  
  
      if (line.length == 0) {  
        imageName = null;  
      } else if (!imageName) {  
        imageName = line;  
        assetManager.loadTexture(filepath + imageName);  
      } else {  
        continue;  
      }  
    }  
  })  
  
  requestAnimationFrame(load);  
}  
  
function load() {  
  if (assetManager.isLoadingComplete()) {  
    sprite = loadSkeleton(filename, "DaiJi", false);  
    requestAnimationFrame(render)  
  } else {  
    requestAnimationFrame(load);  
  }  
}  
  
function loadSkeleton(name, initialAnimation, premultipliedAlpha, skin) {  
  // 如果skin未定义，则设置skin为默认皮肤  
  if (skin === undefined) skin = "default";  
  // 通过assetManager获取骨骼图集  
  var atlas = new spine.TextureAtlas(assetManager.get(filepath + filename + '.atlas'), function(path){  
    return assetManager.get(filepath + path);  
  });  
  // console.log(atlas);  
  // 创建AtlasAttachmentLoader，用于加载骨骼图集中的附件  
  var atlasLoader = new spine.AtlasAttachmentLoader(atlas);  
  // 使用AtlasAttachmentLoader创建SkeletonJson，用于解析骨骼数据  
  // var skeletonJson = new spine.SkeletonJson(atlasLoader);  
  var skeletonBinary = new spine.SkeletonBinary(atlasLoader);  
  // 读取骨骼数据文件，获取骨骼数据  
  var skeletonData = skeletonBinary.readSkeletonData(assetManager.get(filepath + name + ".skel"));  
  // 创建骨骼对象，使用骨骼数据  
  var skeleton = new spine.Skeleton(skeletonData);  
  
  skeleton.opacity = 1;  
  // 设置骨骼的皮肤  
  skeleton.setSkinByName(skin);  
  // 设置骨骼的姿势  
  skeleton.setToSetupPose();  
  // 更新骨骼的世界变换  
  skeleton.updateWorldTransform();  
  // 初始化骨骼的边界框  
  skeleton.bounds = {offset: new spine.Vector2(), size: new spine.Vector2()};  
  skeleton.getBounds(skeleton.bounds.offset, skeleton.bounds.size, []);  
  
  // 根据骨骼数据创建骨骼动画状态，并使用 initialAnimation 参数作为初始要播放的动画  
  skeleton.state = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));  
  skeleton.state.setAnimation(0, initialAnimation, true);  
  console.log(skeleton);  
  var actions = skeleton.data.animations;  
  var result = new Array(actions.length);  
  for (var i = 0; i < actions.length; i++) result[i] = actions[i].name;  
  window.postMessage({  
    message: "DATA",  
    now: initialAnimation,  
    animations: result  
  })  
  return {skeleton, state: skeleton.state, bounds: skeleton.bounds, premultipliedAlpha}  
}  
  
var frameTime = undefined;  
var isBind;  
  
function render(timestamp) {  
  var delta = timestamp - ((frameTime == undefined) ? timestamp : frameTime);  
  frameTime = timestamp;  
  
  // 更新 MVP 矩阵以调整画布大小  
  resize();  
  
  gl.clearColor(0, 0, 0, 0);  
  gl.clear(gl.COLOR_BUFFER_BIT);  
  
  // 根据增量时间更新动画状态  
  var state = sprite.state;  
  var skeleton = sprite.skeleton;  
  var bounds = sprite.bounds;  
  
  state.update(delta / 1000);  
  state.apply(skeleton);  
  skeleton.updateWorldTransform();  
  
  if (!isBind) {  
    // 绑定着色器并设置纹理和mvp矩阵。  
    // 如果没有unbind() 则不需要重复bind  
    shader.bind();  
    shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);  
  }  
  
  shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);  
  
  // 启动 batcher 并告诉 SkeletonRenderer 渲染要播放骨骼。  
  batcher.begin(shader);  
  
  skeletonRenderer.premultipliedAlpha = sprite.premultipliedAlpha;  
  skeletonRenderer.draw(batcher, skeleton);  
  batcher.end();  
  
  // shader.unbind();  
  
  requestAnimationFrame(render);  
}  
  
// 在render中调用，保证屏幕变化时 骨骼也能正确显示  
function resize() {  
  var bounds = sprite.bounds;  
  
  // 让其骨骼始终居中，大小保持合适  
  var centerX = bounds.offset.x + bounds.size.x / 2;  
  var centerY = bounds.offset.y + bounds.size.y / 2;  
  var scaleX = bounds.size.x / canvas.width;  
  var scaleY = bounds.size.y / canvas.height;  
  var scale = Math.max(scaleX, scaleY) * 1.2;  
  if (scale < 1) scale = 1;  
  var width = canvas.width * scale;  
  var height = canvas.height * scale;  
  
  mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);  
  gl.viewport(0, 0, canvas.width, canvas.height);  
}  
  
onmessage = function (e) {  
  var data = e.data;  
  switch (data.message) {  
    case 'INIT':  
      canvas = data.canvas;  
      // console.log(canvas);  
      filepath = data.path;  
      filename = data.name;  
      requestAnimationFrame(init);  
      break;  
    case 'UPDATE':  
      update(data);  
      break;  
    case 'CHANGE':  
      sprite.skeleton.state.setAnimation(0, data.animation, true)  
      break;  
  }  
}  
  
function update(obj) {  
  canvas.width = obj.width;  
  canvas.height = obj.height;  
}
```
> 把上节的代码复制过来，加以改造即可使用
> 本案例比较单一，还有更多的优化空间，比如封装成一个管理对象 播放更多的骨骼特效，对骨骼对象更好的操作、管理 等等