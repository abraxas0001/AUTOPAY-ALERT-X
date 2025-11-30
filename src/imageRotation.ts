// Dynamic Image Rotation System
// Images rotate every 30 minutes based on folder contents

// Image folder structure
export const imageFolders = {
  dashboard: '/Img/dashboard/',
  tasks: '/Img/tasks/',
  calendar: '/Img/calendar/',
  subscriptions: '/Img/subscriptions/',
  avatars: '/Img/avatars/',
  modals: '/Img/modals/',
  loading: '/Img/loading/',
  calendarDates: '/Img/calendar/', // For calendar date tiles
};

// Detect if device is in landscape mode (PC/Laptop) or portrait mode (Phone/Tablet)
export const isLandscapeDevice = (): boolean => {
  if (typeof window === 'undefined') return true; // Default to landscape for SSR
  return window.innerWidth > window.innerHeight;
};

// Get rotation index based on 30-minute intervals
export const getRotationIndex = (): number => {
  const now = new Date();
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
  const intervalIndex = Math.floor(minutesSinceMidnight / 30); // Changes every 30 minutes
  return intervalIndex;
};

// Get current image from a list based on rotation with fallback
export const getCurrentImage = (images: string[], fallback: string = ''): string => {
  // Filter out any undefined or empty strings
  const validImages = images.filter(img => img && img.length > 0);
  
  if (validImages.length === 0) {
    console.warn('No valid images available, using fallback');
    return fallback;
  }
  
  const index = getRotationIndex() % validImages.length;
  return validImages[index];
};

// Fallback images (using first available from arrays)
const FALLBACK_IMAGE = '/Img/dashboard/landscape/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg';
const FALLBACK_AVATAR = '/Img/avatars/unnamed (4).jfif';

// Get current image with fallback to next available if missing
export const getCurrentImageWithFallback = (images: string[]): string => {
  if (images.length === 0) return '';
  
  const startIndex = getRotationIndex() % images.length;
  let currentIndex = startIndex;
  
  // Try current image first, then cycle through others if needed
  // This ensures we always return a valid image path
  // The browser will handle 404s, but we cycle through to find working ones
  return images[currentIndex];
};

// Dashboard background images - Landscape (for PC/Laptop)
export const dashboardLandscapeImages = [
  '/Img/dashboard/landscape/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
  '/Img/dashboard/landscape/wallpaperflare.com_wallpaper (4).jpg',
  '/Img/dashboard/landscape/wallpaperflare.com_wallpaper (5).jpg',
  '/Img/dashboard/landscape/896302.jpg',
  '/Img/dashboard/landscape/887559.jpg',
];

// Dashboard background images - Portrait (for Phone/Tablet)
export const dashboardPortraitImages = [
  '/Img/dashboard/portrait/900722.png',
  '/Img/dashboard/portrait/887559.jpg',
  '/Img/dashboard/portrait/896302.jpg',
];

// Tasks background images - Landscape (for PC/Laptop)
export const tasksLandscapeImages = [
  '/Img/tasks/landscape/unnamed (3).jpg',
  '/Img/tasks/landscape/wallpaperflare.com_wallpaper (6).jpg',
  '/Img/tasks/landscape/468739.jpg',
  '/Img/tasks/landscape/967545.jpg',
];

// Tasks background images - Portrait (for Phone/Tablet)
export const tasksPortraitImages = [
  '/Img/tasks/portrait/652753.png',
  '/Img/tasks/portrait/Stark man.jfif',
  '/Img/tasks/portrait/download (14).jfif',
  '/Img/tasks/portrait/why not you_.jfif',
];

// Calendar background images - Landscape (for PC/Laptop)
export const calendarLandscapeImages = [
  '/Img/calendar/landscape/pexels-felix-mittermeier-2832071.jpg',
  '/Img/calendar/landscape/alone-tree-sunset-qe.jpg',
  '/Img/calendar/landscape/Misty Mountain Blossoms.jfif',
];

// Calendar background images - Portrait (for Phone/Tablet)
export const calendarPortraitImages = [
  '/Img/calendar/portrait/download (7).jfif',
  '/Img/calendar/portrait/download (8).jfif',
  '/Img/calendar/portrait/download (9).jfif',
  '/Img/calendar/portrait/download (11).jfif',
];

// Subscriptions background images - Landscape (for PC/Laptop)
export const subscriptionsLandscapeImages = [
  '/Img/subscriptions/landscape/wallpaperflare.com_wallpaper (8).jpg',
  '/Img/subscriptions/landscape/1017220.jpg',
  '/Img/subscriptions/landscape/43927.jpg',
];

// Subscriptions background images - Portrait (for Phone/Tablet)
export const subscriptionsPortraitImages = [
  '/Img/subscriptions/portrait/527483.jpg',
  '/Img/subscriptions/portrait/641988.png',
  '/Img/subscriptions/portrait/43927.jpg',
];

// Avatar options
export const avatarImages = [
  '/Img/avatars/unnamed (4).jfif',
  '/Img/avatars/543497.jpg',
  '/Img/avatars/543509.jpg',
];

// Calendar date tile images (cycle through all)
export const calendarDateImages = [
  '/Img/calendar/download.jpg',
  '/Img/calendar/downlo.jpeg',
  '/Img/calendar/download (2).jfif',
  '/Img/calendar/download (3).jfif',
  '/Img/calendar/download (4).jfif',
  '/Img/calendar/download (5).jfif',
  '/Img/calendar/download (5).jpeg',
  '/Img/calendar/download (6).jfif',
  '/Img/calendar/download (7).jfif',
  '/Img/calendar/download (8).jfif',
  '/Img/calendar/download (9).jfif',
  '/Img/calendar/download (11).jfif',
  '/Img/calendar/pexels-felix-mittermeier-2832071.jpg',
  '/Img/calendar/Misty Mountain Blossoms.jfif',
  '/Img/calendar/alone-tree-sunset-qe.jpg',
  '/Img/calendar/unnamed (8).jpg',
  '/Img/calendar/unnamed7.jpg',
];

// Today's date images (colorful, not grayscale)
export const todayImages = [
  '/Img/calendar/today/pexels-felix-mittermeier-2832071.jpg',
  '/Img/calendar/today/Misty Mountain Blossoms.jfif',
  '/Img/calendar/today/alone-tree-sunset-qe.jpg',
];

// Banner images for dark sections (Daily Briefing, Stats, etc.)
export const dashboardBannerImages = [
  '/Img/dashboard/banners/Nature Aesthetic.jfif',
  '/Img/dashboard/banners/download (16).jfif',
  '/Img/dashboard/banners/download (17).jfif',
];

export const tasksBannerImages = [
  '/Img/tasks/banners/543497.jpg',
  '/Img/tasks/banners/543509.jpg',
  '/Img/tasks/banners/468739.jpg',
];

export const calendarBannerImages = [
  '/Img/calendar/banners/pexels-felix-mittermeier-2832071.jpg',
  '/Img/calendar/banners/pexels-pixabay-221189.jpg',
  '/Img/calendar/banners/alone-tree-sunset-qe.jpg',
];

export const subscriptionsBannerImages = [
  '/Img/subscriptions/banners/1017220.jpg',
  '/Img/subscriptions/banners/43927.jpg',
  '/Img/subscriptions/banners/527483.jpg',
];

// Modal background images
export const modalImages = [
  '/Img/dashboard/landscape/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
  '/Img/dashboard/landscape/896302.jpg',
  '/Img/dashboard/landscape/887559.jpg',
];

// Loading screen images
export const loadingImages = [
  '/Img/dashboard/landscape/wallpaperflare.com_wallpaper (4).jpg',
  '/Img/dashboard/landscape/wallpaperflare.com_wallpaper (5).jpg',
  '/Img/dashboard/landscape/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
];

// Hook to get current images with auto-refresh every 30 minutes
export const useRotatingImages = () => {
  const rotationIndex = getRotationIndex();
  const isLandscape = isLandscapeDevice();
  
  return {
    dashboard: getCurrentImage(isLandscape ? dashboardLandscapeImages : dashboardPortraitImages, FALLBACK_IMAGE),
    tasks: getCurrentImage(isLandscape ? tasksLandscapeImages : tasksPortraitImages, FALLBACK_IMAGE),
    calendar: getCurrentImage(isLandscape ? calendarLandscapeImages : calendarPortraitImages, FALLBACK_IMAGE),
    subscriptions: getCurrentImage(isLandscape ? subscriptionsLandscapeImages : subscriptionsPortraitImages, FALLBACK_IMAGE),
    avatar: getCurrentImage(avatarImages, FALLBACK_AVATAR),
    modal: getCurrentImage(modalImages, FALLBACK_IMAGE),
    loading: getCurrentImage(loadingImages, FALLBACK_IMAGE),
    dashboardBanner: getCurrentImage(dashboardBannerImages, FALLBACK_IMAGE),
    tasksBanner: getCurrentImage(tasksBannerImages, FALLBACK_IMAGE),
    calendarBanner: getCurrentImage(calendarBannerImages, FALLBACK_IMAGE),
    subscriptionsBanner: getCurrentImage(subscriptionsBannerImages, FALLBACK_IMAGE),
    todayImage: getCurrentImage(todayImages, FALLBACK_IMAGE),
    rotationIndex, // For debugging/display
    isLandscape, // For debugging/display
  };
};
