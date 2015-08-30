/**
 * Created by zhaojing.
 * Date: 15-8-25
 * Time: 下午3:38
 */

!function(){
   /* 撞击区域 测试用 */
      var collisionArea =document.createElement("div");
      collisionArea.style.cssText="border:1px solid #111;position:absolute;left:"+
         DEFAULTS_CDE_L+"px;width:"+DEFAULTS_CDE_WIDTH+"px;height:"+DEFAULTS_WIN_HEIGHT+"px";
      DEFAULTS_WARP.appendChild(collisionArea);
   /* */
   /* board 区域 测试用 */
   var boardArea =document.createElement("div");
   console.log(DEFAULTS_WIN_WIDTH)
   console.log(DEFAULTS_WIN_WIDTH - DEFAULTS_BOARD_WIDTH)
   boardArea.style.cssText="border:1px solid #008;position:absolute;left:"+
      ( DEFAULTS_WIN_WIDTH - DEFAULTS_BOARD_WIDTH )/2 +"px;width:"+DEFAULTS_BOARD_WIDTH+"px;height:"+DEFAULTS_WIN_HEIGHT+"px";
      DEFAULTS_WARP.appendChild(boardArea);
   /* */

   //sockit 游戏开始
   birdsocket.gameStartFn = function(data) {
      // 实例化画板
      var board = new Board();

      // 实例化birds
      var bird1 = new Bird({
         domId:"J_bird",
         style:"left:"+(DEFAULTS_WIN_WIDTH - DEFAULTS_BIRD_W)/2+"px;background:#008000 url(http://fightingbird-jingz-p71.bj.oupeng.com/img/bird1.png) 0 0;background-size:24px 24px;"
      });
      var bird2 = new Bird({
         domId:"J_player",
         style:"left:100px;background:#008000 url(http://fightingbird-jingz-p71.bj.oupeng.com/img/bird.png) 50% 50%;background-size:24px 24px;"
      });

      board.setBirds(bird1);
      board.setBirds(bird2);

      //监听
      bird1.addObserver(birdsocket);

      // 实例化时光机
      var time1 = new TimeMachine(-1000);
      time1.bindEntry(bird2,99);

      // 实例化障碍物
      var obstacle = new Obstacle();

      //获取障碍物
      obstacle.getRandomArr(data.random);
      //obstacle.getObstacle = birdsocket.getObstacles;
      //birdsocket.setObstacleFn = obstacle.concatObstacleArray(data.obstacles);
      obstacle.init();

      // 碰撞检测器  障碍物
      var onDie = function() {
         if(!bird1.birdDie){
            bird1.die();
         }
      };

      var collisionDetection = new CollisionDetection();
      board.bindCollisionDetection(collisionDetection);
      collisionDetection.bindEntry(bird1);
      collisionDetection.bindEntry(obstacle);
      collisionDetection.bind("collision", onDie);

      // 碰撞检测器  天花板和地板
      var collisionDetection1 = new CollisionDetection();
      board.bindCollisionDetection(collisionDetection1);
      // 声明天花板和地板
      collisionDetection1.bindEntry({
         getClientRects:function(){
            return [{
               x:0,
               y:-100,
               X:DEFAULTS_WIN_WIDTH,
               Y:0
            }];
         }
      });
      collisionDetection1.bindEntry(bird1);
      collisionDetection1.bind("collision", onDie);

      // 碰撞检测器  天花板和地板
      var collisionDetection2 = new CollisionDetection();
      board.bindCollisionDetection(collisionDetection2);
      // 声明天花板和地板
      collisionDetection2.bindEntry({
         getClientRects:function(){
            return [{
               x:0,
               y:DEFAULTS_WIN_HEIGHT,
               X:DEFAULTS_WIN_WIDTH,
               Y:DEFAULTS_WIN_HEIGHT+100
            }];
         }
      });
      collisionDetection2.bindEntry(bird1);
      collisionDetection2.bind("collision", function() {
         bird1.paint = function() {};
         onDie();
      });

      // 画板 绑定元素
      board.bindEntry(bird1,99);
      board.bindEntry(time1,99);
      board.bindEntry(obstacle,98);

      // 点击事件
      document.addEventListener(
         "ontouchstart" in document ? "touchstart" : "click", function(evt){
            var t=Date.now()-board.getStartTime();
            bird1.jump(t);
            console.log('gygygyugyugygyyyu',t);
            //bird2.jump(t);
            bird1.observers.forEach(function(observer) {
               observer.trigger("revolution", t);
            });
      }, true);

      // 接收数据
      birdsocket.getMessageFn = function(message) {
         console.log('getm' + message)
         switch(message.type) {
            case 'jump':
               console.log("get it");
               console.log('safasfasfasf',message.t);
               bird2.jump(message.t);
               break;
            case 'dead':
               console.log('对方屎了');
               break;
            case 'disconnect':
               //opt.gameOverFn();
               //socket.emit('disconnect');
               console.log('disconnect');
               break;
            default:
               console.log('场景');
         }
      }

      birdsocket.bind("revolution", function(t) {
          birdsocket.sendMessage({ type: "jump", t: t });
      });

      //游戏开始
      board.animate.bind(board)();
   }

}();