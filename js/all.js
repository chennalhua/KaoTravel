/*選擇器*/
const areaSelect = document.querySelector('#area');//行政區下拉選單
const hotList = document.querySelector('.hot-list');//熱門地區
const locationTitle = document.querySelector('.location-title');//地區標題
const locationList = document.querySelector('.location-list');//景點列表
const pageNav = document.querySelector('.pagination');//分頁
const goTop = document.querySelector('.gotop a');

//撈資料
let locationDataArry = [];
axios.get('https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json') 
    //請求成功就會執行該 function
  .then(function (response) {
    // console.log('資料回傳了');
    locationDataArry = response.data.result.records;
    init();
    selectOptionList();
    pagination(locationDataArry , 1); //分頁
});


//選染資料到網頁上
function init(){
    locationTitle.textContent = '全部';
    let str = '';
    locationDataArry.forEach(function(item){
        //景點列表內容
        let content = `<li class="mb-4 col-md-6">
            <div class="location-item h-100">
            <div class="item-header">
            <div class="img-box">
                <img src="${item.Picture1}" alt="${item.Name}">
            </div>
            <div class="item-header-info">
                <h4 class="location-name">${item.Name}</h4>
                <p class="m-0">${item.Zone}</p>
            </div>
         </div>
        <ul class="item-body px-3 list-unstyled">
            <li class="time"><i class="fas fa-clock text-purple"></i>${item.Opentime}</li>
            <li class="address"><i class="fas fa-map-marker-alt text-yellow"></i>${item.Add}</li>
            <li class="last-item">
                <div class="phone">
                    <i class="fas fa-mobile-alt text-blue"></i>
                    <a href="tel:+${item.Tel}">${item.Tel}</a>
                </div>
                <div class="tag text-warning">
                    <i class="fas fa-tag text-yellow"></i>
                    <span>${item.Ticketinfo}</span>
                </div>
            </li>
        </ul>
            </div>
        </li>`;
    str += content;
    })
    locationList.innerHTML = str;
}

//select 下拉選單列表
function selectOptionList(){
    let option = [];
    locationDataArry.forEach(function(item){
        let zone = item.Zone;
        option.push(zone);
    })
    
    /*過濾*/
    //將過濾資料放入 filterOption
    let filterOption = option.filter(function(item,index){
        return option.indexOf(item) === index;
    })
    let strOption = '<option value="請選擇行政區" disabled selected>--請選擇行政區--</option><option value="全部">全部</option>';
    filterOption.forEach(function(item){
        strOption += `<option value="${item}">${item}</option>`;
    })
    areaSelect.innerHTML = strOption;
}
selectOptionList();

//點擊下拉選單列表切換
function OptionChangeCardItem(e){
    let strFilter = '';
    locationDataArry.forEach(function(item){
        if(e.target.value == item.Zone){
            let content = `<li class="mb-4 col-md-6">
            <div class="location-item h-100">
            <div class="item-header">
            <div class="img-box">
                <img src="${item.Picture1}" alt="${item.Name}">
            </div>
            <div class="item-header-info">
                <h4 class="location-name">${item.Name}</h4>
                <p class="m-0">${item.Zone}</p>
            </div>
         </div>
        <ul class="item-body px-3 list-unstyled">
            <li class="time"><i class="fas fa-clock text-purple"></i>${item.Opentime}</li>
            <li class="address"><i class="fas fa-map-marker-alt text-yellow"></i>${item.Add}</li>
            <li class="last-item">
                <div class="phone">
                    <i class="fas fa-mobile-alt text-blue"></i>
                    <a href="tel:+${item.Tel}">${item.Tel}</a>
                </div>
                <div class="tag text-warning">
                    <i class="fas fa-tag text-yellow"></i>
                    <span>${item.Ticketinfo}</span>
                </div>
            </li>
        </ul>
            </div>
        </li>`;
            strFilter += content;
            locationList.innerHTML = strFilter;
            locationTitle.textContent = item.Zone;
        }else if((e.target.value == '全部')){
            init();
        }
    })

}

//熱門地區
function hotAreaCardItem(e){
    if(e.target.nodeName !== 'BUTTON'){
        return
    }else{
        OptionChangeCardItem(e);
    }
}

//頁數
// function pagination(locationDataArry , nowPage){
//     //取得資料長度
//     const dataTotal = locationDataArry.length;
//     //顯示在畫面上的資料數量，預設每一頁只顯示五筆資料。
//     const perPage = 6;

//     //page 數量公式：總資料數 / 每一顯示資料 (perPage)
//     //可能會出現餘數，要使用 無條件進位
//     const pageTotal = Math.ceil(dataTotal / perPage); //總頁數

//     /*當前頁數*/
//     //要避免「當前頁數」比「總頁數」還要多，假設今天「總頁數」是 3 筆，就不可能是 4 或 5 的情況，所以要寫入一個判斷避免這種狀況
//     let currentPage = nowPage; //當前頁面

//     //當「當前頁面」比「總頁數」大時，「當前頁面」就等於「總頁數」
//     if(currentPage > pageTotal){
//         currentPage = pageTotal;
//     }

//     /* 切換頁面時 */
//     //第一頁：1 ~ 6 ; 第二頁：7 ~ 12

//     //最小值公式：(當前頁面:2 * 預設資料數)- 預設資料數 + 1 此時會得到 6 這個數字，但是我們是第 7 筆開始，所以要在 +1
//     const minData = (currentPage * perPage) - perPage + 1;
//     //最大值公式：12
//     const maxData = (currentPage * perPage);

//     //建立新陣列
//     let newData = [];
//     locationDataArry.forEach(function(item , index){
//         let num = index + 1; //因為索引值是從 0 開始所以要加 1
//         //當 num 大於等於 minData 且 小於等於 maxData ，就 push 新陣列
//         if(num >= minData && num <= maxData){
//             newData.push(item);
//         }
//     })

//     //因為要將分頁相關資訊傳到另一個 function 做處理，所以將 page 相關所需要的東西改用物件傳遞。
//     const page = {
//         pageTotal,
//         currentPage,
//         hasPage:currentPage > 1,
//         hasNext:currentPage < pageTotal,
//     }
//     pageBtn(page);
// }

// function pageBtn(page){
//     let str= '';
//     let total = page.pageTotal;
//     let currentPage = page.currentPage;
//     if(page.hasPage){
//         str += `<li class="prev"><a href="#" data-page="${Number(page.currentPage) - 1}">Prev</a></li>`;
//     }
//     for(let i=1; i<=total; i++){
//         if(i == currentPage){
//             str += `<li><a href="#" class="active" data-page="${i}">${i}</a></li>`;
//         }
//         else if(Math.ceil(i/6) == Math.ceil(currentPage/6)){
//             str += `<li><a href="#" data-page="${i}">${i}</a></li>`;
//         }
//     }
//     if(page.hasNext){
//         str += `<li class="next"><a href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`;
//     }
//     pageNav.innerHTML = str;
// }

function switchPage(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A'){
        return;
    }
    let page = e.target.dataset.page;
    
}

goTop.addEventListener('click',function(e){
    e.preventDefault();
    window.scrollTo({
        top:0,
        behavior:'smooth',
    })
})

document.addEventListener('scroll',function(e){
    if(window.scrollY > 850){
        goTop.setAttribute('style','opacity: 1')
    }else{
        goTop.setAttribute('style','opacity: 0')
    }
})

areaSelect.addEventListener('change',OptionChangeCardItem);
hotList.addEventListener('click',hotAreaCardItem);
pageNav.addEventListener('click',switchPage);

