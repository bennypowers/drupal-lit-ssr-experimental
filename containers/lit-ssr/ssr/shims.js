// import { Event, EventTarget } from '@whatwg-node/events';

globalThis.window ??= globalThis;

// globalThis.Event ??= Event;
// globalThis.EventTarget ??= EventTarget;
globalThis.ErrorEvent ??= Event;
globalThis.IntersectionObserver ??= (class {});
globalThis.MutationObserver ??= (class {});

globalThis.getComputedStyle ??= function() {
  return {
    getPropertyPriority() {},
    getPropertyValue() {},
  }
}
