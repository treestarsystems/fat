//Account History
function accountHistory() {
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("accountHistory", am4charts.XYChart);

// Increase contrast by taking evey second color
chart.colors.step = 2;

// Add data
chart.data = generateChartData();

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 50;

// Create series
function createAxisAndSeries(field, name, opposite, bullet) {
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  if(chart.yAxes.indexOf(valueAxis) != 0){
  	valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
  }
  
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.dateX = "date";
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.name = name;
  series.tooltipText = "{name}: [bold]{valueY}[/]";
  series.tensionX = 0.8;
  series.showOnInit = true;
  
  var interfaceColors = new am4core.InterfaceColorSet();
  
  switch(bullet) {
    case "triangle":
      var bullet = series.bullets.push(new am4charts.Bullet());
      bullet.width = 12;
      bullet.height = 12;
      bullet.horizontalCenter = "middle";
      bullet.verticalCenter = "middle";
      
      var triangle = bullet.createChild(am4core.Triangle);
      triangle.stroke = interfaceColors.getFor("background");
      triangle.strokeWidth = 2;
      triangle.direction = "top";
      triangle.width = 12;
      triangle.height = 12;
      break;
    case "rectangle":
      var bullet = series.bullets.push(new am4charts.Bullet());
      bullet.width = 10;
      bullet.height = 10;
      bullet.horizontalCenter = "middle";
      bullet.verticalCenter = "middle";
      
      var rectangle = bullet.createChild(am4core.Rectangle);
      rectangle.stroke = interfaceColors.getFor("background");
      rectangle.strokeWidth = 2;
      rectangle.width = 10;
      rectangle.height = 10;
      break;
    default:
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = interfaceColors.getFor("background");
      bullet.circle.strokeWidth = 2;
      break;
  }
  
  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 2;
  valueAxis.renderer.line.stroke = series.stroke;
  valueAxis.renderer.labels.template.fill = series.stroke;
  valueAxis.renderer.opposite = opposite;
}

createAxisAndSeries("visits", "Visits", false, "circle");
createAxisAndSeries("views", "Views", true, "triangle");
createAxisAndSeries("hits", "Hits", true, "rectangle");

// Add legend
chart.legend = new am4charts.Legend();

// Add cursor
chart.cursor = new am4charts.XYCursor();

// generate some random data, quite different range
function generateChartData() {
  var chartData = [];
  var firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 100);
  firstDate.setHours(0, 0, 0, 0);

  var visits = 1600;
  var hits = 2900;
  var views = 8700;

  for (var i = 0; i < 15; i++) {
    // we create date objects here. In your data, you can have date strings
    // and then set format of your dates using chart.dataDateFormat property,
    // however when possible, use date objects, as this will speed up chart rendering.
    var newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);

    visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
    hits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
    views += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);

    chartData.push({
      date: newDate,
      visits: visits,
      hits: hits,
      views: views
    });
  }
  return chartData;
}
}

//Assets
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("assetGraph", am4charts.XYChart);

// Add data
chart.data = [{
  "year": "1930",
  "italy": 1,
  "germany": 5,
  "uk": 3
}, {
  "year": "1934",
  "italy": 1,
  "germany": 2,
  "uk": 6
}, {
  "year": "1938",
  "italy": 2,
  "germany": 3,
  "uk": 1
}, {
  "year": "1950",
  "italy": 3,
  "germany": 4,
  "uk": 1
}, {
  "year": "1954",
  "italy": 5,
  "germany": 1,
  "uk": 2
}, {
  "year": "1958",
  "italy": 3,
  "germany": 2,
  "uk": 1
}, {
  "year": "1962",
  "italy": 1,
  "germany": 2,
  "uk": 3
}, {
  "year": "1966",
  "italy": 2,
  "germany": 1,
  "uk": 5
}, {
  "year": "1970",
  "italy": 3,
  "germany": 5,
  "uk": 2
}, {
  "year": "1974",
  "italy": 4,
  "germany": 3,
  "uk": 6
}, {
  "year": "1978",
  "italy": 1,
  "germany": 2,
  "uk": 4
}];

// Create category axis
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "year";
categoryAxis.renderer.opposite = true;

// Create value axis
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inversed = true;
valueAxis.title.text = "Place taken";
valueAxis.renderer.minLabelPosition = 0.01;

// Create series
var series1 = chart.series.push(new am4charts.LineSeries());
series1.dataFields.valueY = "italy";
series1.dataFields.categoryX = "year";
series1.name = "Italy";
series1.bullets.push(new am4charts.CircleBullet());
series1.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
series1.legendSettings.valueText = "{valueY}";
series1.visible  = false;

var series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueY = "germany";
series2.dataFields.categoryX = "year";
series2.name = 'Germany';
series2.bullets.push(new am4charts.CircleBullet());
series2.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
series2.legendSettings.valueText = "{valueY}";

var series3 = chart.series.push(new am4charts.LineSeries());
series3.dataFields.valueY = "uk";
series3.dataFields.categoryX = "year";
series3.name = 'United Kingdom';
series3.bullets.push(new am4charts.CircleBullet());
series3.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
series3.legendSettings.valueText = "{valueY}";

// Add chart cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "zoomY";


let hs1 = series1.segments.template.states.create("hover")
hs1.properties.strokeWidth = 5;
series1.segments.template.strokeWidth = 1;

let hs2 = series2.segments.template.states.create("hover")
hs2.properties.strokeWidth = 5;
series2.segments.template.strokeWidth = 1;

let hs3 = series3.segments.template.states.create("hover")
hs3.properties.strokeWidth = 5;
series3.segments.template.strokeWidth = 1;

// Add legend
chart.legend = new am4charts.Legend();
chart.legend.itemContainers.template.events.on("over", function(event){
  var segments = event.target.dataItem.dataContext.segments;
  segments.each(function(segment){
    segment.isHover = true;
  })
})

chart.legend.itemContainers.template.events.on("out", function(event){
  var segments = event.target.dataItem.dataContext.segments;
  segments.each(function(segment){
    segment.isHover = false;
  })
})

//Asset Allocation
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("assetAllocationDiv", am4charts.PieChart3D);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.data = [
  {
    country: "Lithuania",
    litres: 501.9
  },
  {
    country: "Czech Republic",
    litres: 301.9
  },
  {
    country: "Ireland",
    litres: 201.1
  },
  {
    country: "Germany",
    litres: 165.8
  },
  {
    country: "Australia",
    litres: 139.9
  },
  {
    country: "Austria",
    litres: 128.3
  }
];

chart.innerRadius = am4core.percent(40);
chart.depth = 120;

//chart.legend = new am4charts.Legend();

var series = chart.series.push(new am4charts.PieSeries3D());
series.dataFields.value = "litres";
series.dataFields.depthValue = "litres";
series.dataFields.category = "country";
series.slices.template.cornerRadius = 5;
series.colors.step = 3;

accountHistory();

function reDrawChart(divID) {
 let targetDiv = document.getElementById(divID);
console.log(targetDiv.scrollHeight)
 let currentHeight = targetDiv.style.height;
 targetDiv.style.height = "100%";
 if (divID == 'accountHistory') accountHistory();
}
