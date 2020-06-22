const reducer_C1=(total,value) => total + ((value==1)?1:0);
const reducer_C2=(total,value) => total + ((value==2)?1:0);
const reducer_C3=(total,value) => total + ((value==3)?1:0);
const reduce_HLD=(total) => total + ((value==0)?1:0);
const arrayCopy=(arr) =>arr.slice(0);
const arrayColumn = (arr, n) => arr.map(x => x[n]);
const _dfSign=-1;  //Holidy 0:自排,-1:預設
var bsShift = {
    MyShift:[],
    clsChk:[], cntChk:[], hldCnt:[], arrHLD:[],arrWKD:[],
    setX:null, setY:null, setValue:null,
    dCnt:null, shiftMonth:null,
    //initial        
    initial:function(addMonth){
        if (addMonth==null){
            dd=Date.now();
        }else{
            dd=new Date(bsShift.shiftMonth.getFullYear(),bsShift.shiftMonth.getMonth()+1+addMonth,0)
        }
        this.iniMyShift(dd);
        this.showUI(0);
    },
    iniMyShift:function(dd){
        let d=new Date(dd);
        this.shiftMonth=new Date(d.getFullYear(),d.getMonth()+1,0);
        this.MyShift=new Array();
        this.dCnt=this.shiftMonth.getDate();
        for (let i = 0; i < Member.length; i++) {
            this.MyShift[i]=new Array(this.dCnt);
            for (let j = 0; j < this.dCnt; j++) {
                this.MyShift[i][j]=_dfSign;
            }
        }
        clsChk=this.MyShift[0].slice();
        arrHLD=this.MyShift[0].slice()
        arrWKD=this.MyShift[0].slice();
        cntChk=arrayColumn(this.MyShift, 0);
        hldCnt=arrayColumn(this.MyShift, 0);
        let myDate,YY,MM,wkDay,cssHD;
        YY=this.shiftMonth.getFullYear();
        MM=this.shiftMonth.getMonth()+1;
        for (let i = 0; i < clsChk.length; i++) {
            myDate=new Date(YY, MM-1, (i+1));
            wkDay=(myDate).getDay();
            arrWKD[i]=WeekDay[wkDay];
            arrHLD[i]=(OwHoliDay.some(e=>isEqualDate(e.d,myDate)))?((wkDay=="0" || wkDay=="6")?"":"其他"):(((wkDay=="0" || wkDay=="6")?"Holiday":""));
        }
    },
    setShiftValue:function(Mem,Day,Value){
        setX=Mem;
        setY=Day;
        setValue=Value;
        this.MyShift[Mem][Day]=Value;
    },
    genShift:function(){
        let retry=0;
        while (retry<30) {
            this.iniMyShift(this.shiftMonth);
            if (this.genMyShift()){
                return;
            }else{
                retry++;
                //console.log("retry:"+retry);
            }
        }
        this.log("需要人工處理" );
    },
    genMyShift:function(){
        let iShift,Cnt=Member.length;
        let Temp=[],TempReturn=[];
        for (let i = 0; i < this.dCnt; i++) {
            //1.檢核當日排班數量
            for(let k = 0; k < ShiftCnts.length; k++) {
                //2.檢核當日排班數班別是否已完成
                let iCnts=ShiftCnts[k];
                //Array暫存
                let arryCol=arrayColumn(this.MyShift, i);
                //查詢已排的班別
                switch (k) {
                    case 0: iCnts=iCnts-arryCol.reduce(reducer_C1,0);break;
                    case 1: iCnts=iCnts-arryCol.reduce(reducer_C2,0);break;
                    case 2: iCnts=iCnts-arryCol.reduce(reducer_C3,0);break;
                    default: break;
                }
                let ir=0,irBk=0;iStep=0;
                while (iCnts>0) {
                    ir++;
                    //1.找出排班人員
                    iShift=bsRandom.getRandom(Cnt)+1;    //0會造成tempCol誤判，index先+1，更新時再-1
                    if (ir==1){
                        if (iStep%=4){ TempReturn = Temp.map(arrayCopy); }  
                        Temp = this.MyShift.map(arrayCopy);
                    }
                    //2.判斷是否需要更新
                    if (this.checkShift(iShift,i,k+1)){
                        this.setShiftValue(iShift-1,i,k+1);
                        iStep++;
                        iCnts-=1;
                        ir=0;irBk=0;
                        //2.同班別連續數量(1~MaxShift-1) TODO
                        let iContCls=bsRandom.getMaxShiftRandom();
                        if(ir>100){
                            iContCls=1;
                        }
                        //this.log("連續數量"+iContCls);
                        for (let m = 1; m <= iContCls; m++){
                            if (i+m<this.dCnt){
                                if (this.checkShift(iShift,i+m,k+1)){
                                    this.setShiftValue(iShift-1,i+m,k+1);
                                }else{
                                    //this.log("連續數量xx => "+m + "iShift=" + iShift + "Day=" + (i+1));
                                    break;
                                }
                            }
                        }
                    }
                    if(ir>100){
                        //console.log("需要人工 step1");
                        this.MyShift = TempReturn.map(arrayCopy);   //退回到上一次的資料
                        irBk++;
                        if(irBk>100){
                            //超過人工退回100次，重新再來，不退回到上一次的資料
                            this.setShiftValue(iShift-1,i,k+1);
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },
    checkContinue:function(iMem,iDay){
        let arr=this.MyShift[iMem];
        let bbb=0;
        for (let i = 0; i < iDay; i++) {
            bbb=(arr[i]>0)?bbb+1:0;
        }
        return bbb;
    },
    checkShift:function(iMem,iDay,iCls){
        let iCnts=ShiftCnts[iCls-1];
        //該位置是否已有值
        let arryCol=arrayColumn(this.MyShift, iDay);
        let tempCol=arryCol.map((x,v) => (x==_dfSign)?_dfSign:v+1).filter(e => e!=_dfSign);
        if(tempCol.some((e=>e==iMem))==true){
            return false;
        }
        //是否已經連續休假MaxShift
        if(this.checkContinue(iMem-1,iDay)>=MaxShift){
            return false;
        }
        //該班別是否已經滿
        switch (iCls-1) {
            case 0: iCnts=iCnts-arryCol.reduce(reducer_C1,0);break;
            case 1: iCnts=iCnts-arryCol.reduce(reducer_C2,0);break;
            case 2: iCnts=iCnts-arryCol.reduce(reducer_C3,0);break;
            default: break;
        }
        if (iCnts==0){
            return false;
        }
        return true;
    },
    checkAllShift:function(){
        let row=0;
        this.MyShift.forEach(array => {
            for (let i = 0; i < array.length; i++) {
                if (array[i]<=0){
                    hldCnt[row]+=1;
                    cntChk[row]=0;
                }else{
                    cntChk[row]+=1;
                }
                if (row==0){
                    //檢查各班別數量
                   let arryCol=arrayColumn(this.MyShift, i);
                   clsChk[i]=arryCol.reduce(reducer_C1,0)+"-"+arryCol.reduce(reducer_C2,0)+"-"+arryCol.reduce(reducer_C3,0);
                }
            }
            row++;
        });
    },
    showUI:function(type){
        let cssHD="";
        let Head1="<div class='clsRow'>" + "<div class='clsHead' >"+this.shiftMonth.getFullYear()+" 年 "+(this.shiftMonth.getMonth()+1)+" 月"+"</div>";
        let Head2="<div class='clsRow'>" + "<div class='clsWeek' >姓名</div>";
        for (let i = 0; i < clsChk.length; i++) {
            cssHD=(arrHLD[i]=="")?"":" clsHoliday";
            Head1+="<div class='clsHead" + cssHD + "' id='H_" + (i+1) +"'>"+ (i+1) +"</div>";
            //Head2+="<div class='clsWeek" + cssHD + "' id='W_" + (i+1) +"'>"+ WeekDay[wkDay] +"</div>";
            Head2+="<div class='clsWeek" + cssHD + "' id='W_" + (i+1) +"'>"+ arrWKD[i] +"</div>";
        }
        Head1+="</div>";
        Head2+="</div>";
        let iRow=0;
        let Body="";
        this.MyShift.forEach(arrRow => {
            iRow++;
            Body+="<div class='clsRow'>";
            for (let i = 0; i <= arrRow.length; i++) {
                Body+="<div class='clsCol' id='M_" + iRow + "_" + i + "'></div>";
            }
            Body+="</div>";
        });
        document.getElementById("container").innerHTML=Head1+Head2+Body;
        //特殊日期
        let TailHoliDay="";
        OwHoliDay.forEach(element => {
            let d=new Date(element.d);
            TailHoliDay+= (d.getFullYear() == this.shiftMonth.getFullYear() && d.getMonth() == this.shiftMonth.getMonth())?"<div>*" + element.d + "：" + element.m+"</div>":""; 
        });
        document.getElementById("tail").innerHTML=TailHoliDay
        //顯示班表內容
        let vRow=0;
        this.MyShift.forEach(arrRow => {
           vRow++;
           Temp = arrRow.map(e=>{ return (e>=0)?ShiftCode[e]:(type==0)?"　":ShiftCode[0];});
           //console.log(Temp);
           document.getElementById("M_"+vRow+"_0").innerHTML=Member[vRow-1];
           let cell;
           for (let i = 0; i < Temp.length ; i++) {
                cell=document.getElementById("M_"+vRow+"_"+(i+1))
                cell.innerHTML=Temp[i];
                if (Temp[i]==ShiftCode[0]){
                    cell.classList.add("IsHLD");
                }
           }
        });
    },
    //4TEST
    show:function(){
        for (let i = 0; i < this.MyShift.length; i++) {
            this.log(Member[i]+ " => " + this.MyShift[i].join(' | '));
        }
    },
    showTemp:function(Temp){
        for (let i = 0; i < Temp.length; i++) {
            this.log(Member[i]+ " => " + Temp[i].join(' | '));
        }
    },
    log:function(msg){
        var canvas=document.getElementById("container");
        console.log(msg);
        canvas.innerHTML+=msg+"</br>";
    }
}
function isEqualDate(element,value) {
  let d=new Date(element);
  return (d.getDate() == value.getDate() && d.getFullYear() == value.getFullYear() && d.getMonth() == value.getMonth() );
}
var bsRandom = {
    items:[],
    itemsWeight:[],
    //亂數函數
    getRandom:function(x){
        return Math.floor(Math.random()*x);
    },
    ini:function(max){
        let cWt;
        for (let i = 0; i < max; i++) {
            this.items[i] = i+1;
            switch (i+1) {
                case 1: cWt=20;break;
                case 2: cWt=25;break;
                case 3: cWt=30;break;
                case 4: cWt=20;break;
                case 5: cWt=5;break;
                default: cWt=5;break;
            }
            this.itemsWeight[i]=cWt;
        }
    },
    //加權亂數函數
    getMaxShiftRandom:function()
    {
        if (this.items.length==0){
            this.ini(MaxShift);
        }
        var totalWeight=eval(this.itemsWeight.join("+"));
        var randomArray=[];
        for(var i=0; i<this.items.length; i++)
        {
            for(var j=0; j<this.itemsWeight[i]; j++)
            {
                randomArray.push(i);
            }
        }
        var randomNumber=Math.floor(Math.random()*totalWeight);
        return this.items[randomArray[randomNumber]];
    }

}