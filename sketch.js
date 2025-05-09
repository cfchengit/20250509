// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

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
  createCanvas(640, 480); //產一個畫布，640*480
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Draw keypoints
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          // circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints in specified ranges
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
            stroke(0, 255, 0); // Green lines
            strokeWeight(10);
            line(kp1.x, kp1.y, kp2.x, kp2.y);
          }
        }
      }
    }
  }
}
