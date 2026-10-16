/* Optional LMS translation loader. Keep this script opt-in until the JSON URL is known. */
(function(){
  'use strict';
  var script=document.currentScript;
  if(!script)return;
  var url=script.getAttribute('data-i18n-url');
  var dictionary=null;
  var reportedMissing=Object.create(null);
  function localeFor(value){return value==='en'?'en':'es'}
  function lookup(locale,key){
    if(!dictionary||typeof key!=='string')return null;
    return key.split('.').reduce(function(value,part){return value&&value[part]},dictionary[locale])||null;
  }
  function translate(key,locale,vars){
    var normalized=localeFor(locale),value=lookup(normalized,key);
    if(typeof value!=='string'){if(dictionary)reportMissing(normalized,key);return null;}
    if(vars)value=value.replace(/\{(\w+)\}/g,function(_,name){return vars[name]===undefined?'':String(vars[name])});
    return value;
  }
  function reportMissing(locale,key){
    var id=locale+':'+key;if(reportedMissing[id])return;reportedMissing[id]=true;
    document.dispatchEvent(new CustomEvent('tp:i18nmissing',{detail:{locale:locale,key:key}}));
    if(window.console&&console.warn)console.warn('Falta la clave i18n "'+key+'" para el idioma '+locale+'. Se conserva el texto fallback.');
  }
  function apply(value,reason){
    if(!dictionary)return;
    var locale=localeFor(value),missing=[];
    /* Host language-change events also update the document language for screen readers. */
    document.documentElement.lang=locale;
    function setText(el,key){
      var text=translate(key,locale);if(text===null){missing.push(key);return}
      /* Keep punctuation spacing carried by inline text-node wrappers when swapping locale. */
      var source=el.textContent||'',leading=(source.match(/^\s*/)||[''])[0],trailing=(source.match(/\s*$/)||[''])[0];
      el.textContent=leading+text+trailing;
    }
    function setAttribute(el,key,name){var text=translate(key,locale);if(text===null){missing.push(key);return}el.setAttribute(name,text)}
    document.querySelectorAll('[data-i18n]').forEach(function(el){setText(el,el.getAttribute('data-i18n'))});
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function(el){setAttribute(el,el.getAttribute('data-i18n-aria-label'),'aria-label')});
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){setAttribute(el,el.getAttribute('data-i18n-title'),'title')});
    document.querySelectorAll('[data-i18n-ydc-echo]').forEach(function(el){setAttribute(el,el.getAttribute('data-i18n-ydc-echo'),'data-ydc-echo')});
    var dark=document.documentElement.getAttribute('data-theme')==='dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function(el){
      var ariaKey=dark?'theme.toLight':'theme.toDark';setAttribute(el,ariaKey,'aria-label');
      var visible=el.querySelector('.tp-mode-label');
      if(visible)setText(visible,dark?'theme.modeLabelDark':'theme.modeLabelLight');
    });
    document.querySelectorAll('.tp-dd[data-pref="font"]').forEach(function(dd){
      var selected=dd.querySelector('[role="option"][aria-selected="true"]'),label=dd.querySelector('[data-dd-label]');
      if(selected&&label)label.textContent=selected.textContent.trim();
    });
    if(missing.length){missing.forEach(function(key){reportMissing(locale,key)})}
    if(reason!=='theme')document.dispatchEvent(new CustomEvent('tp:i18napplied',{detail:{locale:locale}}))
  }
  function validate(data){
    if(!data||typeof data!=='object'||Array.isArray(data)||!data.es||!data.en||typeof data.es!=='object'||typeof data.en!=='object'||Array.isArray(data.es)||Array.isArray(data.en))
      throw new Error('El JSON debe incluir diccionarios de objetos "es" y "en".');
  }
  async function load(){
    try{
      if(!url)throw new Error('Falta data-i18n-url en la etiqueta del cargador.');
      var response=await fetch(url,{credentials:'same-origin'});
      if(!response.ok)throw new Error('HTTP '+response.status+' al cargar '+url);
      var data=await response.json();validate(data);dictionary=data;
      window.tpI18n=Object.freeze({t:translate,apply:apply});
      apply(document.documentElement.lang||'es','initial');
      document.addEventListener('tp:languagechange',function(event){apply(event.detail&&event.detail.lang||document.documentElement.lang||'es','language')});
      var observer=new MutationObserver(function(records){
        if(records.some(function(record){return record.attributeName==='data-theme'}))apply(document.documentElement.lang||'es','theme');
      });
      observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
      document.dispatchEvent(new CustomEvent('tp:i18nready',{detail:{url:url,locales:Object.keys(data)}}));
    }catch(error){
      document.dispatchEvent(new CustomEvent('tp:i18nerror',{detail:{url:url,error:error}}));
      if(window.console&&console.warn)console.warn('No se pudo cargar i18n.json; se conserva el texto incluido en la plantilla.',error);
    }
  }
  load();
})();
