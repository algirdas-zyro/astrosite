export const getPageIdByPath = (websiteData, path) => Object.entries(websiteData.pages).find(([, value]) => value.path === path)[0];
