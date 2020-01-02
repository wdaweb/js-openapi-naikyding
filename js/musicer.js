var nowMusicName;
var ID;
var player;

// + - btn event -----------------------------------
$('.volHeightBtn').click(volHeight);
$('.volLowBtn').click(volLow);
$('.volHeightBtn').mouseleave(function(){
    $(this).html(`<i class="fas fa-plus"></i>`);
});
$('.volLowBtn').mouseleave(function(){
    $(this).html(`<i class="fas fa-minus"></i>`);
});
function volHeight(){
    let nowVol = player.getVolume();
    if(nowVol > 99){
        Swal.fire({
            title: '音量已達上限',
            text: '很抱歉! 目前音量已經到達上限，請嘗試調整設備音量 ^^',
        })
        clearInterval(ID);          
    }else{
        nowVol++;
        player.setVolume(nowVol);
        $(this).text(`目前音量: ${nowVol} %`)
    }
}
function volLow(){
    let nowVol = player.getVolume();
    if(nowVol < 1){
        Swal.fire({
            title: '音量已達下限',
            text: '很抱歉! 目前音量已經到達下限，請嘗試調整設備音量 ^^',
        })          
    }else{
        nowVol--;
        player.setVolume(nowVol);
        $(this).text(`目前音量: ${nowVol} %`)
    }
}

// youtube API -------------------------------------
// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
    height: '390',
    width: '640',
    // videoId: 'M7lc1UVf-VE',
    events: {
        'onReady': onPlayerReady,
        'onError': youtubeError
    }
});
}
//The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}
// youtube api if error do ----------------------
function youtubeError(e){
    if(e.data == 150){
        Swal.fire({
            icon: 'error',
            title: '權限問題...',
            text: '很抱歉! 這個影片沒有開放外部播放權限哦 ^^',
        })
        nowMusicName = '';
        $('marquee').text(nowMusicName);
        $('.zoom_btn').removeAttr('data-toggle');
        $('.zoom_btn').removeAttr('data-target');
    }
}

// loading icon event ------------------------------
$('.loading').toggle();

// playmusic Btn event -----------------------------
$('.playMusic_btn').click(playMusic);
function playMusic(){
    if(player.getVideoUrl().substr(32)!=$(this).val()){
        player.loadVideoById($(this).val());
        console.log($(this).parent('div'))
        nowMusicName = $(this).parent('div').text();
        $('marquee').text(nowMusicName);
        $('.zoom_btn').attr('data-toggle',"modal")
        $('.zoom_btn').attr('data-target', "#playerBox")
    }
}

// Popular AJAX ----------------------------------------------start
getStyleList();
function getStyleList(){
    $('.loading').toggle();
    let contents = '';
    let url = 'https://www.googleapis.com/youtube/v3/search'
                    //apiKey
                    +'&part=snippet'
                    +`&q=pop+hits+2019` //searchText
                    +`&type=video` //video  playlist channel
                    +'&maxResults=10'; //list.length
    $.getJSON(url,function(e){
        let data = e;
        for(let i=0;i<6;i++){
            contents += `
                        <div class="styleItem text-white " >
                                <img  src=${data.items[i].snippet.thumbnails.medium.url}>
                            <div class=" txt title_div  w-100 p-3 h-100 d-flex justify-content-center align-items-center" value="${data.items[i].snippet.title}">
                                <button type="button" class="btn text-white playMusic_btn" data-toggle="modal" data-target="#playerBox" value="${data.items[i].id.videoId}">
                                </button>
                                <h4 class="text-center">${data.items[i].snippet.title}</h4>                        
                            </div>
                        </div>
                        `;
        }
        $('.loading').toggle();
        $('.style_list').html(contents);

    // sticker --------------------------------
    $('.style_list').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 1200,  //斷點
                settings: {
                    arrows: true,  //是否出現箭頭
                    centerMode: true,
                    centerPadding: '120px',
                    slidesToShow: 2 //顯示幾個
                }
            },
            {
            breakpoint: 990,
                settings: {
                    arrows: true,
                    centerMode: true,
                    centerPadding: '11px',
                    slidesToShow: 2
                }
            },
            {
            breakpoint: 770,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '80px',
                    slidesToShow: 1
                }
            },
            {
            breakpoint: 530,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '70px',
                    slidesToShow: 1
                }
            },
            {
            breakpoint: 490,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '5px',
                    slidesToShow: 1
                }
            }
        ]
    });

    // Popular area EF ------------------------------
        $('.styleItem').mouseenter(function(){
            $(this).children('img').css("filter","blur(2px) grayscale(80%)");
            
        })
        $('.styleItem').mouseleave(function(){
            $(this).children('img').css("filter","blur(0) grayscale(0)");
        })
        // $('.styleItem').click(function(){
        //     console.log($(this).attr('value'));
        //     // if(player.getVideoUrl().substr(32)!=$(this).val()){
        //         player.loadVideoById($(this).attr('value'));
        //     // }
        // });
        $('.playMusic_btn').click(playMusic);

    }).fail(function(){    // if AJAX fail
        console.log(`getStyleList result fail !! `);
    })
}
// Popular AJAX ---------------------------------------------end



// search function --------------------------------------
$('form').on('submit',function(e){
    e.preventDefault();
    ajax_youTube();
});
$('#search_btn').click(ajax_youTube);

// AJAX search FUNCTION -------------------------------start
function ajax_youTube(){
    if($('input[name="keyword"]').val()!=''){
        $('.loading').toggle();
        let searchText = $('input[name="keyword"]').val();
        let contents = '';
        let url = 'https://www.googleapis.com/youtube/v3/search'
                    //apiKey
                    +'&part=snippet'
                    +`&q=${searchText}` //searchText
                    +`&type=video` //video  playlist channel
                    +'&maxResults=30'; //list.length
        $.getJSON(url,function(e){
            let data = e;
            for(let i=0;i<data.items.length;i++){
                contents += `
                            <div class="col mb-4 ">
                                <div class="card h-100">
                                    <img src="${data.items[i].snippet.thumbnails.high.url}" class="card-img-top" alt="...">
                                    <button type="button" class="btn text-white playMusic_btn" data-toggle="modal" data-target="#playerBox" value="${data.items[i].id.videoId}">
                                        <i class="fas fa-play-circle"></i>
                                    </button>
                                    <div class="card-body ">
                                        <h5 class="card-title">${data.items[i].snippet.title}</h5>
                                        <p class="card-text ">${data.items[i].snippet.description}</p>
                                    </div>
                                </div>
                            </div>
                            `;
                            // <button type="button" class="btn text-white playMusic_btn" data-toggle="modal" data-target="#playerBox" value="${data.items[i].id.videoId}"><i class="far text-warning fa-2x fa-play-circle"></i></button>
            }
            $('.loading').toggle();
            $('.search_list').html(`
                                    <h2 class="text-white py-2 videoArea">Video</h2>
                                    <div class="row row-cols-1 row-cols-md-3  row-cols-lg-4  ">${contents}</div>`);
            $('.playMusic_btn').click(playMusic);
            $('.playMusic_btn').mouseenter(function(){
                $(this).siblings('img').css('filter','brightness(0.5)');
            });
            $('.playMusic_btn').mouseleave(function(){
                $(this).siblings('img').css('filter','brightness(100%)');
            });
            /// IF fail do //
        }).fail(function(){
            alert(`RESULT FAIL!!!`);
        })
    }
}
// AJAX FUNCTION /--------------------------end
