# 🎨 Image Organization Guide

## 📁 Folder Structure

Your images are now organized into specific folders. Simply drop images into these folders and they will automatically rotate every **30 minutes**!

### Folders:

1. **`dashboard/`** - Background images for the Home/Dashboard section
2. **`tasks/`** - Background images for the Tasks section
3. **`calendar/`** - Background images for the Calendar section
4. **`subscriptions/`** - Background images for the Auto-Pay Alerts section
5. **`avatars/`** - Profile avatar options
6. **`modals/`** - Background images for modals (task creation, date details)
7. **`loading/`** - Loading screen background images
8. **`top-bar/`** - Unified header background (single image for all sections at 90% opacity)
9. **`calendar/sub-background/`** - Secondary layer for calendar grid (landscape/portrait folders, 98% opacity)
10. **`patterns/`** - Minimal texture patterns for white backgrounds (CSS-based, no images needed)

## 🔄 How It Works

- Images rotate automatically every **30 minutes**
- The system picks a different image from each folder based on the time of day
- 48 rotation cycles per day (24 hours × 2)
- Smooth fade transitions between images

## 📝 Current Image Assignments

### Dashboard Backgrounds (6 images)
- 391829-chrollo-hunter-x-hunter-4k-pc-wallpaper.jpg
- wallpaperflare.com_wallpaper (4).jpg
- wallpaperflare.com_wallpaper (5).jpg
- 896302.jpg
- 887559.jpg
- unnamed7.jpg

### Tasks Backgrounds (6 images)
- unnamed (3).jpg
- 543497.jpg
- 543509.jpg
- wallpaperflare.com_wallpaper (6).jpg
- 468739.jpg
- 967545.jpg

### Calendar Backgrounds (6 images)
- unnamed (1).jpg
- pexels-felix-mittermeier-2832071.jpg
- pexels-pixabay-221189.jpg
- pexels-pixabay-236950.jpg
- alone-tree-sunset-qe.jpg
- WallpaperDog-20487402.jpg

### Subscriptions Backgrounds (6 images)
- unnamed (2).jpg
- wallpaperflare.com_wallpaper (8).jpg
- 1017220.jpg
- 43927.jpg
- 527483.jpg
- 641988.png

### Avatar Options (6 images)
- Peace of mind.jpeg
- unnamed (4).jfif
- 120600.png
- 652753.png
- 792977.png
- 900722.png

### Calendar Date Tiles (17 images)
- All unnamed.jpg, download.jpg, etc. files

## 🚀 To Add More Images:

1. Save your image in the appropriate folder
2. Update `src/imageRotation.ts` and add the image path to the corresponding array
3. The image will automatically be included in the rotation!

## 💡 Tips:

- Use high-quality images (1920x1080 or higher)
- Images are displayed at 20% opacity with gradient overlay
- Banner images remain in black & white for contrast
- Background images are shown in full color

## 🎨 Texture Patterns:

The app now includes subtle texture patterns on white backgrounds to maintain visual interest:

- **Paper Pattern** - Used on modals, stats cards, and date detail windows
- **Grid Pattern** - Applied to navigation bar
- **Dots Pattern** - Used on calendar day headers and subscription details
- **Subtle Lines** - Applied to calendar grid background

All patterns are CSS-based (no image files needed) and display at very low opacity to maintain the clean aesthetic while adding depth.

Enjoy your dynamic, ever-changing UI! 🎨✨
