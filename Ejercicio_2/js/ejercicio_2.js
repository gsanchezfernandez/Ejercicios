/************************/
/* Ejercicio2           */
/* Gonzalo Sanchez      */
/************************/

// Constants
const url1 = "http://s3.amazonaws.com/logtrust-static/test/test/data1.json";
const url2 = "http://s3.amazonaws.com/logtrust-static/test/test/data2.json";
const url3 = "http://s3.amazonaws.com/logtrust-static/test/test/data3.json";
const msecDay = 24 * 60 * 60 *1000;

//Variable
var accum = 0.0;
var initDate = Date.UTC(2100, 0, 1);
var endDate = Date.UTC(2000, 0, 1);

accumbycat = new Map();
accumbycatdate = new Map();

function getSerie(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if(this.status == 200){
                var result = JSON.parse(this.responseText);
                callback(result);
            }
            else
                console.log("Error loading page");
        };
    }; 
    xmlhttp.send();
}

function processSerie1(result) {
    for(var i = 0; i < result.length; i++) {
        mapEvent(1, result[i].cat, result[i].d, result[i].value);
    }
}

function processSerie2(result) {
    for(var i = 0; i < result.length; i++) {
        mapEvent(2, result[i].categ, Date.parse(result[i].myDate), result[i].val);
    }
}

function processSerie3(result) {
    
    for(var i = 0; i < result.length; i++) {
        var regexDate = /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|[3][01])/
        mapEvent(3, (result[i].raw.split('#'))[1], Date.parse(regexDate.exec(result[i].raw)[0]), result[i].val);
    }
    createCharts(); 
}

function mapEvent(id, category, time, value) {
    
    category = category.toUpperCase();
    // Line chart
    datevalue = accumbycatdate.get(category);
    if(datevalue == null) {
        datevalue = new Map();
        accumbycatdate.set(category, datevalue);
    }
    
    var val = datevalue.get(time);
    if(val == null) {
        val = 0.0;
    }
    datevalue.set(time, value + val);
    
    // Start Date
    if(initDate > time) {
        initDate = time;
    }
    if(endDate < time) {
        endDate = time;
    }

    // Pie chart
    accum += value;
    var ammount = accumbycat.get(category);
    if(ammount == null) {
        ammount = 0.0;
    }
    accumbycat.set(category, value + ammount);  
}

function createCharts() {
    
    // Creating Line Chart
    var lineData = [];  

    for(let [key, value] of accumbycatdate.entries()) {
        var values = []; 
        for(var time = initDate; time <= endDate; time += msecDay) {
            var entry = value.get(time);
            if(entry == null) {
                entry = 0.0;
            }
            values.push(entry);
        }
        lineData.push({ name: key, data: values });
    }
    Highcharts.chart('container1', {
        title: {
            text: 'Line Chart'
        },
		    subtitle: {
            text: 'Valores de las categorías por fecha'
        },
		    yAxis: {
            title: {
                text: 'Valores'
            }
        },
		    legend: {
          layout:'vertical',
          align:'right',
          verticalAlign:'middle'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e. %b'
            }
       },
		    legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
		    },
		    plotOptions: {
                series: {
                    label: {
                    connectorAllowed: false
                    },
                    pointStart: initDate,
                    pointInterval: msecDay 
            }
        },
        series:lineData,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 600
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
    
    
   // Creating PieChart 
   var pieData = [];  
    
    for(let [key, value] of accumbycat.entries()) {
        pieData.push({ name: key, y: (value / accum) * 100 });
    };

    Highcharts.chart('container2', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Porcentajes'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Porcentajes',
            colorByPoint: true,
            data: pieData
        }]
    });
}


/*****************/
/* Main function */
/*****************/
function main() {
    // Starting process
    getSerie(url1, processSerie1);
    getSerie(url2, processSerie2);
    getSerie(url3, processSerie3);
    
}

main();
