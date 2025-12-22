# GTECH 2025 Year in Review

A single-page React website with GSAP animations, Bootstrap layout, and Sass styling.

## 🚀 Quick Start

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - React & React DOM
   - GSAP (for animations)
   - Bootstrap (for layout/components)
   - Sass (for SCSS support)

### Running the Project

2. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000` in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
gtech-2025/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/
│   │   ├── Menu.js         # Navigation menu component
│   │   ├── Menu.scss       # Menu styles
│   │   ├── SectionOne.js   # First section with GSAP example
│   │   ├── SectionOne.scss # Section one styles
│   │   ├── SectionTwo.js   # Second section with stagger animation
│   │   └── SectionTwo.scss # Section two styles
│   ├── App.js              # Main app component
│   ├── App.scss            # App-level styles
│   ├── index.js            # React entry point
│   └── index.scss          # Global styles
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## ✏️ Where to Edit

### HTML/JSX Content
- **Menu**: Edit `src/components/Menu.js`
- **Section One**: Edit `src/components/SectionOne.js`
- **Section Two**: Edit `src/components/SectionTwo.js`
- **Main App**: Edit `src/App.js` to add/remove sections

### Styles (SCSS)
- **Menu Styles**: Edit `src/components/Menu.scss`
- **Section One Styles**: Edit `src/components/SectionOne.scss`
- **Section Two Styles**: Edit `src/components/SectionTwo.scss`
- **Global Styles**: Edit `src/index.scss`
- **App Styles**: Edit `src/App.scss`

### GSAP Animations

#### Basic Animation Pattern

In any component, use this pattern:

```javascript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MyComponent = () => {
  // 1. Create a ref for the element you want to animate
  const elementRef = useRef(null);

  useEffect(() => {
    // 2. Animate when component mounts
    gsap.from(elementRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });
  }, []);

  // 3. Attach ref to JSX element
  return (
    <div ref={elementRef}>
      Content to animate
    </div>
  );
};
```

#### Animation Examples in This Project

**SectionOne.js** - Simple fade-in and slide-up:
- Uses `gsap.timeline()` for sequenced animations
- Animates title first, then content

**SectionTwo.js** - Staggered card animations:
- Uses `gsap.fromTo()` with `stagger` property
- Animates multiple cards in sequence
- Uses `scrollTrigger` (requires GSAP ScrollTrigger plugin - see note below)

### Common GSAP Properties

- `opacity`: 0 to 1 for fade in/out
- `y`: Vertical movement (positive = down, negative = up)
- `x`: Horizontal movement
- `scale`: Size (1 = normal, 0.5 = half size, 2 = double)
- `duration`: Animation length in seconds
- `delay`: Wait time before animation starts
- `ease`: Animation curve ('power3.out', 'back.out', 'elastic', etc.)
- `stagger`: Delay between multiple elements

## 🎨 Menu Design

The menu has:
- **Logo on the left**: Edit the logo text in `Menu.js` (currently "GTECH")
- **White text links on the right**: Navigation links styled in white
- **Fixed position**: Stays at top when scrolling

## 📦 Adding More Sections

1. Create a new component file: `src/components/SectionThree.js`
2. Create its styles: `src/components/SectionThree.scss`
3. Import and add to `src/App.js`:
   ```javascript
   import SectionThree from './components/SectionThree';
   
   // In the return:
   <SectionThree />
   ```

## 🔧 Advanced: ScrollTrigger Plugin

For scroll-triggered animations (like in SectionTwo), you can install the GSAP ScrollTrigger plugin:

```bash
npm install gsap
```

Then import it in your component:
```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

Note: The current SectionTwo example uses ScrollTrigger syntax, but you'll need to register the plugin for it to work. For now, SectionOne uses basic animations that work without plugins.

## 💡 Tips for Beginners

1. **useRef**: Creates a reference to a DOM element so GSAP can animate it
2. **useEffect**: Runs code after the component renders (perfect for animations)
3. **Empty dependency array `[]`**: Makes useEffect run only once on mount
4. **Timeline**: Use `gsap.timeline()` to chain multiple animations
5. **Stagger**: Use `stagger` property to animate multiple elements in sequence

## 🐛 Troubleshooting

- **Animations not working?** Make sure refs are attached to elements (`ref={myRef}`)
- **Styles not applying?** Check that SCSS files are imported in the component
- **Port already in use?** Change the port: `PORT=3001 npm start`

## 📚 Resources

- [React Documentation](https://react.dev)
- [GSAP Documentation](https://greensock.com/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [Sass Documentation](https://sass-lang.com/documentation)

---

Happy coding! 🎉

