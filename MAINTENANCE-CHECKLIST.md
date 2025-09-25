# View-Craft Maintenance Checklist

This checklist ensures that future development maintains the quality standards and architectural patterns established during the comprehensive refactoring.

## 🔍 Before Making Changes

### Pre-Development Checks
- [ ] Read `IMPROVEMENTS.md` to understand the current architecture
- [ ] Review `REFACTORING-COMPLETE.md` for context on design decisions
- [ ] Ensure you understand the module's single responsibility principle
- [ ] Check if the change affects backward compatibility

### Environment Setup
- [ ] Run `pnpm install` to ensure dependencies are up to date
- [ ] Run `pnpm test` to ensure all tests pass
- [ ] Run `pnpm build` to ensure clean build
- [ ] Run `node scripts/verify-build.cjs` to verify system integrity

## 🏗️ Development Guidelines

### Code Structure
- [ ] Place new functionality in the appropriate module:
  - Core functionality → `src/core/`
  - Utility functions → `src/utility/`
  - Feature-specific code → dedicated directories
  - Types → organized in `types/` subdirectories

### Error Handling
- [ ] Use `safeExecute()` for risky operations
- [ ] Use appropriate domain-specific error handlers:
  - `handleDOMError()` for DOM operations
  - `handleModifierError()` for modifier processing
  - `handleReactiveError()` for reactive updates
- [ ] Provide meaningful error context with `ErrorContext` interface
- [ ] Use appropriate log levels (error/warn/info)

### Environment Awareness
- [ ] Check environment capabilities with `canUseDOMAPIs()`, `isBrowser()`, etc.
- [ ] Use safe creation functions: `createSafeElement()`, `createSafeTextNode()`
- [ ] Handle SSR vs browser differences appropriately

### Type Safety
- [ ] Add types to appropriate organized modules in `types/`
- [ ] Ensure TypeScript compilation passes with `pnpm exec tsc --noEmit`
- [ ] Follow existing naming conventions for types

## 🧪 Testing Requirements

### Before Committing
- [ ] All existing tests pass: `pnpm test`
- [ ] Add tests for new functionality
- [ ] Test error conditions and edge cases
- [ ] Verify no regression in performance-critical paths

### Test Organization
- [ ] Unit tests in appropriate `test/` subdirectories
- [ ] Integration tests for complex features
- [ ] Performance tests for critical paths
- [ ] Error handling tests for failure modes

## 🔒 Security Considerations

### When Adding Features
- [ ] Validate input parameters (especially user-provided)
- [ ] Sanitize CSS values using existing validation functions
- [ ] Prevent XSS through proper escaping
- [ ] Use safe DOM manipulation functions

### Code Review Checklist
- [ ] No direct DOM manipulation without safety checks
- [ ] No console.log statements (use proper logging)
- [ ] No TODO/FIXME/HACK comments without issues
- [ ] Proper error boundaries around risky operations

## 🚀 Performance Considerations

### Optimization Guidelines
- [ ] Use early returns to prevent unnecessary operations
- [ ] Batch DOM operations where possible
- [ ] Clean up event listeners and references properly
- [ ] Consider memory impact of caching strategies

### Monitoring
- [ ] Use performance monitoring in reactive system when needed
- [ ] Profile critical paths before and after changes
- [ ] Monitor bundle size impact

## 📝 Documentation Standards

### Code Documentation
- [ ] JSDoc comments for all public APIs
- [ ] Clear function and parameter descriptions
- [ ] Usage examples for complex features
- [ ] Error condition documentation

### Architecture Documentation
- [ ] Update `IMPROVEMENTS.md` if architecture changes
- [ ] Document new patterns in appropriate places
- [ ] Update type organization if types are added/changed

## 🔄 Release Process

### Pre-Release Checks
- [ ] All tests pass: `pnpm test`
- [ ] Clean build: `pnpm build`
- [ ] Verification script passes: `node scripts/verify-build.cjs`
- [ ] TypeScript compilation clean: `pnpm exec tsc --noEmit`
- [ ] No breaking changes or proper migration guide provided

### Version Management
- [ ] Update version appropriately (semantic versioning)
- [ ] Update CHANGELOG.md if maintained
- [ ] Tag release appropriately
- [ ] Ensure backward compatibility maintained

## 🔧 Troubleshooting Guide

### Common Issues
- **TypeScript errors**: Check type organization and imports
- **Test failures**: Verify environment setup and dependencies
- **Build failures**: Check rollup config and file paths
- **Runtime errors**: Verify error handling is properly implemented

### Debugging Steps
1. Run verification script to isolate the issue
2. Check TypeScript compilation for type errors
3. Run individual test files to narrow down failures
4. Use error context from enhanced logging system
5. Check environment detection for platform-specific issues

## 📋 Module-Specific Guidelines

### Core Modules (`src/core/`)
- Maintain single responsibility principle
- Use shared interfaces between related modules
- Implement proper error recovery
- Follow established patterns for element creation

### Utility Modules (`src/utility/`)
- Keep functions pure where possible
- Provide safe alternatives to risky operations
- Include comprehensive error handling
- Maintain backward compatibility

### Feature Modules (`src/list/`, `src/when/`)
- Follow established patterns for feature implementation
- Use marker comments for DOM boundaries
- Implement proper cleanup for memory management
- Provide clear public APIs

## ✅ Quality Gates

### Before Any Commit
- [ ] Code follows established patterns
- [ ] Error handling is comprehensive
- [ ] Tests cover new functionality
- [ ] No regression in existing functionality
- [ ] Documentation is updated

### Before Any Release
- [ ] Full verification script passes
- [ ] Performance benchmarks maintained
- [ ] Security review completed
- [ ] Backward compatibility verified
- [ ] Migration guide provided if needed

---

**Remember: The goal is to maintain the high-quality, robust architecture while enabling future growth and enhancement. When in doubt, follow existing patterns and prioritize safety and maintainability.**