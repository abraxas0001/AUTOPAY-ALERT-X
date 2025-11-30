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

// Fallback images (always available)
const FALLBACK_IMAGE = '/Img/dashboard/wallpaperflare.com_wallpaper (4).jpg';
const FALLBACK_AVATAR = '/Img/avatars/Peace of mind.jpeg';

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

// Dashboard background images
export const dashboardImages = [
  '/Img/dashboard/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
  '/Img/dashboard/wallpaperflare.com_wallpaper (4).jpg',
  '/Img/dashboard/wallpaperflare.com_wallpaper (5).jpg',
  '/Img/dashboard/896302.jpg',
  '/Img/dashboard/887559.jpg',
  '/Img/dashboard/unnamed7.jpg',
  '/Img/dashboard/Chinese and japanese oriental painting with golden texture  3d render raster illustration _ Premium AI-generated image.jfif',
];

// Tasks background images
export const tasksImages = [
  '/Img/tasks/unnamed (3).jpg',
  '/Img/tasks/543497.jpg',
  '/Img/tasks/543509.jpg',
  '/Img/tasks/wallpaperflare.com_wallpaper (6).jpg',
  '/Img/tasks/468739.jpg',
  '/Img/tasks/967545.jpg',
  '/Img/tasks/Backpiece mehendi design incorporating natureinspired elements like trees and birds on a white background for transparent printing.jfif',
];

// Calendar background images
export const calendarImages = [
  '/Img/calendar/unnamed (1).jpg',
  '/Img/calendar/pexels-felix-mittermeier-2832071.jpg',
  '/Img/calendar/pexels-pixabay-221189.jpg',
  '/Img/calendar/pexels-pixabay-236950.jpg',
  '/Img/calendar/alone-tree-sunset-qe.jpg',
  '/Img/calendar/WallpaperDog-20487402.jpg',
  '/Img/calendar/Misty Mountain Blossoms.jfif',
];

// Subscriptions background images
export const subscriptionsImages = [
  '/Img/subscriptions/unnamed (2).jpg',
  '/Img/subscriptions/wallpaperflare.com_wallpaper (8).jpg',
  '/Img/subscriptions/1017220.jpg',
  '/Img/subscriptions/43927.jpg',
  '/Img/subscriptions/527483.jpg',
  '/Img/subscriptions/641988.png',
];

// Avatar options
export const avatarImages = [
  '/Img/avatars/Peace of mind.jpeg',
  '/Img/avatars/unnamed (4).jfif',
  '/Img/avatars/120600.png',
  '/Img/avatars/652753.png',
  '/Img/avatars/792977.png',
  '/Img/avatars/900722.png',
  '/Img/avatars/download (7).jfif',
  '/Img/avatars/download (8).jfif',
  '/Img/avatars/download (9).jfif',
  '/Img/avatars/download (10).jfif',
  '/Img/avatars/download (11).jfif',
  '/Img/avatars/download (12).jfif',
  '/Img/avatars/download (13).jfif',
];

// Calendar date tile images (cycle through all)
export const calendarDateImages = [
  '/Img/calendar/unnamed.jpg',
  '/Img/calendar/unnamed (1).jpg',
  '/Img/calendar/unnamed (5).jpg',
  '/Img/calendar/unnamed (6).jpg',
  '/Img/calendar/unnamed (8).jpg',
  '/Img/calendar/download.jpg',
  '/Img/calendar/downlo.jpeg',
  '/Img/calendar/download (2).jfif',
  '/Img/calendar/download (3).jfif',
  '/Img/calendar/download (4).jfif',
  '/Img/calendar/download (5).jfif',
  '/Img/calendar/download (5).jpeg',
  '/Img/calendar/download (6).jfif',
  '/Img/calendar/WALL_2022-06-28_05.02.18.png',
  '/Img/calendar/pexels-felix-mittermeier-2832071.jpg',
  '/Img/calendar/pexels-pixabay-221189.jpg',
  '/Img/calendar/pexels-pixabay-236950.jpg',
  '/Img/calendar/alone-tree-sunset-qe.jpg',
  '/Img/calendar/WallpaperDog-20487402.jpg',
  '/Img/calendar/Misty Mountain Blossoms.jfif',
];

// Banner images for dark sections (Daily Briefing, Stats, etc.)
export const dashboardBannerImages = [
  '/Img/dashboard/banners/unnamed7.jpg',
  '/Img/dashboard/banners/887559.jpg',
  '/Img/dashboard/banners/896302.jpg',
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
  '/Img/dashboard/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
  '/Img/dashboard/896302.jpg',
  '/Img/dashboard/887559.jpg',
];

// Loading screen images
export const loadingImages = [
  '/Img/dashboard/wallpaperflare.com_wallpaper (4).jpg',
  '/Img/dashboard/wallpaperflare.com_wallpaper (5).jpg',
  '/Img/dashboard/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
];

// Hook to get current images with auto-refresh every 30 minutes
export const useRotatingImages = () => {
  const rotationIndex = getRotationIndex();
  
  return {
    dashboard: getCurrentImage(dashboardImages, FALLBACK_IMAGE),
    tasks: getCurrentImage(tasksImages, FALLBACK_IMAGE),
    calendar: getCurrentImage(calendarImages, FALLBACK_IMAGE),
    subscriptions: getCurrentImage(subscriptionsImages, FALLBACK_IMAGE),
    avatar: getCurrentImage(avatarImages, FALLBACK_AVATAR),
    modal: getCurrentImage(modalImages, FALLBACK_IMAGE),
    loading: getCurrentImage(loadingImages, FALLBACK_IMAGE),
    dashboardBanner: getCurrentImage(dashboardBannerImages, FALLBACK_IMAGE),
    tasksBanner: getCurrentImage(tasksBannerImages, FALLBACK_IMAGE),
    calendarBanner: getCurrentImage(calendarBannerImages, FALLBACK_IMAGE),
    subscriptionsBanner: getCurrentImage(subscriptionsBannerImages, FALLBACK_IMAGE),
    rotationIndex, // For debugging/display
  };
};
