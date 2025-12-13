const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const envConfigFile = `export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL}',
};
`;

const prodEnvConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL}',
};
`;

const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const targetProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`Environment file generated correctly at ${targetPath} \n`);
});

fs.writeFile(targetProdPath, prodEnvConfigFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`Production environment file generated correctly at ${targetProdPath} \n`);
});
