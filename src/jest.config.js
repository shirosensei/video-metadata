export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const globals = {
  'ts-jest': {
    isolatedModules: true,

  },
};
  
export const testMatch = ['**/test/**/*.test.ts', '**/test/**/*.spec.ts'];
export const moduleFileExtensions = ['ts', 'js', 'json'];