var bsRandom = {
    //亂數函數
    getRandom:function(x){
        return Math.floor(Math.random()*x);
    },
    items:[],itemsWeight:[],
    //加權亂數函數-權重設定
    ini:function(max){
        let cWt;
        for (let i = 0; i < max; i++) {
            this.items[i] = i+1;
            if (i<data.MaxShift){
                switch (i+1) {
                    case 1: cWt=20;break;
                    case 2: cWt=40;break;
                    case 3: cWt=25;break;
                    case 4: cWt=5;break;
                    case 5: cWt=3;break;
                    default: cWt=3;break;
                }
            }else{
                cWt=0;
            }
            this.itemsWeight[i]=cWt;
        }
    },
    //加權亂數函數
    getMaxShiftRandom:function()
    {
        if (this.items.length==0){
            this.ini(data.MaxShift);
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
    },
    //Fisher-Yates Shuffle
    shuffle:function(array){
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}