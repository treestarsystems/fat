function registerHelpers (hbs) {
 //Load custom JS files based on the customJS array that is deifined and passed in the server/controller/routes.js file.
 hbs.handlebars.registerHelper('loadCustomJS', function(customJSArray) {
   let html = '';
   for (let i = 0; i < customJSArray.length; i++) {
    html += `<script src="${customJSArray[i]}"></script>\n`;
   }
   return html;
 })

 //Automatically adjest the CSS to enable dark mode for better viewing at night.
 hbs.handlebars.registerHelper('enableDarkMode', function() {
  let html = '';
  let currentTime = new Date();
  let currentHour = currentTime.getHours();
  if (currentHour >= 6 && currentHour <= 20) {
   return html;
  } else {
   html += '<link rel="stylesheet" href="public/css/dark.css">';
   html += '<link rel="stylesheet" href="public/css/sweetalert2-dark.min.css">';
   return html;
  }
 })
}

module.exports = {
 registerHelpers
}
