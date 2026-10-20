import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "node_modules/**", "public/**", "Data/**", "screenshots/**", "lib/generated/**"] },
];

export default config;
