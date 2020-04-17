const weatherApi = 'https://www.metaweather.com/api/location/';
const weatherIcon = 'https://www.metaweather.com//static/img/weather/ico/';
const icon = '.ico';
const searchLocate = 'search/?query=';
var locateData = [];

var vue = new Vue({
  el: "#app",
  vuetify: new Vuetify({
  theme: { disable: true },
  }),
  data: {
    icon : '.ico',
    searchLocate: "",
    locateData: locateData,
    piChart: "",
    tempChartData: {
          columns: [],
          rows: []
      },
    tempChartSettings: {
        labelMap: {
          'max_temp': 'Max Temperature',
          'min_temp': 'Min Temperature'
        }
      },
    piChartSettings: {
      dimension: 'date',
      metrics: 'humidity'
      },
    piChartData: {
      columns: ['date', 'humidity'],
      rows: []
      },
      overlay: false
  },
  methods: {
    getLocateData : async function(){
      var text = this.searchLocate.trim();
      const vm = this;
      vm.overlay = true;
      let url = weatherApi + searchLocate + text;
      
      let responseData = await axios.get(`${url}`);
      vm.tempChartData.columns = [];
      
      if(responseData.data[0]){
        let currentWoeid =  responseData.data[0].woeid;
        url = weatherApi + currentWoeid;

        let forcastData = await axios.get(`${url}`);
        let consolidateWeather = forcastData.data.consolidated_weather;

        vm.tempChartData.columns.push('date');
        vm.tempChartData.columns.push('max_temp');
        vm.tempChartData.columns.push('min_temp');

        //add date format
        for(let objIndex = 0; objIndex < consolidateWeather.length; objIndex++){
          let curDate = new Date(consolidateWeather[objIndex]['applicable_date']);
          let curMonth = curDate.getMonth()+1;
          consolidateWeather[objIndex]['date'] = curMonth + '/' + curDate.getDate();
        }
        vm.locateData = consolidateWeather;
        vm.tempChartData.rows = consolidateWeather;
        vm.piChartData.rows = consolidateWeather;
      }else{
        vm.locateData = [];
        vm.tempChartData.rows = [];
        vm.piChartData.rows = [];
      }
      vm.overlay = false;
    },
    getImgUrl: function(obj) {
      if(obj !== undefined){       
        let picName = obj.weather_state_abbr;
        return weatherIcon + picName + '.ico';
      }
    }
  }
})

