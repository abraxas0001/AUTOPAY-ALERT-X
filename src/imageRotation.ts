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

// Get current image from a list based on rotation
export const getCurrentImage = (images: string[]): string => {
  if (images.length === 0) return '';
  const index = getRotationIndex() % images.length;
  return images[index];
};

// Dashboard background images
export const dashboardImages = [
  '/Img/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
  '/Img/wallpaperflare.com_wallpaper (4).jpg',
  '/Img/wallpaperflare.com_wallpaper (5).jpg',
  '/Img/896302.jpg',
  '/Img/887559.jpg',
  '/Img/unnamed7.jpg',
];

// Tasks background images
export const tasksImages = [
  '/Img/unnamed (3).jpg',
  '/Img/543497.jpg',
  '/Img/543509.jpg',
  '/Img/wallpaperflare.com_wallpaper (6).jpg',
  '/Img/468739.jpg',
  '/Img/967545.jpg',
];

// Calendar background images
export const calendarImages = [
  '/Img/unnamed (1).jpg',
  '/Img/pexels-felix-mittermeier-2832071.jpg',
  '/Img/pexels-pixabay-221189.jpg',
  '/Img/pexels-pixabay-236950.jpg',
  '/Img/alone-tree-sunset-qe.jpg',
  '/Img/WallpaperDog-20487402.jpg',
];

// Subscriptions background images
export const subscriptionsImages = [
  '/Img/unnamed (2).jpg',
  '/Img/wallpaperflare.com_wallpaper (8).jpg',
  '/Img/1017220.jpg',
  '/Img/43927.jpg',
  '/Img/527483.jpg',
  '/Img/641988.png',
];

// Avatar options
export const avatarImages = [
  '/Img/Peace of mind.jpeg',
  '/Img/unnamed (4).jfif',
  '/Img/120600.png',
  '/Img/652753.png',
  '/Img/792977.png',
  '/Img/900722.png',
];

// Calendar date tile images (cycle through all)
export const calendarDateImages = [
  '/Img/unnamed.jpg',
  '/Img/unnamed (1).jpg',
  '/Img/unnamed (2).jpg',
  '/Img/unnamed (3).jpg',
  '/Img/unnamed (5).jpg',
  '/Img/unnamed (6).jpg',
  '/Img/unnamed (8).jpg',
  '/Img/unnamed7.jpg',
  '/Img/download.jpg',
  '/Img/downlo.jpeg',
  '/Img/download (2).jfif',
  '/Img/download (3).jfif',
  '/Img/download (4).jfif',
  '/Img/download (5).jfif',
  '/Img/download (5).jpeg',
  '/Img/download (6).jfif',
  '/Img/WALL_2022-06-28_05.02.18.png',
];

// Modal background images
export const modalImages = [
  '/Img/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
  '/Img/896302.jpg',
  '/Img/887559.jpg',
];

// Loading screen images
export const loadingImages = [
  '/Img/wallpaperflare.com_wallpaper (4).jpg',
  '/Img/wallpaperflare.com_wallpaper (5).jpg',
  '/Img/391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg',
];

// Hook to get current images with auto-refresh every 30 minutes
export const useRotatingImages = () => {
  const rotationIndex = getRotationIndex();
  
  return {
    dashboard: getCurrentImage(dashboardImages),
    tasks: getCurrentImage(tasksImages),
    calendar: getCurrentImage(calendarImages),
    subscriptions: getCurrentImage(subscriptionsImages),
    avatar: getCurrentImage(avatarImages),
    modal: getCurrentImage(modalImages),
    loading: getCurrentImage(loadingImages),
    rotationIndex, // For debugging/display
  };
};
