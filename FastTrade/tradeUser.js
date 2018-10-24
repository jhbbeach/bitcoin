/**
 * Created by yuyr on 2016/11/2.
 */
myapp.controller('TradeUserController', function ($scope,$rootScope) {
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    //表格列
    $scope.capital_account_columns = [
        {title:"序号"},
        {title:"内部资金账号"},
        {title:"经纪公司代码"},
        {title:"资金账号"},
        {title:"账户名称"},
        {title:"币种"},
        {title:"地区"},
        {title:"是否活跃"},
        {title:"操作员"},
        {title:"操作日期"},
        {title:"操作时间"},
        {title:"操作"}
    ];
    $scope.capitalAccountDataset = [
        [1,"001","95001","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [2,"002","95002","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [3,"003","95003","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [4,"004","95004","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [5,"005","95005","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [6,"006","95006","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [7,"006","95006","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [8,"006","95006","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [9,"006","95006","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [10,"006","95006","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [11,"006","95006","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [12,"007","95007","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [13,"008","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [14,"009","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [15,"002","95002","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [16,"003","95003","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [17,"004","95004","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [18,"005","95005","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [19,"006","95006","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [20,"007","95007","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [21,"008","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [22,"008","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [23,"008","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [24,"008","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [25,"008","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [26,"008","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [27,"009","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [28,"009","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [29,"009","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [30,"009","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [31,"009","95008","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"],
        [32,"010","95010","c001","投顾1","人民币","上海市","是","admin1","20161020","10：08","<a class='update-row' data-toggle='modal' data-target='#capitalAccount_myModal'>修改</a><a class='delete-row'>删除</a>"]
    ];
    //初始化页面记录
    $(document).ready(function(){
        $scope.capitalAccountTable = $("#trader_user_table").DataTable({
            data : $scope.capitalAccountDataset,
            columns :$scope.capital_account_columns,
            //scrollY: 400,
            //scrollX: true,
            dom: 'rt<"bottom"iplB>',
            buttons: [
                {
                    text: '导出',
                }
            ]
            //,
            //pagingType: "full_numbers",
            //language: {
            //    emptyTable: "没有符合条件的记录",
            //    info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
            //    infoEmpty: "显示 0 条到 0 条 共 0 条记录",
            //    lengthMenu: "显示 _MENU_ 条 记录",
            //    paginate: {
            //        "first":      "首页",
            //        "last":       "最后一页",
            //        "next":       "下一页",
            //        "previous":   "上一页"
            //    }
            //}
        });

        $("#fileuploader").uploadFile({
            url:"YOUR_FILE_UPLOAD_URL",
            fileName:"myfile"
        });
    });

    $("body").delegate("#trader_user_table td .update-row","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        $scope.capitalEntity.accountID = tempArr[1];
        $scope.capitalEntity.accountName = tempArr[4];
        $scope.capitalEntity.currency = tempArr[5];
        $scope.capitalEntity.region = tempArr[6];
        $scope.capitalEntity.isActive = tempArr[7];
        $scope.$apply();

    })
    $("body").delegate("#trader_user_table td .delete-row","click",function(){
        $scope.capitalAccountTable.row($(this).parents("tr")).remove().draw();
        for(var i=0;i<$scope.capitalAccountTable.context[0].aoData.length-1;i++){
            var index = $scope.capitalAccountTable.cell($($scope.capitalAccountTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
        //$scope.remove($scope.capitalAccountTable.row($(this).parents("tr")).data(),$scope.capitalAccountTable.row($(this).parents("tr")).data()[0]);
    })


    //重置表单验证信息
    function formValidateReset() {
        //$scope.myForm.brokerageFirmID.$setPristine();
        $scope.myForm.accountID.$setPristine();
        $scope.myForm.accountName.$setPristine();
    }

    //初始化页面参数
    $scope.initParameter = function () {
        //设置默认选中
        $scope.capitalEntity = {'isActive': $scope.modalSelects[1].key, 'currency': $scope.currenys[0].key, 'region':$scope.regionSelects[0].key};
        formValidateReset();
        $scope.isUpdate = false;
        $scope.isActive = false;
    };

    //输入框总信息
    $scope.inputContents = [
        "abce","adfjif","ajfirjhogfur","jkforugi","nvjihwsrufyr","sjhfirugyuryapkdc","njdfhbualk","hsl","ahdiu","ahfk","sd","bg","greeng","jui","yer"
    ];
    $scope.filterContents = [];
    //$scope.inputContent = "";
    //过滤输入框信息
    $scope.showFilterContent = function(){
        $("#filterInput")[0].style.display = "block";
    };


    $scope.addTradeUser = function(){
        var rDrag = {
            o:null,
            init:function(o){
                o.onmousedown = this.start;
            },
            start:function(e){
                var o;
                e = rDrag.fixEvent(e);
                e.preventDefault && e.preventDefault();
                rDrag.o = o = this;
                o.x = e.clientX - rDrag.o.offsetLeft;
                o.y = e.clientY - rDrag.o.offsetTop;
                document.onmousemove = rDrag.move;
                document.onmouseup = rDrag.end;
            },
            move:function(e){
                e = rDrag.fixEvent(e);
                var oLeft,oTop;
                oLeft = e.clientX -550 - rDrag.o.x;
                oTop = e.clientY -150 - rDrag.o.y;
                rDrag.o.style.left = oLeft + 'px';
                rDrag.o.style.top = oTop + 'px';
            },
            end:function(e){
                e = rDrag.fixEvent(e);
                rDrag.o = document.onmousemove = document.onmouseup = null;
            },
            fixEvent: function(e){
                if (!e) {
                    e = window.event;
                    e.target = e.srcElement;
                    e.layerX = e.offsetX;
                    e.layerY = e.offsetY;
                }
                return e;
            }
        };
        var obj = document.getElementById('hhh');
        rDrag.init(obj);
    };


    $("#myAccountID").autocomplete($scope.inputContents, {
        minChars: 0,
        width: 130,
        max:10,
        scrollHeight: 160,   //提示的高度，溢出显示滚动条
        matchContains: false,
        autoFill: true,
        selectFirst: true,
        formatItem: function(row, i, max) {
            return row[0];
        },
        formatResult: function(row, i, max) {
            return row[0];
        }
    });

});

