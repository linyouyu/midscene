// All type definitions are now centralized in @web-agent/shared-types.
// Re-export them from the shared package.
// Note: DomElementNode was specific to this plugin and is now effectively replaced by
// the canonical DomNode from shared-types (which the plugin's main function will now use).

export * from '@web-agent/shared-types';
