[Array.]cmp([array]) -> converts multi-dimensional array to single-dinensional
[Array.]rnd([from <Number>, to <Number>, non-rounded <Boolean>])|Rnd|Array.Rnd -> random number/element,leave arg(s) blank for random HEX.
swt([append <String>]) -> refresh specific funcs and append flags on auto switch.
[Math.]dst(x <Number>, y <Number>[, d <Number>]) -> provide (x,y) to calculate distance with pythagorean,provide (x||y,d) to calculate the missing parameter, (x,y,1) for degrees.
[Math.]Dst(x1 <Number>, x2 <Number>, y1 <Number>, y2 <Number>) -> dst between 2 objects.
[Math.]dst3(x <Number>, y <Number>, z <Number>, d <Number>) -> 3D dst.
[Math.]Dst3(x <Number>, y <Number>, z <Number>, X <Number>, Y <Number>, Z <Number>) -> Dst between 2 objects.
[Math.]col(x <Number>, y <Number>, X <Number>, Y <Number>, dx <Number>, dy <Number>, dX <Number>, dY <Number>) -> check if boxes collide.
[Math.]col(X <Number>, Y <Number>, dx <Number>, dy <Number>, x <Number>, y <Number>, r <Number>) -> box-circle.
[Math.]col(x <Number>, y <Number>, r <Number>, X <Number>, Y <Number>, R <Number>) -> circle-circle.
[Math.]col(x <Number>, y <Number>, r <Number>, X <Number>, Y <Number>) -> circle-point.
[Math.]col(x <Number>, y <Number>, r <Number>, ro <Number>, s <Number>, X <Number>, Y <Number>, R <Number>, RO <Number>, S <Number>) -> perfect polygon collisions.
[Math.]col3(x <Number>, y <Number>, z <Number>, r <Number>, X <Number>, Y <Number>, Z <Number>, R <Number>) -> 3D spheres.
[(Number|String|Function).]rep([count <Number>, command <Function>, intial <Number>]) -> repeat a command.
[(Math|Number).]deg([degrees <Number>, radians <Boolean>]) -> convert degrees <=> radians.
[(Number|Math).]anl([number <Number>, ]min <Number>, max <Number>, Min <Number>, Max <Number>) -> number from range [min,max] to range [Min,Max] analogically.
[(Math|Number).]per([number <Number>, ]percentance <Number>[, scale=100 <Number>]) -> returns percentance of number.
(String|Array|Number).wrp(wrap <String>) -> wrap between.
[(Function|String|Number).]con([command <Function>, ]interval <Number>) -> run a command constantly, like setInterval but ignores first interval cooldown time.
Object.((ins|Ins)()|_ins|_Ins) -> inspect object enumerable properties or stringify non circular struct.
Object.((prp|Prp)(index <Number>)|_prp) -> grab object property (value|key) by index.
Object.(keys()|Keys) -> an alternative of Object.keys(object)
Object.(values()|Values) -> an alternative of Object.values(object)
Deprecated: String.dup(times <Number>) -> repeat string pattern. Pollyfill of String.repeat.
[Boolean.](alt([boolean  <Boolean>])|Alt) -> alternate boolean value.
Number.(sig()|Sig)|[Math.]sig(number <Number>) -> signum (+1/-1/0).
(Array|String).rmv(index) -> remove item from array/string.
(String|Array|Number).wrp(wr) -> wrap between.
Deprecated: Array.(pure()|Pure) -> grab array value instead of pointer.
Image.(data()|Data) -> export image as base64.
Array.(shf()|Shf) -> shuffle.
Object.(last(index <Number>)|Last) -> last element.
Object.(first(index <Number>)|First) -> first element.
(Number|Math).lim(min <Number>, max <Number>) -> limit number range.
(Number|Math).Lim(min <Number>, max <Number>) -> circular limit.
(Number|Array).(sum()|Sum) -> sum of range (0,this).
(Number|Array).(fac()|Fac) -> factorial of range.
[Object.](bool([item <Object>])|Bool) -> boolean representation.
par(function <String>, number <Number>, name <String>, code <String>) -> create number with specific number of params... E.x. : par("func",5,"param",function(){alert(param2)}||"alert(param2)") - func=function func(param1,param2,param3,param4,param5,param,param0){alert(param2)}.
Math.(Max|Min)(numarray <Array>)|Array.((min|max)()|(Min|Max)) -> max/min num of array.
Array.fill(value <Object>[, from <Number>, to <Number>]) -> fill polyfill.
[Boolean.]xor(a <Boolean>[, b <Boolean>]) -> a or b but not both.
Array.add(elm <Object>) -> add element if not already in array.
Array.has(elm <Object>) -> check if array has element.
Array.tog(element <Object>) -> toggle array element.
Array.flt() -> array elements become unique.
Array.inh(array <Array>) -> inherit on real array.
Matrix(2Darray <Array>) -> math matrix class, m : array, values : singledimensional m, row : row length , column : column length, trans() : transpose, mult(<Matrix|Number>) : multiply, add(<Matrix|Number>) : add.
D(x <Number>,y <Number>,z <Number>) -> 3D point, t(camera <Array>), T(distance <Object>), i().
err -> errors
csl -> console
auto -> mode switch, strict = no getters
Auto -> like auto but bitwise
AUTO -> Auto's constants
nul -> function(){}
Sec -> uptime
alph -> "abcdefghijklmnopqrtsuvwxyz"
ALPH -> alph.toUpperCase()
Alph -> (alph+ALPH+"0123456789")
prefix -> ["moz","webkit","o","ms","khtml","ie"]
Rnd -> random HEX color