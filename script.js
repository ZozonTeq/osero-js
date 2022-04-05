function setup(){
    createCanvas(600,800) //幅600 高さ800でキャンバスを生成
    //noStroke(); //枠の消去
}
var stage = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,2,1,0,0,0,
    0,0,0,1,2,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,]
let isDebug = false;

// スコア変数
let player1_score = 0 ;
let player2_score = 0 ;
let turn = 1;//ターン

function draw(){
    background(0x22) // 描画をリセット。
    player1_score = player2_score = 0;
    for (let i =  0 ; i < stage.length ; i++){
        fill(0,0xAA,0);
        rect(20 + 70*(i % 8),20 + 70 * Math.floor(i/8) , 70,70);

        if(stage[i] == 0){

        }
        else if(stage[i]==1){
            fill(0);
            rect(23 + 70*(i % 8),23 + 70 * Math.floor(i/8) , 64,64,50);
            player1_score++;
        }
        else if(stage[i]==2){
            fill(0xff)
            rect(23 + 70*(i % 8),23 + 70 * Math.floor(i/8) , 64,64,50);
            player2_score++;
        }
        if(canPlace(i%8,Math.floor(i/8),turn)){
            fill(255,255,0);
            rect(23 + 70*(i % 8),23 + 70 * Math.floor(i/8) , 64,64,50);
        }
        if(isDebug){
            textSize(15);fill(0x22);text("X:"+i%8+" Y:"+Math.floor(i/8),23+35 + 70*(i % 8),23 + 35+70 * Math.floor(i/8) )
        }
    }//リバーシ描画とスコア計測
    fill(0xFF);textSize(32);textAlign(CENTER, CENTER);
    text("PLAYER1 : "+player1_score +"          PLAYER2 : "+player2_score,width /2 ,700);
    text("turn:"+turn+(turn == 1 ? "black" : "white "),width/2 , 730)

    //スコア描画
}

function mouseClicked(){
    let x = 0 ,  y = 0 ;
    x = Math.floor(mouseX);
    y = Math.floor(mouseY);
    if(x > width || y > 600){
        return;
    }//範囲外チェック


    let arrX = Math.floor((x-23)/70);
    let arrY = Math.floor((y-23)/70);
    console.log(x+","+y +"stage : "+getCell(arrX,arrY));//ずれてる要修正
    if(getCell(arrX,arrY) === undefined){
        return ;
    }
    replaceCell(arrX,arrY);
    turn = (turn == 1) ? 2 : 1;//次のプレイヤーにターンを渡す。
}
function getCell(x,y){
    return stage[y*8 + x];
}//xとyを渡すとそこの石を返す
function setCell(x,y,a){
    stage[y*8 + x ]= a;
}//x,y -> 座標    a -> 種類
function getCells(x,y,r){//r -> 1 ~ 8
    if(x > 8 || y > 8 || x < 0 || y <0){
        return undefined;
    }
    let arr = new Array();
    if(r==1){
        for(let i = 0 ; i <= y; i++){
            arr += getCell(x,y-i);
        }
    }//上
    else if(r==2){
        for(let i = 0 ; i <= (7-x < y ? 7-x:y);i++){
            arr += getCell(x+i , y-i);
        }
    }//右上
    else if(r==3){//右
        for(let i = 0 ; i <= 7-x;i++){
            arr += getCell(x+i,y);
        }
    }
    else if(r==4){
        for(let i = 0 ; i <= (7-x < 7-y ? 7-x : 7-y);i++){
            arr += getCell(x+i , y+i)
        }
    }//右下
    else if(r==5){
        for(let i = 0  ; i <= 7-y ; i ++){
            arr += getCell(x,y+i);
        }
    }//下
    else if(r == 6){
        for(let i = 0  ; i <= (x < 7-y ? x : 7-y);i++){
            arr += getCell(x-i , y+i);
        }
    }//左下
    else if(r == 7 ){
        for(let i = 0 ; i <= x ; i ++){
            arr += getCell(x-i,y);
        }
    }//左
    else if(r == 8){
        for(let i = 0;i <= (x < y ? x : y) ;i++){
            arr += getCell(x-i,y-i);
        }
    }//左上
    return arr;
}
function replaceCell(x,y){
    if(x > 8 || y > 8 || x < 0 || y <0){
        return;
    }
    if(canPlace(x,y,turn)){
        for_i :for(let i = 1  ; i <= 8 ; i ++){
            let res = false;
            let pnum = 0;
            let nres = false;//おけることが確定か？じゃないか？
            arr = getCells(x,y,i);
            if(arr.length > 3){
                if(arr[1]==(turn == 1 ? 2 : 1)){//二番目が敵の石か？
                    for_j : for(let j = 1 ; j < arr.length; j++){
                        if(!nres){
                            if(arr[j] == 0 ){
                                continue for_j;
                            }//２番目以降に何もないならおけない
                            if (arr[j] == (turn == 1 ? 2 : 1)){
                                res = true;
                            }//てきのやつか？
                            else if(arr[j] == turn){
                                res = true;
                                pnum = j;
                                nres = true;
                                console.log("checking"  +i);
                            }//自分のか
                        }

                    }
                }
            }
            if(nres){
                console.log(i);
                switch(i){
                    case 1:
                        for(let j = 0  ;  j < pnum;j++){
                            setCell(x,y-j,turn);
                        }//上
                        break;
                    case 2:
                        for(let j = 0 ;  j < pnum;j++){
                            setCell(x+j,y-j,turn);
                        }//右上
                        break;
                    case 3:
                        for(let j = 0  ;  j < pnum;j++){
                            setCell(x+j,y,turn);
                        }//右
                        break;
                    case 4:
                        for(let j = 0  ;  j < pnum;j++){
                            setCell(x+j,y+j,turn);
                        }//右下
                        break;
                    case 5:
                        for(let j = 0  ;  j < pnum;j++){
                            setCell(x,y+j,turn);
                        }//下
                        break;
                    case 6:
                        for(let j = 0  ;  j < pnum;j++){
                            setCell(x-j,y+j,turn);
                        }//左下
                        break;
                    case 7:
                        for(let j = 0  ;  j < pnum;j++){
                            setCell(x-j,y,turn);
                        }//左
                        break;
                    case 8:
                        for(let j = 0  ;  j < pnum;j++){
                            setCell(x-j,y-j,turn);
                        }//左上
                        break;
                }
                continue for_i;
            }  
        }
    }
}


function canPlace(x,y,t){
    if(x > 8 || y > 8 || x < 0 || y <0){
        return false;
    }
    let res  = false;
    let nres = false;
    for_i : for(let i = 1  ; i <= 8 ; i ++){
        arr = getCells(x,y,i);
        if(arr.length > 3){
            if(arr[0]!=0) return false;//すでに埋められてたらFalseを返す
            if(arr[1]==(t == 1 ? 2 : 1)){//二番目が敵の石か？
                for_j:for(let j = 2 ; j <= arr.length; j++){
                    if(arr[j] == 0 ){
                        res = false;
                        continue for_i;
                    }//何もないならおけない
                    if (arr[j] == (t == 1 ? 2 : 1)){
                        res = true;
                    }//てきのやつか？
                    else if(arr[j] == t){
                        res = true;
                        nres = true;
                        return true;
                    }
                }
            }
            else{
                continue for_i;//別の角度でトライ。
            }
        }
    }
    return nres;
}