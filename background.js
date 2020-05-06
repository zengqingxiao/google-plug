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
