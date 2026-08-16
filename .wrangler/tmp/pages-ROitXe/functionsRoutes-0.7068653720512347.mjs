import { onRequest as __api_pluggy___path___js_onRequest } from "/home/neperz/financeiro/functions/api/pluggy/[[path]].js"

export const routes = [
    {
      routePath: "/api/pluggy/:path*",
      mountPath: "/api/pluggy",
      method: "",
      middlewares: [],
      modules: [__api_pluggy___path___js_onRequest],
    },
  ]