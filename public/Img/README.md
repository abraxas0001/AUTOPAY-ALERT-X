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
9. **`calendar/sub-background/`** - Secondary layer for calendar grid (landscape/portrait folders, 98% opacity, colorful)
10. **`patterns/`** - Minimal texture patterns for white backgrounds
11. **`modals/`** - Background images for modal dialogs (task creation, profile, etc.)
12. **`loading/`** - Loading screen background images

## 🎵 Music Folder

Located at `/public/music/` - Add MP3, WAV, or OGG files here for alarm/notification sounds.

## 🔄 How It Works

- Images rotate automatically every **30 minutes**
- The system picks a different image from each folder based on the time of day
- 48 rotation cycles per day (24 hours × 2)
- Smooth fade transitions between images

## 📝 Current Image Assignments

### Dashboard Backgrounds
- **Landscape (4):** wallpaperflare.com_wallpaper (4).jpg, 896302.jpg, 887559.jpg, 900722.png
- **Portrait (3):** 900722.png, 887559.jpg, 896302.jpg
- **Banners (5):** 294071.jpg, 522965.jpg, 786077.png, 950280.png, download (17).jfif

### Tasks Backgrounds
- **Landscape (4):** wallpaperflare.com_wallpaper (6).jpg, 468739.jpg, 967545.jpg, 652753.png
- **Portrait (2):** 652753.png, unnamed (3).jpg
- **Banners (2):** 2026102.png, 454440-Valorant-Jett-Valorant-phoenix-valorant-Sova-valorant.jpg

### Calendar Backgrounds
- **Landscape (2):** pexels-felix-mittermeier-2832071.jpg, alone-tree-sunset-qe.jpg
- **Portrait (7):** download (7-9, 11, 5-6).jfif, download.jpg
- **Sub-background Landscape (2):** pexels-felix-mittermeier-2832071.jpg, alone-tree-sunset-qe.jpg
- **Sub-background Portrait (3):** download (7-9).jfif
- **Banners (6):** pexels-pixabay-221189.jpg, alone-tree-sunset-qe.jpg, downlo.jpeg, download (5).jpeg, WALL_2022-06-28_05.02.18.png, WallpaperDog-20487402.jpg
- **Today (1):** alone-tree-sunset-qe.jpg

### Subscriptions Backgrounds
- **Landscape (2):** wallpaperflare.com_wallpaper (8).jpg, 1017220.jpg
- **Portrait (3):** 641988.png, 120600.png, unnamed (2).jpg
- **Banners (6):** 1017220.jpg, 43927.jpg, 527483.jpg, download (10, 12).jfif, Peace of mind.jpeg

### Avatar Options (3)
- 543497.jpg, 543509.jpg, unnamed (4).jfif

### Modal Backgrounds (3)
- Misty Mountain Blossoms.jfif, unnamed (2).jpg, Vagabond - Musashi Miyamoto wallpaper 1920x1080.jfif

### Loading Screen (1)
- 2026102.png

### Calendar Date Tiles (15)
- download.jpg, download (2-9, 11).jfif, pexels-felix-mittermeier-2832071.jpg, Misty Mountain Blossoms.jfif, alone-tree-sunset-qe.jpg, unnamed (8).jpg, unnamed7.jpg

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
