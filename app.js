const tracks=[
  {title:'Дуть шары',src:'assets/dut-shary.mp3',lyrics:[
    {time:2,text:'саби учиха!'},
    {time:7,text:'утром солнышко встает, бегемот идет в перед'},
    {time:11,text:'В свой рюкзак шары кладу, чтоб потом мне их надуть'},
    {time:15,text:'красный, желтый, голубой, этот круглый тот кривой'},
    {time:19,text:'если шарик улетел, значит кто то не успел'},
    {time:22,text:'Дуть шары! Дуть шары!'},
    {time:24,text:'весело нам дуть шары!'},
    {time:27,text:'Утром дуть, ночью дуть'},
    {time:28,text:'главное не позабудь!'},
    {time:30,text:'Дуть шары! Дуть шары!'},
    {time:32,text:'весело нам дуть шары!'},
    {time:34,text:'Утром дуть, ночью дуть'},
    {time:36,text:'главное не позабудь!'},
    {time:37,text:'Шар надулся, Шар надулся'},
    {time:41,text:'бабах! ой. привеет!'},
    {time:45,text:'Шар надулся, Шар надулся'},
    {time:49,text:'бабах! ой. привеет!'}
  ]},
  {title:'Не брать в рот',src:'assets/ne-brat-v-rot.mp3',lyrics:[
    {time:0,text:'саби учиха!'},
    {time:7,text:'на дорожке у ворот'},
    {time:9,text:'кто то бросил бутерброд!'},
    {time:11,text:'он лежал там целый год'},
    {time:13,text:'не бери его ты в рот!'},
    {time:15,text:'год конфетка под столом'},
    {time:16,text:'вся покрылась волоском.'},
    {time:19,text:'ты конфетке скажешь:'},
    {time:20,text:'вот, не возьму тебя в рот!'},
    {time:22,text:'Не брать в рот! Не брать в рот!'},
    {time:24,text:'все подряд нельзя брать в рот!'},
    {time:26,text:'Не брать в рот! Не брать в рот!'},
    {time:28,text:'Это правила на год!'},
    {time:30,text:'пирожное? Можно!'},
    {time:32,text:'а ботинок? Неет'},
    {time:33,text:'а сосиску? можно!'},
    {time:35,text:'а батарейку? ты что. ебан....'},
    {time:37,text:'Лурики сделаны zev2s(сс)'}
  ]},
  {title:'Скажи ему нет',src:'assets/skazhi-net.mp3',lyrics:[
    {time:0,text:'саби учиха!'},
    {time:7,text:'Толстый дядя у буфета, доедает свой омлет,'},
    {time:11,text:'Пузо выпало из майки, на усах засох паштет.'},
    {time:15,text:'Вот пиздец, обидно, тошно (не разобрал)'},
    {time:17,text:'Весь в поту его жилет.'},
    {time:18,text:'Подошел и шепчет сладко:'},
    {time:21,text:'Сделаю тебе приятно)'},
    {time:23,text:'Нееет! Дядя позвал в туалет'},
    {time:24,text:'Скажи ему нет, скажи ему неет!'},
    {time:27,text:'Манит конфеткой #### Скажи ему нет,'},
    {time:29,text:'скажи ему неет!'},
    {time:31,text:'Дядя позвал в туалет'},
    {time:32,text:'Скажи ему нет, скажи ему неет!'},
    {time:35,text:'Даже если он говорит'},
    {time:36,text:'он друг твоего папы'},
    {time:37,text:'Скажи ему неееет!!'},
    {time:40,text:'Лурики сделаны zev2s(сс)'}
  ]}
];
const audio=document.querySelector('#audio'),playBtn=document.querySelector('#play'),progress=document.querySelector('#progress'),volume=document.querySelector('#volume');
const title=document.querySelector('#nowTitle'),duration=document.querySelector('#duration'),current=document.querySelector('#currentTime'),coverFrame=document.querySelector('#coverFrame'),trackRows=[...document.querySelectorAll('.track-row')],bars=document.querySelector('#soundBars'),status=document.querySelector('#soundStatus');
const lyricRows=[document.querySelector('#lyricPrev'),document.querySelector('#lyricCurrent'),document.querySelector('#lyricNext')];
let selected=-1,context=null,analyser=null,source=null,gainNode=null,data=null,seeking=false,fadeOutStarted=false,lyricAnimTimer=null,lyricUpdateToken=0;
for(let i=0;i<32;i++){const b=document.createElement('i');bars.appendChild(b)}
const barEls=[...bars.children];
const timeString=n=>{if(!Number.isFinite(n))return'0:00';const m=Math.floor(n/60),s=Math.floor(n%60);return `${m}:${String(s).padStart(2,'0')}`};
function updateLyrics(){if(!lyricRows[1])return;const lines=selected<0?[]:tracks[selected].lyrics;const isEmpty=!lines.length;let nextTexts;if(isEmpty)nextTexts=['',selected<0?'Выбери песню — здесь появится её текст':`Добавим сюда слова «${tracks[selected].title}»`,''];else{let active=0;for(let i=0;i<lines.length;i++){if(lines[i].time<=audio.currentTime)active=i;else break}nextTexts=[lines[active-1]?.text||'',lines[active].text,lines[active+1]?.text||'']}if(lyricRows.every((row,i)=>row.textContent===nextTexts[i])&&lyricRows[1].classList.contains('is-empty')===isEmpty)return;clearTimeout(lyricAnimTimer);const token=++lyricUpdateToken;lyricRows.forEach(row=>row.classList.add('is-changing'));lyricAnimTimer=setTimeout(()=>{if(token!==lyricUpdateToken)return;lyricRows.forEach((row,i)=>{row.textContent=nextTexts[i];row.classList.toggle('is-empty',isEmpty&&i===1)});requestAnimationFrame(()=>lyricRows.forEach(row=>row.classList.remove('is-changing')))},180)}
function selectTrack(index,autoplay=true){selected=(index+tracks.length)%tracks.length;fadeOutStarted=false;audio.src=tracks[selected].src;title.textContent=tracks[selected].title;trackRows.forEach((r,i)=>{r.classList.toggle('active',i===selected);r.querySelector('.track-play').textContent=i===selected&& !audio.paused?'Ⅱ':'▶'});updateLyrics();audio.load();if(autoplay)audio.play().catch(()=>{});else updateButton()}
function updateButton(){const playing=!audio.paused;document.body.classList.toggle('is-playing',playing);playBtn.setAttribute('aria-label',playing?'Пауза':'Воспроизвести');trackRows.forEach((r,i)=>r.querySelector('.track-play').textContent=i===selected&&playing?'Ⅱ':'▶');status.textContent=playing?'ВОЛНА ИДЁТ':'ОЖИДАНИЕ'}
function setupAnalyser(){if(context)return;context=new (window.AudioContext||window.webkitAudioContext)();analyser=context.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.72;gainNode=context.createGain();gainNode.gain.value=0;source=context.createMediaElementSource(audio);source.connect(analyser);analyser.connect(gainNode);gainNode.connect(context.destination);data=new Uint8Array(analyser.frequencyBinCount)}
function fadeTo(value,seconds){if(!gainNode||!context)return;const param=gainNode.gain,now=context.currentTime;param.cancelScheduledValues(now);param.setValueAtTime(param.value,now);param.linearRampToValueAtTime(value,now+seconds)}
playBtn.addEventListener('click',async()=>{if(selected<0){selectTrack(0,false)}setupAnalyser();if(context.state==='suspended')await context.resume();if(audio.paused)audio.play().catch(()=>{});else audio.pause()});
trackRows.forEach((row,i)=>row.addEventListener('click',()=>{if(selected===i&&!audio.paused)audio.pause();else{setupAnalyser();if(context.state==='suspended')context.resume();selectTrack(i,true)}}));
document.querySelector('#prev').addEventListener('click',()=>{setupAnalyser();selectTrack(selected<=0?tracks.length-1:selected-1)});
document.querySelector('#next').addEventListener('click',()=>{setupAnalyser();selectTrack(selected+1)});
audio.addEventListener('play',()=>{updateButton();if(audio.currentTime<.15){fadeOutStarted=false;gainNode.gain.cancelScheduledValues(context.currentTime);gainNode.gain.setValueAtTime(0,context.currentTime);fadeTo(1,1.35)}else fadeTo(1,.12)});audio.addEventListener('pause',updateButton);audio.addEventListener('ended',updateButton);
audio.addEventListener('loadedmetadata',()=>{duration.textContent=timeString(audio.duration);trackRows.forEach((r,i)=>{if(i===selected)r.querySelector('.track-duration').textContent=timeString(audio.duration)})});
audio.addEventListener('timeupdate',()=>{if(!seeking&&Number.isFinite(audio.duration))progress.value=audio.currentTime/audio.duration*1000;current.textContent=timeString(audio.currentTime);updateLyrics();const remaining=audio.duration-audio.currentTime;if(!fadeOutStarted&&audio.duration>0&&remaining<=1.8){fadeOutStarted=true;fadeTo(0,Math.max(.08,remaining))}});
progress.addEventListener('input',()=>{seeking=true;if(Number.isFinite(audio.duration))current.textContent=timeString(progress.value/1000*audio.duration)});progress.addEventListener('change',()=>{if(Number.isFinite(audio.duration))audio.currentTime=progress.value/1000*audio.duration;seeking=false});
volume.addEventListener('input',()=>audio.volume=volume.value);audio.volume=volume.value;
function animate(){requestAnimationFrame(animate);let energy=0;if(analyser&&!audio.paused){analyser.getByteFrequencyData(data);let total=0;for(let i=1;i<17;i++)total+=data[i];energy=total/(16*255)}const pulse=audio.paused?.008:Math.max(.009,energy*.10);coverFrame.style.setProperty('--beat',String(1+pulse));barEls.forEach((b,i)=>{let v=audio.paused?0.18:Math.max(.12,(data?.[i+2]||0)/255);b.style.height=`${3+v*10}px`;b.style.opacity=audio.paused?'.45':String(.45+v*.55)})}updateLyrics();animate();
