const APP_CLOSE_MESSAGE = "close-app";

function getParentOrigin(parentUrl: string) {
  try {
    return new URL(parentUrl).origin;
  } catch {
    return null;
  }
}

export function closeEmbeddedApp() {
  const parentUrl = import.meta.env.VITE_PARENT_URL;
  const targetOrigin = getParentOrigin(parentUrl);

  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: APP_CLOSE_MESSAGE }, targetOrigin ?? "*");
  }

  if (parentUrl && window.location.href !== parentUrl) {
    window.location.assign(parentUrl);
  }
}
