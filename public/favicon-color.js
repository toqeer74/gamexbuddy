(function(){
  try{
    var link = document.querySelector('link#favicon[href$=".svg"]');
    if (!link) return;
    fetch(link.href).then(function(r){ return r.text(); }).then(function(svg){
      var black = svg
        .replace(/fill="(white|#fff|#FFFFFF)"/g, 'fill="black"')
        .replace(/stroke="(white|#fff|#FFFFFF)"/g, 'stroke="black"');
      var blob = new Blob([black], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
    }).catch(function(){});
  } catch {}
})();

