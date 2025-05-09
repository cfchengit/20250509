// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的座標
const circleSize = 100; // 圓的大小
let isDragging = false; // 是否正在拖動圓
let trails = []; // 所有軌跡資料

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480); // 產生一個畫布，640*480
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // 初始化圓的位置在視窗中央
  circleX = width / 2;
  circleY = height / 2;
}

function draw() {
  image(video, 0, 0);

  // 畫出圓
  fill(255, 0, 0, 150); // 半透明紅色
  noStroke();
  circle(circleX, circleY, circleSize);

  // 畫出所有軌跡
  for (let trail of trails) {
    for (let i = 1; i < trail.length; i++) {
      stroke(trail[i].color);
      strokeWeight(10); // 設定線條粗細為 10
      line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
    }
  }

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 取得食指與大拇指的座標
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];

        // 檢查食指與大拇指是否同時碰觸圓的邊緣
        let indexDist = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let thumbDist = dist(thumb.x, thumb.y, circleX, circleY);

        if (indexDist < circleSize / 2 && thumbDist < circleSize / 2) {
          // 設定為拖動狀態
          isDragging = true;

          // 根據左右手設定軌跡顏色
          let trailColor = hand.handedness === "Left" ? "green" : "red";

          // 更新圓的位置為兩點的中點
          circleX = (indexFinger.x + thumb.x) / 2;
          circleY = (indexFinger.y + thumb.y) / 2;

          // 如果正在拖動，將當前軌跡點加入 trails
          if (trails.length === 0 || !isDragging) {
            trails.push([]);
          }
          trails[trails.length - 1].push({ x: circleX, y: circleY, color: trailColor });
        } else {
          isDragging = false;
        }

        // 畫出手指的圓點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255); // 左手為紫色
          } else {
            fill(255, 255, 0); // 右手為黃色
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 畫出手指的線條
        let ranges = [
          [0, 4],
          [5, 8],
          [9, 12],
          [13, 16],
          [17, 20],
        ];

        for (let [start, end] of ranges) {
          for (let i = start; i < end; i++) {
            let kp1 = hand.keypoints[i];
            let kp2 = hand.keypoints[i + 1];
            stroke(0, 255, 0); // 綠色線條
            strokeWeight(2);
            line(kp1.x, kp1.y, kp2.x, kp2.y);
          }
        }
      }
    }
  }
}
