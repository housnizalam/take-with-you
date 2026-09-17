const apiConfig = {
  protocol: "http",
  host: "localhost",
  port: 3000
};

apiConfig.baseUrl =
  `${apiConfig.protocol}://${apiConfig.host}:${apiConfig.port}`;

export default apiConfig;