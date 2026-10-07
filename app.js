const KEY="nutrition-v2";
const today=()=>new Date().toISOString().slice(0,10);
const defaults={started:today(),freeUsed:{},meals:{},weights:{},workouts:{},loadings:{}};
let s=JSON.parse(localStorage.getItem(KEY)||"null")||defaults;
const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function days(){return Math.max(1,Math.floor((new Date(today())-new Date(s.started))/86400000)+1)}
function freeEarned(){return days()*150}
function freeUsed(){return Object.values(s.freeUsed).reduce((a,b)=>a+(+b||0),0)}
function balance(){return freeEarned()-freeUsed()}
const proteins=[
"310 גרם בשר רזה — עוף / הודו / כבד / בקר רזה וכו׳ (מועדף)",
"220 גרם בשר שמן",
"220 גרם סלמון / דניס / טונה בשמן מסוננת",
"370 גרם דג רזה",
"3 מעדני חלבון — 20 גרם חלבון ועד 130 קלוריות לכל מעדן",
"7 ביצים, עם חצי מהחלמונים (לעגל מטה) — עד פעם ביום",
"7 פרוסות גבינה צהובה 9% — עד פעם ביום",
"440 גרם קוטג׳ / גבינה לבנה 5%"
];
const carbs=[
"240 גרם אורז לבן מבושל",
"180 גרם פסטה / פתיתים / ניוקי / קוסקוס",
"100 גרם לחם לבן — פיתה / לחמנייה / בגט",
"360 גרם תפוחי אדמה לפני בישול"
];
const snacks=[
"2 מעדני חלבון",
"חטיף אנרגיה + מעדן חלבון",
"תפוח אדום / תפוז + מעדן חלבון",
"2 תפוחים ירוקים + מעדן חלבון"
];
const loadingOut=[
"6 משולשי פיצה — 720 גרם, לא Pizza Hut",
"6 רולים סושי דג, לא מטוגנים",
"Double McRoyal + 2 מנות צ׳יפס גדולות + מנת צ׳יפס רגילה",
"3 רולים סודוך"
];
const loadingProtein=["400 גרם בשר רזה","420 גרם דג רזה","9 פרוסות גבינה צהובה 9%"];
const loadingCarb=["520 גרם לחם לבן","650 גרם פסטה ברוטב עגבניות","1 ק״ג אורז לבן מבושל","1.5 ק״ג תפוחי אדמה לפני בישול"];
let page="today";
const options=a=>'<ul>'+a.map(x=>'<li>'+x+'</li>').join("")+'</ul>';
function nav(){return '<div class="nav"><button data-p="today">היום</button><button data-p="plan">התפריט</button><button data-p="free">150 חופשי</button><button data-p="loading">העמסה</button><button data-p="progress">מעקב</button></div>'}
function shell(content){app.innerHTML='<div class="wrap"><div class="hero"><h1>התזונה שלי</h1><div class="muted">התפריט המקורי + מעקב יומי</div></div>'+content+nav()+'</div>';document.querySelectorAll("[data-p]").forEach(b=>{if(b.dataset.p===page)b.classList.add("active");b.onclick=()=>{page=b.dataset.p;render()}})}
function todayPage(){let d=today(),m=s.meals[d]||{};let rows=[["צום בוקר","לפחות 3 שעות מהקימה"],["ארוחת צהריים","ירקות + מנת חלבון אחת"],["ארוחת ביניים","אופציונלית — אפשרות אחת"],["ארוחת ערב","ירקות + מנת חלבון אחת + מנת פחמימה אחת"]];return '<div class="grid"><div class="card"><div class="muted">יתרת 150</div><div class="stat '+(balance()<0?"warn":"good")+'">'+balance()+'</div><div>קלוריות</div></div><div class="card"><div class="muted">משקל היום</div><div class="stat">'+(s.weights[d]||"—")+'</div><div>ק״ג</div></div></div><div class="card"><h2>היום</h2>'+rows.map((x,i)=>'<div class="meal row"><input class="check" type="checkbox" data-meal="'+i+'" '+(m[i]?"checked":"")+'> <div><b>'+x[0]+'</b><div class="muted">'+x[1]+'</div></div></div>').join("")+'</div><div class="card"><h2>אימון כוח</h2><button id="strength" class="'+(s.workouts[d]?"primary":"soft")+'">'+(s.workouts[d]?"✓ בוצע אימון כוח":"סמן אימון כוח")+'</button><p class="muted">העמסה שבועית אפשרית רק אחרי אימון כוח ובמקום ארוחת הערב.</p></div>'}
function planPage(){return '<div class="card"><h2>כללי בסיס</h2><p><b>בוקר:</b> צום של לפחות 3 שעות מהקימה. קפה ומשקאות זירו מותרים לפי כללי התפריט.</p><p><b>ירקות:</b> בארוחות הרלוונטיות ניתן להוסיף 300 גרם ירקות צבעוניים או 100 קלוריות רוטב במקום.</p><p><b>שקילה:</b> בשר, דגים, ירקות ותפוחי אדמה — לפני בישול. כל השאר — אחרי בישול. בשר שנשקל מבושל: להפחית 25% מהכמות הרשומה.</p><p><b>שתייה:</b> 2–3 ליטר מים ביום; משקאות זירו רק עם הארוחות; חלב עד 200 מ״ל ביום; ללא שמן בסלט וללא מטוגן.</p></div><div class="card"><h2>חלבון — מנה אחת</h2>'+options(proteins)+'</div><div class="card"><h2>פחמימה — מנה אחת בערב</h2>'+options(carbs)+'<p class="muted">בארוחה הרגילה: ירקות + חלבון; בערב מתווספת מנת פחמימה.</p></div><div class="card"><h2>ארוחת ביניים — אופציונלית</h2>'+options(snacks)+'</div>'}
function freePage(){let d=today(),used=+(s.freeUsed[d]||0);return '<div class="card"><h2>בנק 150 קלוריות</h2><div class="stat '+(balance()<0?"warn":"good")+'">'+balance()+'</div><p>כל יום מתווספות 150 קלוריות. מה שלא נוצל נשמר ונצבר.</p><div class="bar"><div class="fill" style="width:'+Math.min(100,freeUsed()/Math.max(1,freeEarned())*100)+'%"></div></div><p class="muted">נצברו: '+freeEarned()+' · נוצלו: '+freeUsed()+'</p><div class="row"><input id="freeInput" class="amount" type="number" min="0" value="'+used+'"><button id="saveFree" class="primary">שמור שימוש היום</button></div></div>'}
function loadingPage(){let d=today(),can=!!s.workouts[d],done=!!s.loadings[d];return '<div class="card"><h2>העמסה שבועית</h2><p><b>פעם אחת בשבוע בלבד, אחרי אימון כוח, ובמקום ארוחת הערב.</b></p>'+(can?'<div class="good">✓ אימון כוח מסומן היום</div>':'<div class="warn">עדיין לא סומן אימון כוח היום.</div>')+'<h3>אפשרות א׳ — בחוץ</h3>'+options(loadingOut)+'<h3>אפשרות ב׳ — חלבון אחד + פחמימה אחת</h3><b>חלבון:</b>'+options(loadingProtein)+'<b>פחמימה:</b>'+options(loadingCarb)+'<p class="muted">האפשרויות חלופיות, לא מצטברות.</p><button id="loadingBtn" '+(!can?"disabled":"")+' class="'+(done?"danger":"primary")+'">'+(done?"בטל העמסה של היום":"סמן העמסה היום")+'</button></div>'}
function progressPage(){let d=today();return '<div class="card"><h2>מעקב משקל</h2><div class="row"><input id="weight" class="amount" type="number" step=".1" value="'+(s.weights[d]||"")+'" placeholder="90.0"><button id="saveWeight" class="primary">שמור</button></div></div><div class="card"><h2>7 ימים אחרונים</h2>'+Array.from({length:7},(_,i)=>{let x=new Date();x.setDate(x.getDate()-i);let k=x.toISOString().slice(0,10);return '<div class="meal"><b>'+k+'</b> — '+(s.weights[k]?s.weights[k]+' ק״ג':'לא הוזן')+'</div>'}).join("")+'</div>'}
function render(){shell(page==="today"?todayPage():page==="plan"?planPage():page==="free"?freePage():page==="loading"?loadingPage():progressPage());let d=today();document.querySelectorAll("[data-meal]").forEach(c=>c.onchange=()=>{s.meals[d]=s.meals[d]||{};s.meals[d][c.dataset.meal]=c.checked;save()});let el=document.querySelector("#strength");if(el)el.onclick=()=>{s.workouts[d]=!s.workouts[d];save();render()};el=document.querySelector("#saveFree");if(el)el.onclick=()=>{let v=Math.max(0,+document.querySelector("#freeInput").value||0);if(v>balance()+(+s.freeUsed[d]||0)){alert("אין מספיק קלוריות בבנק.");return}s.freeUsed[d]=v;save();render()};el=document.querySelector("#saveWeight");if(el)el.onclick=()=>{s.weights[d]=document.querySelector("#weight").value;save();render()};el=document.querySelector("#loadingBtn");if(el)el.onclick=()=>{if(!s.workouts[d])return;let wk=new Date();wk.setDate(wk.getDate()-7);let recent=Object.keys(s.loadings).some(k=>s.loadings[k]&&new Date(k)>wk&&k!==d);if(!s.loadings[d]&&recent){alert("כבר סומנה העמסה בשבעת הימים האחרונים.");return}s.loadings[d]=!s.loadings[d];save();render()}}
render();