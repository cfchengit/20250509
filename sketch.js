// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的座標
const circleSize = 100; // 圓的大小

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

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
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

        // 取得食指的座標 (keypoint 8)
        let indexFinger = hand.keypoints[8];

        // 如果食指碰觸到圓，讓圓跟隨食指移動
        if (dist(indexFinger.x, indexFinger.y, circleX, circleY) < circleSize / 2) {
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }
      }
    }
  }
}
