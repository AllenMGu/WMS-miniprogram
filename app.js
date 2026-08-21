const { getToken, getUser, clearAuth } = require("./utils/auth");

App({
  globalData: {
    apiBaseUrl: "https://HOST/api",
    token: "",
    user: null
  },
  onLaunch() {
    this.globalData.token = getToken() || "";
    this.globalData.user = getUser() || null;
  },
  logoutAndGoLogin() {
    clearAuth();
    this.globalData.token = "";
    this.globalData.user = null;
    wx.reLaunch({ url: "/pages/login/index" });
  }
});
