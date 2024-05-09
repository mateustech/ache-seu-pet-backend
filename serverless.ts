export default {
  plugins: ["serverless-offline", "serverless-offline-watcher"],
  custom: {
    "serverless-offline-watcher": [
      {
        path: ["src/**/*.ts"],
        command: `echo "api folder or js file in cow folder was modified!"`,
      },
    ],
  },
};
