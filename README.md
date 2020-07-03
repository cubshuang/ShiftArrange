# ShiftArrange 排班小工具

**排班小工具** 是一個以Html+JavaScript+CSS寫成的簡易排班表產生工具

## 設定內容
#### 【參數設定檔 bsData.js】
* Member：排班人員
* ShiftCode：排班之班別，該文字顯示於頁面，其中休假需放置於第一的位置。
> 如：["假","白","小","大"]
* ShiftName：排班之班別名稱，該文字顯示於手動排班之按鈕，名稱與ShiftCode對應。
> 如：["放假","白班","小夜","大夜"]
* ShiftCnts：對應於ＳhiftCode班別每日需要之值班人員數兩。
> 如：[4,2,2]代表白班需4人，小夜班需2人，大夜班需2人。
* MaxShift：每個排班人員最多可連續排班的天數。
> 如：預設值5，則於自動排班時判斷不超過連續6天。
* OwHoliDay：非六日之假日及六日之上班日等特殊日期，
> 如：補上班日。陣列內特殊日期物件d:日期，m:特殊日期說明

## Demo
* [ShiftArrange 排班小工具](https://cubshuang.github.io/ShiftArrange/)


