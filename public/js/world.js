google.charts.load('current', {
    'packages':['geochart'],
    'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
  });

let socket = io();
// カメラがある国のリスト
let countries=[]
// マップ用配列
let codes = [['Country', 'Name']];
//マップの情報のリクエスト
socket.emit("codes",1);
//情報が帰ってきたらマップを描画
socket.on("codes",(c)=>{
    for (let key in c){
        countries.push(key);
        codes.push([key,c[key].length+"箇所のライブカメラを見る"])
    }
    // 国がクリックされたら、国名コードをGETパラメータにして動画ページへ送る
    google.charts.setOnLoadCallback(drawRegionsMap);
})
//国がクリックされたときの関数
function selectHandler(reg) {
    if (countries.includes(reg.region)) {
        sessionStorage.setItem("country",reg.region);
        socket.emit("country",reg.region);       
        location.href='livecam.ejs';
    }
}

function drawRegionsMap() {
    // 国名コードと国の表示名の配列をここで読み込む。
    
    const data = google.visualization.arrayToDataTable(codes);
    const options = {
        defaultColor:'#3cb371',
    };
    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    google.visualization.events.addListener(chart, 'regionClick', selectHandler);
    chart.draw(data, options);
}






  
