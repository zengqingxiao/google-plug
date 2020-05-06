// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
(function (window, document) {
  chrome.devtools.inspectedWindow.eval('inspect(location.href)', result => {
    if (result.indexOf('http://compass.vis.vip.com/') != -1) {
      chrome.devtools.panels.create('流量来源', './images/get_started16.png', 'devtools-traffic-sources.html', panel => {
        console.log('---- 流量来源创建成功 ----')
      });
    }
  })
})(window, document)
