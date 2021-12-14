/**
 * 进程调度算法   
 */
 var RP = 1;  //系统默认并发数为1
 var roundTime = 2;//时间片长度
 var taskArr = []; //任务列表
 var RRArr = [];//RR算法队列
 var roundOver = 0;//是否RR算法中有一轮时间片结束
 var RR = 0;//是否是RR算法
 var RRTaskFinished = 0;//是否RR算法中有一个任务完成
 var processSwitch = 1;//是否切换进程
 var current_time = 0; //当前时间
 var interval; //时间间隔0.5s
 var $runLog;; //调度过程日志
 /**
  * 任务列表 数据结构
  * name 名称
  * arrive_time 到达时间
  * run_time 预计运行时间
  * CPUTime 已运行时间
  * priority 优先数
  * state 任务状态{ ready(就绪), run(运行), finish(完成)}
  */
 function getData() { //获取进程的数据
 	taskArr = [];
 	var name, arrive_time, run_time,priority; 
 	$('#table').find('tr').each(function(i){
         name = $(this).find('input[name=name]').val();//获取进程名
         arrive_time = $(this).find('input[name=arrive_time]').val() * 1;//获取进程到达时间
         run_time = $(this).find('input[name=run_time]').val() * 1;//获取需要运行时间
         priority = $(this).find('input[name=priority]').val() * 1;//获取优先数
         var taskObj = {
             index: i,
             name: name,
             arrive_time: arrive_time,
             run_time: run_time,
             CPUtime: 0,
             priority: priority,
             state: 'notArrived'
         };
         taskArr.push(taskObj);//放入任务列表
     });
 }


 /**
  * 遍历各种状态的作业进程
  */
  function findState(arr){
    var ready = [], run = [], NA = [];//三个状态列表
    var obj = {};
    $(arr).each(function(){
       if(this.state == 'ready'){
           ready.push(this);//就绪进程放入就绪队列
       }else if(this.state == 'run'){
           run.push(this);//运行进程放入运行队列
       }else if(this.state == 'notArrived'){
           NA.push(this);//未到达进程放入未到达队列
       }
    });
    obj.ready = ready;
    obj.run = run;
    obj.NA = NA;
    return obj;
}


 

/**
 * 按照到达时间排序
 * 
 */
function sortByArrival(a,b){
    return a.arrive_time - b.arrive_time;
 }
 
 /**
  * SPF 排序 根据进程运行时间
  */
 function sortByRunTime(a,b){
     return a.run_time - b.run_time;
 }
 /**
  * HRRN 排序 按优先级降序排序   优先级 = (作业已等待时间 + 作业的服务时间) / 作业的服务时间
  */
 function sortByLevel(a,b){
     return ((current_time - b.arrive_time + b.run_time) / b.run_time) - ((current_time - a.arrive_time + a.run_time) / a.run_time);
 }

 /**
  * PP 排序   根据优先级
  */
 function sortByPriority(a,b){
    return a.priority - b.priority;
 }

/**
 * SPF   非抢占
 */
function SPF(){
    var obj = findState(taskArr);
    //就绪进程按照到达时间排序
    var running = obj['run'];
    var order = obj['ready'].sort(sortByRunTime);
    //console.log(running.length);
    if(running.length>0){
        //取运行中的进程
        currentTask = running.shift();
        taskArr[currentTask.index].CPUtime++;
    }
    else{
        //取出就绪队列的第一个进程
        firstReady = order.shift();
        taskArr[firstReady.index].state = 'run';
        taskArr[firstReady.index].start_run_time = current_time;
        //从就绪列表中移除,显示在运行列表 run_group
        sleep(500).then(()=>{
            $('[name=task_' + firstReady.index +']').remove();
            $('#run_group').append(
                "<li class='list-group-item' name='task_" + firstReady.index +"'>"
                + current_time + "时刻&emsp;" + firstReady.name + "</li>"
            );

        });
    }
}


/**
 * HRRN 非抢占
 */
 function HRRN(){
    var obj = findState(taskArr);
    //就绪进程按照到达时间排序
    var running = obj['run'];
    var order = obj['ready'].sort(sortByLevel);
    if(running.length>0){
        currentTask = running.shift()
        taskArr[currentTask.index].CPUtime++;
    }
    else{
        firstReady = order.shift();
        taskArr[firstReady.index].state = 'run';
        taskArr[firstReady.index].start_run_time = current_time;
        console.log('starting '+taskArr[firstReady.index].name);
        //从就绪列表中移除,显示在运行列表 run_group
        sleep(500).then(()=>{
            $('[name=task_' + firstReady.index +']').remove();
            $('#run_group').append(
                "<li class='list-group-item' name='task_"+ firstReady.index +"'>"
                + current_time + "时刻&emsp;" + firstReady.name + "</li>"
            );

        });
    }
}



/**
 * 优先级非抢占
 */
function PP(){
    var obj = findState(taskArr);
    //就绪进程按照到达时间排序
    var running = obj['run'];
    var order = obj['ready'].sort(sortByPriority);
    //console.log(running.length);
    if(running.length>0){
        currentTask = running.shift()
        taskArr[currentTask.index].CPUtime++;
    }
    else{
        firstReady = order.shift();
        taskArr[firstReady.index].state = 'run';
        taskArr[firstReady.index].start_run_time = current_time;
        //从就绪列表中移除,显示在运行列表 run_group
        sleep(500).then(()=>{
            $('[name=task_' + firstReady.index +']').remove();
            $('#run_group').append(
                "<li class='list-group-item' name='task_" + firstReady.index +"'>"
                + current_time + "时刻&emsp;" + firstReady.name + "</li>"
            );

        });
    }
}






/**
 * Process_FCFS
 */
 function Process_FCFS(){
    var obj = findState(taskArr);
    var running = obj['run'];
    var order = obj['ready'].sort(sortByArrival);//就绪进程按照到达时间排序
    if(running.length>0){
        currentTask = running.shift()
        taskArr[currentTask.index].CPUtime++;//运行中的进程改变CPU时间
    }
    else{
        firstReady = order.shift();//就绪队列第一个进程放入运行队列
        taskArr[firstReady.index].state = 'run';
        taskArr[firstReady.index].start_run_time = current_time;//开始运行时间
        //从就绪列表中移除,显示在运行列表 run_group
        sleep(500).then(()=>{
            $('[name=task_' + firstReady.index +']').remove();
            $('#run_group').append(
                "<li class='list-group-item' name='task_" + firstReady.index +"'>"
                + current_time + "时刻&emsp;" + firstReady.name + "</li>"
            );

        });
    }
}

/**
 * Process_RR
 */
function Process_RR(){
    if(RRArr.length>0){//仍有任务未完成
        if(current_time==0){//若算法刚刚开始运行
            taskArr[RRArr[0].index].start_run_time = 0;//设置开始运行时间
            taskArr[RRArr[0].index].state = 'run';//改变进程状态
            //从就绪态移动到运行态
            sleep(200).then(()=>{
                $('[name=task_' + RRArr[0].index +']').remove();
                $('#run_group').append(
                    "<li class='list-group-item' name='task_" + RRArr[0].index +"'>"
                    + current_time + "时刻&emsp;" + RRArr[0].name + "</li>"
                );
            });
            return;
        }

        if(roundOver){//若一轮时间片结束了
            if(RRTaskFinished==0){//如果进程还未运行结束
                RRArr[0].state = 'ready';//状态回到就绪态
                taskArr[RRArr[0].index].state = 'ready';
                //从运行队列移动回就绪队列
                // console.log(RRArr[0].name+'moving back to ready');
                $('[name=task_' + RRArr[0].index +']').remove();
                $('#ready_group').append(
                    "<li class='list-group-item' name='task_" + RRArr[0].index +"'>"
                    + current_time + "时刻&emsp;" + RRArr[0].name + "</li>"
                );
                RRArr.push(RRArr.shift());//进程回到RR队列最后
            }
            
            // console.log(RRArr[0].name+'moving to run');
            //从就绪态移动到运行态
            sleep(250).then(()=>{
                $('[name=task_' + RRArr[0].index +']').remove();
                $('#run_group').append(
                    "<li class='list-group-item' name='task_" + RRArr[0].index +"'>"
                    + current_time + "时刻&emsp;" + RRArr[0].name + "</li>"
                );
            });
            //改变进程状态，修改CPU时间，输出信息
            RRArr[0].state = 'run';
            taskArr[RRArr[0].index].state = 'run';
            taskArr[RRArr[0].index].CPUtime++;
            
            //重置时间片结束和任务结束标识
            roundOver = 0;
            RRTaskFinished = 0;
            
        } else{//时间片还未结束
            if(taskArr[RRArr[0].index].state=='finish'){//进程结束了
                RRArr.shift();//进程出队列
            }
            //新进程开始运行
            taskArr[RRArr[0].index].CPUtime++;
            taskArr[RRArr[0].index].state = 'run';
            if(taskArr[RRArr[0].index].CPUtime%roundTime==0){//若该轮运行后时间片结束
                roundOver = 1;//时间片结束标识置1
                // console.log('round is over!');
            }
        }

    }
}



/**
 * 遍历所有作业都已完成
 * @return  boolean
 */
 function IfEnd(){
    var end = true;
    $(taskArr).each(function(i,val){
        if(val.state != 'finish'){//只要有一个进程不是结束状态调度就未完成
            end = false;
            return end;
        }
    });
    return end;
}
/**
 * 计算平均周转时间并加载显示
 * time :周转时间 
 * aver_time : total/num 平均周转时间
 */
function aver_time(){
    var total = 0, W_total = 0;
    var num = $(taskArr).length;
    $(taskArr).each(function(){
        //完成时间-到达时间 -->周转时间
        //周转时间/运行时间 -->带权周转时间
        var time = this.finish_time - this.arrive_time;
        var W_time = time/this.run_time;
        total += time;
        W_total += W_time;
        $('#result_table').append(//每个进程的周转时间和带权周转时间
            "<tr><td>" + this.name +
            "</td><td>" + this.arrive_time +
            // "</td><td>" + this.enter_time + 
            "</td><td>" + this.finish_time +
            "</td><td>" + time +
            "</td><td>" + W_time.toFixed(2) +
            "</td></tr>"
            );
        });
        $('#aver_time').html("平均周转时间：" + (total/num).toFixed(2) + "&emsp;&emsp;平均带权周转时间：" + (W_total/num).toFixed(2));
}

/**
 * 运行进程  非抢占
 */
function run(){
    var running  = findState(taskArr).run; //在运行的进程列表
    $(running).each(function(){
        //已经运行的时间==进程运行时间 -->完成
        if(this.CPUtime == this.run_time){
            // console.log('运行完了');
            // 记录结束时间，改变进程状态
            taskArr[this.index].finish_time = current_time;
            taskArr[this.index].state = 'finish';
            
            if(RR){//如果采用的是RR算法
                roundOver = 1;//设置时间片结束标识
                RRArr.shift();//进程出队列
                RRTaskFinished = 1;//RR算法中有一个任务完成
            }
            //切换进程标识置1
            processSwitch = 1;
            //从运行列表移除，显示在完成列表 finish_group
            $('[name=task_' + this.index + ']').remove();
            $('#finish_group').append(
                "<li class='list-group-item' name='task_" + this.index +"'>"
                + this.finish_time + "时刻&emsp;" + this.name
                + "</li>"
            );
            var PType = $('input[name=process]:checked').val();
            if(PType != "Process_RR"){//不是RR算法需要对当前时间同步
                current_time--;
            }
            dynamite_table_refresh(taskArr);
        }
    });
}
/**
 * sleep 调用Promise API改良setTimeout(),解决就绪->运行动态刷新过快
 * 用法: sleep(time).then(()=>{
 *    dosomething
 * });
 * @return 返回封装后的Promise的sleep()函数
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


/**
 * 时间片刷新
 */
function refresh(){
    // $runLog = $('#run_log');//更新显示日志
    PType = $('input[name=process]:checked').val();//获取算法类型
    $('#r_time').html(current_time);//更新当前时间
    var NA  = findState(taskArr).NA; //未到达的进程列表
    $(NA).each(function(){//查看NA表中是否有进程到达
        if(taskArr[this.index].arrive_time==current_time){
            //显示在就绪列表 ready_group
            taskArr[this.index].state = 'ready';
            $('#ready_group').append(
                "<li class='list-group-item' name='task_" + this.index +"'>"
                + current_time + "时刻&emsp;" + this.name
                + "---运行时间:" + this.run_time + "</li>"
            );
            RRArr.push(this);
        }
    });
    //显示当前算法并执行
    if(PType == "Process_FCFS"){
        $("#selector").html("算法选择：先来先服务 ");
        Process_FCFS();
    }else if(PType == "HRRN"){
        $("#selector").html("算法选择：高响应比优先 ");
        HRRN();
    }else if(PType == "SPF"){
        $("#selector").html("算法选择：最短进程优先 ");
        SPF();
    }else if(PType == "PP"){
        $("#selector").html("算法选择：最高优先数优先 ");
        PP();
    }else if(PType == "Process_RR"){
        $("#selector").html("算法选择：时间片轮转 ");
        RR = 1;
        Process_RR();
    }

    //更新甘特图
    if(RR){
        if(current_time>0) gantRefresh();
        if(processSwitch)
            processSwitch = 0;
    }else{
        if(!processSwitch)
            gantRefresh();
        else
            processSwitch = 0;
    }
    dynamite_table_refresh(taskArr);//更新状态表
    run();//检查是否有进程结束
    current_time++;
    if(IfEnd()){//检查是否调度结束
        clearInterval(interval);
        $('#dynamite-table').html("");
        var content = " <tr> <td><input type='text' name='id' style='background-color:rgb(223, 223, 223)'></td> " +
            "<td><input type='text' name='name' style='background-color:rgb(223, 223, 223);'></td>" +
            "<td><input type='text' name='cputime' style='background-color:rgb(223, 223, 223);'></td>" +
            "<td><input type='text' name='needtime' style='background-color:rgb(223, 223, 223);'></td>" +
            " <td><input type='text' name='variety' style='background-color:rgb(223, 223, 223);'></td> </tr>";
        $('#dynamite-table').append(content);
        $('#pause_btn').text("暂停");
        aver_time();
    }
}


/**
 * 主函数
 */
 jQuery(function(){
    //开始按钮功能
    $('#start_btn').click(function(){
        document.getElementById("start_btn").setAttribute("disabled", true);//开始按钮失效
        if($('#pause_btn').text()=='继续'){//同步暂停/继续按钮状态
            interval = setInterval("refresh()",500);
            return
        }
        getData();//获取进程状态
        interval = setInterval("refresh()",500);
    });

    
   var flag = true;//暂停/继续按钮状态标识
    $('#pause_btn').click(function(){
        if(flag){
            $('#pause_btn').text("继续");
            clearInterval(interval);//暂停运行
            flag=false;
        }
        else{
            $('#pause_btn').text("暂停");
            interval = setInterval("refresh()",500);//继续运行
            flag=true;
        }

    });

   
    $('#reset_btn').click(function(){
        //RR算法变量重置
        RR = 0;
        RRArr = [];
        roundOver = 0;
        //重置任务列表
        taskArr = [];
        //重置时间
        current_time = 0;
        $('#r_time').html(current_time);
        document.getElementById("start_btn").removeAttribute("disabled");
        //停止运行
        clearInterval(interval);
        //甘特图重置
        processSwitch = 1;
        total_runtime = 0;
        workData = [blank];
        myCharts.clear();
        Gantt([], workData);

        $('#pause_btn').text("暂停");
        $('#run_log').html("");
        $('#show_ui').html(
            " <div class=\"col-md-3\" > <ul class=\"list-group\" id=\"ready_group\">" +
            " <li class=\"list-group-item text-center\" style=\"background-color:rgb(77, 204, 77)\"><b>就绪</b></li>  </ul>  </div>" +
            " <div class=\"col-md-3\"> <ul class=\"list-group\" id=\"run_group\">" +
            " <li class=\"list-group-item text-center\" style=\"background-color:rgb(77, 204, 77)\"><b>运行</b></li>  </ul> </div>" +
            " <div class=\"col-md-3\"><ul class=\"list-group\" id=\"finish_group\">" +
            " <li class=\"list-group-item text-center\" style=\"background-color:rgb(77, 204, 77)\"><b>完成</b></li>  </ul>  </div>"
            ); 
        $('#result_table').html("");
        $('#aver_time').html(" ");
        $('#runprocess_num').val("");

        $('#dynamite-table').html("");


    });
    $('#add_btn').click(function(){
        var content = " <tr> <td><input type='text' name='name' style='background-color:rgb(223, 223, 223)'></td> " +
        "<td><input type='text' name='arrive_time' style='background-color:rgb(223, 223, 223);'></td>" +
        " <td><input type='text' name='run_time' style='background-color:rgb(223, 223, 223);'></td> "+
        " <td><input type='text' name='priority' style='background-color:rgb(223, 223, 223);'></td> </tr>";
        $('#table').append(content);
    });
});

/**
 * 
 * 动态实时进程状态显示
 * 
 */


function dynamite_table_refresh(tasks){
    var PType = $('input[name=process]:checked').val();//获取算法类型
    $('#dynamite-table').html("");
    if(PType == 'Process_FCFS'){
        $('#table-head').html("	<tr><th>次序</th><th>进程名称</th><th>已运行时间</th><th>剩余需求时间</th><th>调度依据：到达时间</th></tr>");
        var sequence = tasks.slice(0);
        sequence = sequence.sort(sortByArrival);
        num = 1;
        var obj = findState(sequence)['run'][0];
        if(obj!=null){
            var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> " +
                "<td><input type='text' name='name' value='" + obj.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + obj.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (obj.run_time-obj.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + obj.arrive_time + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
            $('#dynamite-table').append(content);
        }
        
        $(sequence).each(function(i){
            if(this.state=='ready'){
                if(num==1){
                    var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> ";
                }else{
                    var content = " <tr> <td><input type='text' name='id' value='" + (num++) + "' style='background-color:rgb(223, 223, 223)'></td> ";
                }
                content += "<td><input type='text' name='name' value='" + this.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + this.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (this.run_time-this.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + this.arrive_time + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
                $('#dynamite-table').append(content);
            }
        });
    }else if(PType == "HRRN"){
        $('#table-head').html("	<tr><th>次序</th><th>进程名称</th><th>已运行时间</th><th>剩余需求时间</th><th>调度依据：响应比</th></tr>");
        var sequence = tasks.slice(0);
        sequence = sequence.sort(sortByLevel);
        num = 1;
        var obj = findState(sequence)['run'][0];
        if(obj!=null){
            var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> " +
                "<td><input type='text' name='name' value='" + obj.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + obj.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (obj.run_time-obj.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + ((current_time - obj.arrive_time + obj.run_time) / obj.run_time).toFixed(2) + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
            $('#dynamite-table').append(content);
        }
        $(sequence).each(function(i){
            if(this.state=='ready'){
                if(num==1){
                    var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> ";
                }else{
                    var content = " <tr> <td><input type='text' name='id' value='" + (num++) + "' style='background-color:rgb(223, 223, 223)'></td> ";
                }
                content += "<td><input type='text' name='name' value='" + this.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + this.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (this.run_time-this.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + ((current_time - this.arrive_time + this.run_time) / this.run_time).toFixed(2) + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
                $('#dynamite-table').append(content);
            }
        });
    }else if(PType == "SPF"){
        $('#table-head').html("	<tr><th>次序</th><th>进程名称</th><th>已运行时间</th><th>剩余需求时间</th><th>调度依据：预计运行时间</th></tr>");
        var sequence = tasks.slice(0);
        sequence = sequence.sort(sortByRunTime);
        num = 1;
        var obj = findState(sequence)['run'][0];
        if(obj!=null){
            var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> " +
                "<td><input type='text' name='name' value='" + obj.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + obj.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (obj.run_time-obj.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + obj.run_time + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
            $('#dynamite-table').append(content);
        }
        $(sequence).each(function(i){
            if(this.state=='ready'){
                if(num==1){
                    var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> ";
                }else{
                    var content = " <tr> <td><input type='text' name='id' value='" + (num++) + "' style='background-color:rgb(223, 223, 223)'></td> ";
                }
                content += "<td><input type='text' name='name' value='" + this.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + this.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (this.run_time-this.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + this.run_time + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
                $('#dynamite-table').append(content);
            }
        });
    }else if(PType == "PP"){
        $('#table-head').html("	<tr><th>次序</th><th>进程名称</th><th>已运行时间</th><th>剩余需求时间</th><th>调度依据：优先数</th></tr>");
        var sequence = tasks.slice(0);
        sequence = sequence.sort(sortByPriority);
        num = 1;
        var obj = findState(sequence)['run'][0];
        if(obj!=null){
            var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> " +
                "<td><input type='text' name='name' value='" + obj.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + obj.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (obj.run_time-obj.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + obj.priority + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
            $('#dynamite-table').append(content);
        }
        $(sequence).each(function(i){
            if(this.state=='ready'){
                if(num==1){
                    var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> ";
                }else{
                    var content = " <tr> <td><input type='text' name='id' value='" + (num++) + "' style='background-color:rgb(223, 223, 223)'></td> ";
                }
                content += "<td><input type='text' name='name' value='" + this.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='cputime' value='" + this.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
                "<td><input type='text' name='needtime' value='" + (this.run_time-this.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
                " <td><input type='text' name='variety' value='" + this.priority + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
                $('#dynamite-table').append(content);
            }
        });
    }else if(PType == "Process_RR"){
        $('#table-head').html("	<tr><th>次序</th><th>进程名称</th><th>已运行时间</th><th>剩余需求时间</th><th>调度依据：时间片</th></tr>");
        var num = 1;
        $(RRArr).each(function(){
            if(num==1){
                var content = " <tr> <td><input type='text' name='id' value='运行中 " + (num++) + "' style='background-color:rgb(101, 228, 129)'></td> ";
            }else{
                var content = " <tr> <td><input type='text' name='id' value='" + (num++) + "' style='background-color:rgb(223, 223, 223)'></td> ";
            }
            content += "<td><input type='text' name='name' value='" + this.name + "' style='background-color:rgb(223, 223, 223);'></td>" +
            "<td><input type='text' name='cputime' value='" + this.CPUtime + "' style='background-color:rgb(223, 223, 223);'></td>" +
            "<td><input type='text' name='needtime' value='" + (this.run_time-this.CPUtime) + "' style='background-color:rgb(223, 223, 223);'></td>" +
            " <td><input type='text' name='variety' value='" + this.name + "' style='background-color:rgb(223, 223, 223);'></td> </tr>";
            $('#dynamite-table').append(content);
        });
    }

}




/**
 * 甘特图
 */
var myCharts = echarts.init(document.getElementById('container'));
var workData = [];//图表数据列表
var max_runtime = 0;//总运行时长
var colors = ['skyblue','green','red','brown','yellow','BlueViolet','Brown','Blue','AntiqueWhite'];
$('#table').find('tr').each(function(i){//计算最长运行时间
    if($(this).find('input[name=run_time]').val() * 1>max_runtime)
        max_runtime = $(this).find('input[name=run_time]').val() * 1;
});
var pNames = [];//进程名信息
$('#table').find('tr').each(function(i){
    pNames.push($(this).find('input[name=name]').val());
});

blank ={//空图表信息
    name: ' ',
    type: "bar",
    stack: 0,
    itemStyle: {
        normal: {
            color: "white",
        }
    },
    zlevel: -1,
    z: 3,
    data: [100]
}
workData.push(blank);

Gantt([], workData);//绘制空图表


/**
 * 刷新甘特图
 */
function gantRefresh(){
    max_runtime = 0;
    $('#table').find('tr').each(function(i){//计算最长运行时间
        if($(this).find('input[name=run_time]').val() * 1>max_runtime)
            max_runtime = $(this).find('input[name=run_time]').val() * 1;
    });
    //更新x轴长度
    $(workData).each(function(i){//删除空bar
        if(this.name == ' '){
            workData.splice(i,1);
        }
    });
    blank ={
        name: ' ',
        type: "bar",
        stack: 0,
        itemStyle: {
            normal: {
                color: "white",
            }
        },
        zlevel: -1,
        z: 3,
        data: [100]
    }
    workData.push(blank);//创建新的空bar
    //找出正在运行的进程
    var running  = findState(taskArr).run;
    if(running.length==0)
        return
    running  = running.shift();
    //正在运行的进程更新到甘特图中
    strip ={
        name: running.name,
        type: "bar",
        stack: running.index+1,
        label: {
            normal: {
                show: true,
                color: "#000",
                position: "right",
                formatter: function(params) {
                    return params.seriesName
                }
            }
        },
        itemStyle: {
            normal: {
                color: colors[running.index],
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        zlevel: -1,
        data: [1/running.run_time * 100]
    }
    workData.push(strip);
    //绘制新的甘特图
    Gantt(pNames,workData);
}

/**
 * 绘制甘特图
 */

function Gantt(names,data){
    var option = {//设置图标选项
        backgroundColor: "#fff",
        title: {
            text: "进程调度甘特图",
            padding: 20,
            textStyle: {
                fontSize: 17,
                fontWeight: "bolder",
                color: "#333"
            },
            subtextStyle: {
                fontSize: 13,
                fontWeight: "bolder"
            }
        },
        legend: {
            data: names,
            align: "right",
            right: 80,
            top: 50
        },
        grid: {
            containLabel: true,
            show: false,
            right: 130,
            left: 40,
            bottom: 40,
            top: 90
        },
        xAxis: {
            type: "value",
            axisLabel: {
                "show": true,
                "interval": 0,
                "formatter": '{value}%'
            }
        },
        dataZoom: [{
            type: 'inside',
        }, {
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        yAxis: {
            axisLabel: {
                show: true,
                interval: 0,
                formatter: function(value, index) {
                    var last = ""
                    var max = 5;
                    var len = value.length;
                    var hang = Math.ceil(len / max);
                    if (hang > 1) {
                        for (var i = 0; i < hang; i++) {
                            var start = i * max;
                            var end = start + max;
                            var temp = value.substring(start, end) + "\n";
                            last += temp; //拼接最终的字符串
                        }
                        return last;
                    } else {
                        return value;
                    }
                }
            },
            data: ["运行进度"]
        },
        series: data
    }
    myCharts.setOption(option);//绘制图表
}