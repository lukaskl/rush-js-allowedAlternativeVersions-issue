/**
 * When using the PNPM package manager, you can use pnpmfile.js to customize
 * how dependencies are resolved.
 */
module.exports = {
  hooks: {
    readPackage
  }
};

function readPackage(packageJson, context) {
  return packageJson;
}
