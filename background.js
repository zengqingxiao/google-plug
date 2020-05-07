console.log('---- 插件 background 加载完成 ----');
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (res, sender, sendResponse) {
  // console.log(res, sender, sendResponse);
  // console.log(res.target);
  // 广播消息
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, res);
  });
  sendResponse(res);
});

// 由于page_action是在清单中声明的​​，因此取决于扩展名来告知浏览器用户何时可以与进行交互popup.html。
// 使用侦听器事件中的declarativeContent API 将声明的规则添加到后台脚本 runtime.onInstalled。

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 只有打开百度才显示pageAction
          new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'http://vis.vip.com/' } })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});



// chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//   chrome.declarativeContent.onPageChanged.addRules([{
//     conditions: [new chrome.declarativeContent.PageStateMatcher({
//       pageUrl: { urlContains: 'http://vis.vip.com/' },
//     })
//     ],
//     actions: [new chrome.declarativeContent.ShowPageAction()]
//   }]);
// });