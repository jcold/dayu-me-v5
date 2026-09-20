// 您的白名单列表
const ALLOWED_ORIGINS = [
  "http://localhost:9081",
  "https://dayu.me",
  "https://zy.dayu.me",
  "https://ys.dayu.me",
  "https://sh.dayu.me",
];

// ----------------------------------------------------
// 用于处理实际请求（GET/POST/PUT）
// ----------------------------------------------------
async function handleActualRequest(request) {
  const origin = request.headers.get("Origin");

  // 1. 从 R2 存储桶获取原始响应
  const response = await fetch(request);

  // 2. 创建一个可修改的新响应对象
  const newResponse = new Response(response.body, response);

  // 3. 检查 Origin 是否在白名单中
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    // 关键步骤：设置 ACAO 为精确匹配的 Origin 值
    newResponse.headers.set("Access-Control-Allow-Origin", origin);

    // 设置其他必需的 CORS 头
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, PUT, POST");
    newResponse.headers.set("Access-Control-Allow-Headers", "*");
    // 您可以根据需要修改 AllowedHeaders
  }

  return newResponse;
}

// ----------------------------------------------------
// 用于处理 OPTIONS 预检请求
// ----------------------------------------------------
function handleOptionsRequest(request) {
  const origin = request.headers.get("Origin");
  const requestHeaders = request.headers.get("Access-Control-Request-Headers");
  const headers = {};

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    // 设置 ACAO 为精确匹配的 Origin 值
    headers["Access-Control-Allow-Origin"] = origin;

    // 允许的 METHODS 和 HEADERS
    headers["Access-Control-Allow-Methods"] = "GET, PUT, POST";
    headers["Access-Control-Allow-Headers"] = requestHeaders || "*";

    // 缓存预检结果 24 小时 (86400 秒)
    headers["Access-Control-Max-Age"] = "86400";

    return new Response(null, {
      status: 204, // 预检成功响应码 (No Content)
      headers: headers,
    });
  }

  // 如果 Origin 不在白名单，返回 403 阻止预检通过
  return new Response(null, { status: 403 });
}

addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method === "OPTIONS") {
    event.respondWith(handleOptionsRequest(request));
  } else {
    event.respondWith(handleActualRequest(request));
  }
});
