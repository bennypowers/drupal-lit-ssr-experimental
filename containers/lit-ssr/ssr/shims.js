class ObserverShim {
  observe() {}
  disconnect() {}
}

globalThis.window ??= globalThis;

globalThis.ErrorEvent ??= Event;
globalThis.IntersectionObserver ??= ObserverShim;
globalThis.MutationObserver ??= ObserverShim;

globalThis.getComputedStyle ??= function() {
  return {
    getPropertyPriority() {},
    getPropertyValue() {},
  }
}
