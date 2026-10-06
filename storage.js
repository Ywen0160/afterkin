// Keep the original key so existing demo collections survive website updates.
window.AFTERKIN_STORAGE = (() => {
  const key = 'afterkin-heirloom-review-v1';
  const introductionsKey = 'afterkin-pending-introductions-v1';
  const itemIds = new Set(AFTERKIN.items.map(item => item.id));
  function validIds(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(id => itemIds.has(id)))];
  }
  function read(storageKey) {
    try {
      return validIds(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    } catch {
      return [];
    }
  }
  function write(storageKey, ids) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(validIds(ids)));
      return true;
    } catch {
      return false;
    }
  }
  return {
    load: () => read(key),
    save: ids => write(key, ids),
    loadIntroductions: () => read(introductionsKey),
    saveIntroductions: ids => write(introductionsKey, ids)
  };
})();
