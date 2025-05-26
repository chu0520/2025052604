let handpose;
let faceApi;
let video;
let handPredictions = [];
let facePredictions = [];
let gesture = "";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Initialize Handpose
  handpose = ml5.handpose(video, () => {
    console.log("Handpose model loaded!");
  });
  handpose.on("predict", (results) => {
    handPredictions = results;
  });

  // Initialize FaceApi
  const faceOptions = { withLandmarks: true, withDescriptors: false };
  faceApi = ml5.faceApi(video, faceOptions, () => {
    console.log("FaceApi model loaded!");
  });
  faceApi.on("predict", (results) => {
    facePredictions = results;
  });
}

function draw() {
  image(video, 0, 0, width, height);

  // Draw hand predictions
  if (handPredictions.length > 0) {
    const hand = handPredictions[0];
    const landmarks = hand.landmarks;

    // Detect gesture (Rock, Paper, Scissors)
    gesture = detectGesture(landmarks);
    fill(255, 0, 0);
    textSize(32);
    text(`Gesture: ${gesture}`, 10, 40);
  }

  // Draw face predictions
  if (facePredictions.length > 0) {
    const face = facePredictions[0];
    const landmarks = face.landmarks.positions;

    // Move circle based on gesture
    if (gesture === "Scissors") {
      drawCircle(landmarks[36]); // Left eye
    } else if (gesture === "Rock") {
      drawCircle(landmarks[45]); // Right eye
    } else if (gesture === "Paper") {
      drawCircle(landmarks[62]); // Mouth center
    }
  }
}

function detectGesture(landmarks) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];

  const distanceThumbIndex = dist(thumbTip[0], thumbTip[1], indexTip[0], indexTip[1]);
  const distanceIndexMiddle = dist(indexTip[0], indexTip[1], middleTip[0], middleTip[1]);

  if (distanceThumbIndex < 30 && distanceIndexMiddle < 30) {
    return "Rock";
  } else if (distanceThumbIndex > 50 && distanceIndexMiddle > 50) {
    return "Paper";
  } else {
    return "Scissors";
  }
}

function drawCircle(point) {
  fill(255, 0, 0);
  ellipse(point.x, point.y, 20);
}