# Website Performance Optimization Project

## Build

First, clone the repository on your local machine.

Next, install the node dependencies

`npm install`

Use Grunt to build.

`grunt build'

Start local web server

`cd dist`

python3 `python -m http.server 8080` or python 2.7 `python -m SimpleHTTPServer 8080`

View site on *localhost:8080*

### Grunt tasks

I am using `imagemin`, `htmlmin`, `uglify`, and `cssmin` to optimize all of the files for the website and then move them to the `dist/` directory for deployment.

## index.html pagespeed insights optimization

### Javascript

I eliminated the render-blocking css from the Google Fonts API by using the 
Google webfont loader.

```html
    <script type="text/javascript">
        WebFontConfig = {
            google: {
                families: ['Open+Sans:400,700']
            }
        };
        (function() {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();
    </script>
```

I also added `async` to the perfmatters.js and google-analytics scripts.

```html
    <script async src="http://www.google-analytics.com/analytics.js"></script>
    <script async src="js/perfmatters.min.js"></script>
```

### CSS

I inlined all of the css code from `styles.css` into index.html.  The 'print' media query was made its own *css* file.

```html
<link href="css/print.css" rel="stylesheet" media='print'>
```

### html and JavaScript minify
I minified all html and Javascript files using Grunt packages.

### Image Optimization

I used *imagemagick* to compress the two large images (pizzeria.jpg) that were being loaded on both *index.html* and *pizza.html*. 
```
 $ convert -strip -interlace Plane -gaussian-blue 0.05 -quality 85% 
```

*imagemagick* was also used to resize the index.html pizza.jpg and the views/images/pizza.png.

I used the `grunt-contrib-imagemin` package to optimize all of the images in the project.  This reduced the total number of bytes that need to be downloaded.

## pizza.html and main.js optimization

### Change Pizza Size Optimization

I removed the layout thrashing from this function by pulling the `document.querySelectorAll` out of the for loop.  This creates a single read of the layout properties and then allows us to batch write the new style.

I also refactored the pizza movement logic so that instead of resizing the pizzas by a set pixel width (which was needlessly complicated) it instead risizes the pizzas by a percentage width.

```javascript
 function changePizzaSizes(size) {
      switch(size) {
        case "1":
          newwidth = 25;
          break;
        case "2":
          newwidth = 33.3;
           break;
        case "3":
          newwidth = 50;
          break;
        default:
          console.log("bug in sizeSwitcher");
      }
    var pizzas = document.querySelectorAll(".randomPizzaContainer");
    for (var i = 0, len=pizzas.length; i < len; i++) { //removed .length call each time for loop is executed
      pizzas[i].style.width = newwidth + '%';
    }
  }
```

### Moving Pizza Changes

#### requestAnimationFrame

I used `window.requestAnimationFrame()` to call updatePositions().

#### Reduce forced syncronous layout 

I altered `updatePositions()` to do single read of the moving pizzas and the scroll position.  I then used the for loop to conduct all of the layout updates as a single batch.  

I also switch to **.transform** and **translate**.  **Transform** does not cause any change to geometry so the page does not need to redo layout or paint. This removes the layout thrashing that was occuring.

```javascript
function updatePositions() {
  'use strict';
  frame++;
  window.performance.mark("mark_start_frame");

  var items = document.querySelectorAll('.mover'); 
  var scrolltop = document.body.scrollTop;
  var phase; //brought var phase creation outside of for loop
  for (var i = 0, len = items.length; i < len; i++) { //changed to single .length call
    phase = Math.sin((scrolltop/ 1250) + (i % 5));
    items[i].style.transform = 'translate(' + 100 * phase +'px)';
  }
}
```

#### Reduce number of moving pizzas
I reduced the number of moving pizza containers from 200 to equal the number of columns x #rows where rows is based on the height of the screen.

#### Resize pizza.png image
I resized the pizza.png image to be 74 x 100px wide to remove the need for the browser to resize the images on creation.

```javascript
var columns = 8;
var pixelSeperation = 256;
var rows = Math.floor(window.screen.height / pixelSeperation) + 1;

// Generates the sliding pizzas when the page loads.
document.addEventListener('DOMContentLoaded', function() {
  movers = document.getElementById("movingPizzas1"); //quicker api call than querySelector
  for (var i = 0; i < columns*rows; i++) {
    var elem = document.createElement('img');
    elem.className = 'mover';
    elem.src = "images/pizza_sm.png";
    elem.style.left = (i % columns) * pixelSeperation + 'px';
    elem.style.top = (Math.floor(i / columns) * pixelSeperation) + 'px';
    movers.appendChild(elem);
  }
  window.requestAnimationFrame(updatePositions);
});
```

This also required me to remove `width: 256px;` from the .mover class.

```css
.mover {
  position: fixed;
  z-index: -1;
}
```
