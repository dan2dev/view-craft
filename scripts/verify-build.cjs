#!/usr/bin/env node

/**
 * Build Verification Script for View-Craft
 * 
 * This script verifies that all improvements are working correctly:
 * - Type system reorganization
 * - Enhanced error handling
 * - Improved environment detection
 * - Safe DOM operations
 * - Enhanced reactive system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logHeader(message) {
  log(`\n${colors.bold}=== ${message} ===${colors.reset}`, 'blue');
}

// Verification checks
const checks = {
  typeSystem: {
    name: 'Type System Reorganization',
    verify: () => {
      const typeFiles = [
        'types/core/base.d.ts',
        'types/html/tags.d.ts',
        'types/svg/base.d.ts',
        'types/svg/tags.d.ts',
        'types/features/list.d.ts',
        'types/features/when.d.ts',
        'types/features/update.d.ts',
        'types/index.d.ts'
      ];

      let allExist = true;
      typeFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        if (!fs.existsSync(fullPath)) {
          logError(`Type file missing: ${file}`);
          allExist = false;
        }
      });

      if (allExist) {
        logSuccess('All organized type files exist');
        
        // Check that main types file imports others
        const mainTypesPath = path.join(__dirname, '..', 'types/index.d.ts');
        const content = fs.readFileSync(mainTypesPath, 'utf8');
        const expectedImports = [
          './core/base',
          './svg/base', 
          './html/tags',
          './svg/tags',
          './features/list',
          './features/when',
          './features/update'
        ];

        const hasAllImports = expectedImports.every(imp => content.includes(imp));
        if (hasAllImports) {
          logSuccess('Main types file correctly imports all modules');
        } else {
          logError('Main types file missing some imports');
          return false;
        }
      }

      return allExist;
    }
  },

  coreImprovements: {
    name: 'Core Module Improvements',
    verify: () => {
      const coreFiles = [
        'src/core/conditionalRenderer.ts',
        'src/core/conditionalUpdater.ts',
        'src/core/elementFactory.ts',
        'src/core/styleManager.ts',
        'src/core/reactive.ts'
      ];

      let allExist = true;
      coreFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        if (!fs.existsSync(fullPath)) {
          logError(`Core file missing: ${file}`);
          allExist = false;
        }
      });

      if (allExist) {
        logSuccess('All enhanced core files exist');
        
        // Check for key improvements in conditional renderer
        const conditionalPath = path.join(__dirname, '..', 'src/core/conditionalRenderer.ts');
        const content = fs.readFileSync(conditionalPath, 'utf8');
        
        const hasKeyFeatures = [
          'ConditionalInfo',
          'createConditionalElement',
          'processConditionalModifiers'
        ].every(feature => content.includes(feature));

        if (hasKeyFeatures) {
          logSuccess('Conditional renderer has all key features');
        } else {
          logError('Conditional renderer missing key features');
          return false;
        }
      }

      return allExist;
    }
  },

  utilityEnhancements: {
    name: 'Utility Module Enhancements',
    verify: () => {
      const utilityFiles = [
        'src/utility/errorHandler.ts',
        'src/utility/environment.ts',
        'src/utility/dom.ts'
      ];

      let allExist = true;
      utilityFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        if (!fs.existsSync(fullPath)) {
          logError(`Utility file missing: ${file}`);
          allExist = false;
        }
      });

      if (allExist) {
        logSuccess('All enhanced utility files exist');
        
        // Check error handler features
        const errorHandlerPath = path.join(__dirname, '..', 'src/utility/errorHandler.ts');
        const errorContent = fs.readFileSync(errorHandlerPath, 'utf8');
        
        const hasErrorFeatures = [
          'ErrorContext',
          'logError',
          'safeExecute',
          'withErrorHandling',
          'ViewCraftError'
        ].every(feature => errorContent.includes(feature));

        if (hasErrorFeatures) {
          logSuccess('Error handler has all key features');
        } else {
          logError('Error handler missing key features');
          return false;
        }

        // Check environment detection
        const envPath = path.join(__dirname, '..', 'src/utility/environment.ts');
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        const hasEnvFeatures = [
          'isBrowser()',
          'isNode()',
          'isSSR()',
          'canUseDOMAPIs()',
          'createSafeElement'
        ].every(feature => envContent.includes(feature));

        if (hasEnvFeatures) {
          logSuccess('Environment detection has all key features');
        } else {
          logError('Environment detection missing key features');
          return false;
        }
      }

      return allExist;
    }
  },

  buildSystem: {
    name: 'Build System Verification',
    verify: () => {
      try {
        // Test TypeScript compilation
        logInfo('Testing TypeScript compilation...');
        execSync('pnpm exec tsc --noEmit', { 
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe'
        });
        logSuccess('TypeScript compilation successful');

        // Test build process
        logInfo('Testing build process...');
        execSync('pnpm build', { 
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe'
        });
        logSuccess('Build process successful');

        // Check build outputs
        const distFiles = [
          'dist/view-craft.js',
          'dist/view-craft.cjs',
          'dist/view-craft.umd.js'
        ];

        const allOutputsExist = distFiles.every(file => {
          const fullPath = path.join(__dirname, '..', file);
          return fs.existsSync(fullPath);
        });

        if (allOutputsExist) {
          logSuccess('All build outputs exist');
        } else {
          logError('Some build outputs missing');
          return false;
        }

        return true;
      } catch (error) {
        logError(`Build verification failed: ${error.message}`);
        return false;
      }
    }
  },

  testSuite: {
    name: 'Test Suite Verification',
    verify: () => {
      try {
        logInfo('Running test suite...');
        const result = execSync('pnpm test', { 
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe',
          encoding: 'utf8'
        });

        // Parse test results
        const lines = result.split('\n');
        const testLine = lines.find(line => line.includes('Tests '));
        
        if (testLine) {
          logSuccess(`Test suite passed: ${testLine.trim()}`);
          
          // Check for any failures
          if (testLine.includes('failed')) {
            logError('Some tests failed');
            return false;
          }
        }

        return true;
      } catch (error) {
        logError(`Test suite failed: ${error.message}`);
        return false;
      }
    }
  },

  backwardCompatibility: {
    name: 'Backward Compatibility',
    verify: () => {
      // This is verified by the test suite, but we can do additional checks
      const publicAPIFiles = [
        'src/index.ts',
        'types/index.d.ts'
      ];

      let compatible = true;
      publicAPIFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        if (!fs.existsSync(fullPath)) {
          logError(`Public API file missing: ${file}`);
          compatible = false;
        }
      });

      if (compatible) {
        // Check that main exports haven't changed
        const indexPath = path.join(__dirname, '..', 'src/index.ts');
        const content = fs.readFileSync(indexPath, 'utf8');
        
        const expectedExports = [
          'initializeRuntime',
          'registerGlobalTagBuilders',
          'createElementFactory',
          'createTagBuilder',
          'list',
          'when',
          'update'
        ];

        const hasAllExports = expectedExports.every(exp => 
          content.includes(`export`) && content.includes(exp)
        );

        if (hasAllExports) {
          logSuccess('All expected public API exports present');
        } else {
          logError('Some public API exports missing');
          compatible = false;
        }
      }

      return compatible;
    }
  }
};

// Main verification function
function runVerification() {
  logHeader('View-Craft Build Verification');
  
  const startTime = Date.now();
  const results = {};
  let allPassed = true;

  // Run all checks
  Object.entries(checks).forEach(([key, check]) => {
    logHeader(check.name);
    
    try {
      const passed = check.verify();
      results[key] = passed;
      
      if (passed) {
        logSuccess(`${check.name} verification passed`);
      } else {
        logError(`${check.name} verification failed`);
        allPassed = false;
      }
    } catch (error) {
      logError(`${check.name} verification error: ${error.message}`);
      results[key] = false;
      allPassed = false;
    }
  });

  // Summary
  const duration = Date.now() - startTime;
  logHeader('Verification Summary');
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const checkName = checks[key].name;
    log(`${status} ${checkName}`);
  });

  log(`\nVerification completed in ${duration}ms`);
  
  if (allPassed) {
    logSuccess('\n🎉 All verifications passed! The improvements are working correctly.');
    process.exit(0);
  } else {
    logError('\n💥 Some verifications failed. Please check the issues above.');
    process.exit(1);
  }
}

// Additional utility functions
function checkCodeQuality() {
  logHeader('Code Quality Checks');
  
  try {
    // Check for TODOs
    const result = execSync('grep -r "TODO\\|FIXME\\|HACK" src/', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    if (result.trim()) {
      logWarning('Found TODO/FIXME/HACK comments:');
      console.log(result);
    } else {
      logSuccess('No TODO/FIXME/HACK comments found');
    }
  } catch (error) {
    logSuccess('No TODO/FIXME/HACK comments found');
  }

  // Check for console.log statements (should use proper logging)
  try {
    const result = execSync('grep -r "console\\.log" src/', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    if (result.trim()) {
      logWarning('Found console.log statements (consider using proper logging):');
      console.log(result);
    } else {
      logSuccess('No console.log statements found');
    }
  } catch (error) {
    logSuccess('No console.log statements found');
  }
}

// Run verification
if (require.main === module) {
  runVerification();
  checkCodeQuality();
}

module.exports = {
  runVerification,
  checkCodeQuality,
  checks
};