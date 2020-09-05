![Duck](https://raw.githubusercontent.com/Aelof3/DuckDrone/master/src/assets/images/duckbg5.jpg)  
# DuckDrone  
*A different take on an old style...*  

*brought to you by Richard Folea*  
*music courtesy of @notchris - http://notchris.net/*

#### Local Install:
```bash  
git clone https://github.com/Aelof3/DuckDrone.git  
cd DuckDrone  
npm install  
npm run start  
```  
then open `localhost:8080` in your browser  
  
## Controls:  
- Toggle Individual Engines:  
  `[ q ][ w ]`  
  `[ a ][ s ]`  
- Toggle All Engines: `SPACEBAR`  
- Throttle: `SHIFT`  
- Reverse: `CTRL`  
- Reset: `BACKSPACE`  
- Menu: `ESC`  
  
## Demo URL:  
  https://aelof3.github.io/DuckDrone/  
  
## Level Editor URL:  
  https://aelof3.github.io/DuckDrone/editor/  
  
#### Option Values:  
- keys: `value 1-8`  
- power: `any number, cannot go above maxpower`  
- maxpower: `any number, sets maximum velocity`  
  
#### Keybind Choices:  
- keys = 1:  
    `[ q ][ w ]`  
    `[ a ][ s ]`  
- keys = 2:  
    `[ w ][ s ]`  
    `[ q ][ a ]`  
- keys = 3:  
    `[ q ][ w ][ e ]`  
    `[ a ][ s ][ d ]`  
- keys = 4:  
    `[ q ][ w ][ e ]`  
    `[ a ][ s ][ d ]`  
    `[ z ][ x ][ c ]`  
- keys = 5:  
    `[ q ][ w ][ e ][ r ]`  
    `[ a ][ s ][ d ][ f ]`  
    `[ z ][ x ][ c ][ v ]`  
- keys = 6:  
    `[ q ][ w ][ e ][ r ][ t ][ y ][ u ]`  
    `[ a ][ s ][ d ][ f ][ g ][ h ][ j ]`  
    `[ z ][ x ][ c ][ v ][ b ][ n ][ m ]`  
- keys = 7:  
    `[ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ]`  
    `[ q ][ w ][ e ][ r ][ t ][ y ][ u ]`  
    `[ a ][ s ][ d ][ f ][ g ][ h ][ j ]`  
    `[ z ][ x ][ c ][ v ][ b ][ n ][ m ]`  
- keys = 8:  
    `[ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 0 ]`  
    `[ q ][ w ][ e ][ r ][ t ][ y ][ u ][ i ][ o ][ p ]`  
    `[ a ][ s ][ d ][ f ][ g ][ h ][ j ][ k ][ l ][ ; ]`  
    `[ z ][ x ][ c ][ v ][ b ][ n ][ m ][ , ][ . ][ / ]`  


#### Modes:  
- individual: `(default) no throttle needed, must hold down each engine key`  
- individualtoggle: `no throttle needed, engine keys toggle when pressed`  
- throttle: `the throttle is needed to make the engines go`  