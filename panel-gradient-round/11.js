//外界需要传入的参数包括：盒子的Id和配置项
function AssetsHealthIndex (config){
    this.init(config)    
}
AssetsHealthIndex.prototype={
    //分为五级：谨慎，轻度谨慎，进取，轻度进去，稳健
    //当value为0即无数据时，特殊处理，显示‘存入资金可查看诊断结果’
    baseWidth:400,//canvas所在盒子的宽，也是canvas的宽
    baseHeight:400,//canvas所在盒子的高，也是canvas的高
    getOriginPosition:function(){
        this.originPosition=[this.baseWidth/2,this.baseHeight/2]
        this.circle_gradient['position']=this.originPosition
        this.circle_background['position']=this.originPosition
        this.circle_progress['position']=this.originPosition
        this.text.description.forEach(
            item=>{
                item.position=this.originPosition
                let fontSize=28*this.myRem
                item.font=`${fontSize}px Microsoft JhengHei`
            }
        )
        this.text.title[0].position=[this.baseWidth/2,this.baseHeight/2+36*this.myRem]
        this.text.title[0].font=`${22*this.myRem}px  simsun`
        this.text.title[1].position=[this.baseWidth/2,this.baseHeight*(1/2-1/38)]
        this.text.title[1].font=`${40*this.myRem}px  simsun`
        this.circle_base={...this.circle_gradient,...this.circle_base}
    },

    setBaseRadius:function(config){
        let radius=this.baseHeight>this.baseWidth?this.baseWidth*1/2:this.baseHeight*1/2
        let {circleRadius=this.circleRadius}=config
        radius=circleRadius*radius
        //设置circle_gradient的半径
        this.circle_gradient.radius=radius
        // this.circle_gradient.lineWidth=30*this.myRem
        this.circle_gradient.lineWidth=this.circle_gradient.radius/5
       //设置circle_base 的半径
       this.circle_base.radius=radius
    //    this.circle_base.lineWidth=29*this.myRem
       this.circle_base.lineWidth=this.circle_gradient.radius/5-1
       //设置circle_background的半径
       this.circle_background.radius=0.6*radius
       //设置circle_progress的半径
       this.circle_progress.radius=0.49*radius
       //设置小圆点半径
       this.points.radius=this.circle_gradient.lineWidth/5
    },
    originPosition:[200,200],
    circleRadius:1,//整体调整图形的大小，值为0到1
    value:5,
    myRem:0,
    boxId:'',//外部盒子的id
    //最外层圆环的配置
    circle_gradient:{
        startAngle:Math.PI*11/16,//开始角度
        endAngle:Math.PI*37/16,//结束角度
        lineWidth:21,//圆环的粗细程度
        isRound:true,//是否设置圆角
        radius:158,//圆环的半径
        position:[200,200]//圆点的位置
    },
    //外层圆环底层配置
    circle_base:{
        lineWidth:20,
        color:'rgb(30,48,65)'
    },
    //背景圆配置
    circle_background:{
        position:[200,200],
        color:'rgb(37,45,67)',
        radius:95
        // radius:65
    },
    //小圆点的配置
    points:{
        radius:6
    },
    //内层圆环的配置
    circle_progress:{
        // color:'#42e1d5',
        lineWidth:5,//圆环的粗细程度
        radius:78,
        position:[200,200]
    },
    //文本配置,格式为数组
    text:{
       description: [
            {
                font: "28px Microsoft JhengHei",
                color:"#449c25",
                content:'谨慎型',
                position:[200,200],
                textAlign:'center'
            },
            {
                font: "28px Microsoft JhengHei",
                color:"#92c700",
                content:'轻度谨慎',
                position:[200,200],
                textAlign:'center'
            },
            {
                font: "28px Microsoft JhengHei",
                color:"#fbc900",
                content:'稳进型',
                position:[200,200],
                textAlign:'center'
            },
            {
                font: "28px Microsoft JhengHei",
                color:"#fc9100",
                content:'轻度进取',
                position:[200,200],
                textAlign:'center'
            },
            {
                font: "28px Microsoft JhengHei",
                color:"#fa4b00",
                content:'进取型',
                position:[200,200],
                textAlign:'center'
            }
        ],
        
        title:[
            {
                font:"22px  simsun",
                color:"rgba(255,255,255,0.5)",
                content:"诊断结果",
                position:[200,220],
                textAlign:'center'
            },
            {
                font:"40px simsun",
                color:"rgb(79,197,255)",
                content:['存入资金','可查看诊断结果'],
                position:[200,220],
                textAlign:'center'
            }
        ]
    },
    constructor:AssetsHealthIndex,
    //初始化canvas
    init:function(config){

        let {boxId=this.boxId}=config
        let canvas=document.createElement('canvas')
        let box=document.getElementById(boxId)
        canvas.width=box.offsetWidth
        // console.log(box.offsetHeight)
        // console.log(box.offsetWidth)
        this.myRem=box.offsetWidth/584
        canvas.height=box.offsetHeight
        this.baseWidth=Number(box.offsetWidth) 
        this.baseHeight=Number(box.offsetHeight) 
        // console.log(this.baseHeight,this.baseWidth)
        //该函数设置了圆环的圆心的默认值为box的中心
        //位置，当config参数中包含设置圆环的圆心参数时，以
        //config中的参数为准，否则以默认值即box的中心位置为准
        this.getOriginPosition()
        this.setBaseRadius(config)

        let {
            value=this.value,
            baseWidth=this.baseWidth,//所有位置信息以baseWidth为基准
            baseHeight=this.baseHeight,
            circle_gradient=this.circle_gradient,
            circle_progress=this.circle_progress,
            points=this.points,
            text=this.text,
            circle_base=this.circle_base,
            circle_background=this.circle_background
        }=config

        
      
        let ctx=canvas.getContext('2d')
        //设置背景图
        let img=new Image()
        img.src='./color.png'//上线时，此处应改为dataURL
        let createPat=()=>{
            // img.onload=()=>{
            let bg=ctx.createPattern(img,'no-repeat')
            if(value==0){//如果value为0，则将背景图改为底层圆环的背景色
                bg=circle_base['color']
            }

            this.draw_circle_base(circle_base,ctx)
            this.draw_circle_gradient(circle_gradient,ctx,bg,value)
            this.drawPoint(points,ctx,value,bg)

            this.draw_circle_background(circle_background,ctx)
            this.draw_circle_progress(circle_progress,ctx,value)
            this.draw_text(text,ctx,value)
        }
        img.onload=createPat

        box.appendChild(canvas)
    },
    //绘制最外层圆环的底层
    draw_circle_base:function(config,ctx){
        let{
            startAngle,
            endAngle,
            lineWidth,
            radius,
            position,
            color
        }=config
        ctx.beginPath()
        ctx.arc(position[0],position[1],radius,startAngle,endAngle,false)
        ctx.lineCap='round'
        ctx.lineWidth=lineWidth
        ctx.strokeStyle=color
        ctx.stroke()
    },

    //绘制最外层圆环---如果value为0，则不进行绘制
    draw_circle_gradient:function(config,ctx,bg,value){
            let {
                startAngle,
                endAngle,
                lineWidth,
                isRound,
                radius,
                position
            }=config

            let end=startAngle+(endAngle-startAngle)/5*value
            ctx.beginPath()
            ctx.arc(position[0], position[1], radius,startAngle , end, false);
            ctx.lineCap=isRound==true?'round':'butt'
            ctx.lineWidth=lineWidth
            ctx.strokeStyle=bg
            ctx.stroke()

    },
    //绘制内部背景圆形
    draw_circle_background:function(config,ctx){
        let {
            position,
            radius,
            color
        }=config
        ctx.beginPath()
        ctx.arc(position[0],position[1],radius,0,Math.PI*2,false)
        ctx.fillStyle=color
        ctx.fill()
    },
    //绘制内层圆环
    draw_circle_progress:function(config,ctx,value){
        
        let {
            // startAngle,
            // endAngle,
            lineWidth,
            radius,
            position
        }=config

        var start=0;
        var end=1;
        var opci=value*23;//控制透明度,20为100除以5（value共五级）,设为23是为了渐变更平滑一些
        var thick=200;//控制进度条的密度
        
        let flag=value==0?100:value*44/2
        for(var i=0;i<flag;i++){//100为一圈，正常应为value*20,设为22是为效果上稍微超出一点
            ctx.beginPath()
            ctx.arc(position[0],position[1],radius,Math.PI*(1/2+2*start/thick), Math.PI*(1/2+2*end/thick),false)
            if(value!=5){
                opci--//逐渐变淡
            }
            var styleString=value==0?'rgb(41,50,75)':`rgba(66,225,213,${opci/(value*20)})`
            ctx.strokeStyle=styleString
            ctx.lineCap='butt'
            ctx.lineWidth=lineWidth
            ctx.stroke()
            start=start+2
            end=start+1
        }
        
    },
    //绘制文本
    draw_text:function(config,ctx,value){
        let{
            description,
            title
        }=config
        if(value==0){
            ctx.textAlign='center'
            for(let i=0;i<title[1].content.length;i++){
                ctx.font=title[1].font
                ctx.fillStyle=title[1].color
                ctx.fillText(title[1].content[i],title[1].position[0],title[1].position[1]+i*49*this.myRem)
            }
            return
        }
        let current=description[value-1]
        console.log(current)
        //设置中间文本
        ctx.textAlign='center'
        ctx.font=current.font
        ctx.fillStyle=current.color
        ctx.fillText(current.content,current.position[0],current.position[1])
        //设置下方文本
        ctx.font=title[0].font
        ctx.fillStyle=title[0].color
        ctx.fillText(title[0].content,title[0].position[0],title[0].position[1])
    },

    //绘制小圆点
    drawPoint:function(config,ctx,value,bg){
        //以盒子中心为基准点绘制小圆点
        let [originX,originY]=this.originPosition
        let r=this.circle_background.radius
        // let myRem=this.myRem
        let myRem=this.circle_background.radius/140
        console.log('下面时半径')
        console.log(this.circle_background.radius)

        console.log(originX,originY,r,myRem)
        let {radius}=config
        let pointsPosition=[
            {x:originX-r+3*myRem,y:originY+r-20*myRem},//第一个
            {x:originX-r-13*myRem,y:originY-r+45*myRem},//第二个
            {x:originX,y:originY-r-34*myRem},//第三个
            {x:originX+r+13*myRem,y:originY-r+45*myRem    },//第四个
            {x:originX+r-3*myRem,y:originY+r-20*myRem}//第五个
        ]
        function drawpoints(ctx,point,bg,radius){
            ctx.beginPath()
            ctx.arc(point.x,point.y,radius,0,Math.PI*2,false)
            ctx.fillStyle=bg
            ctx.lineWidth=5
            // ctx.stroke()
            ctx.fill()
        }
        if(value==0){
            value=5
        }
        for(let i=0;i<value;i++){
            drawpoints(ctx,pointsPosition[i],bg,radius)
        }
    }
    

}
