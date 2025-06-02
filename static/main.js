let selectedDots = [];
let selectedColor = null;

// ドットの data-color 属性から色を取得
function getDotColor(dot) {
  return dot.dataset.color;
}

// ドットの中心座標を取得
function getDotCenter(dot) {
  const rect = dot.getBoundingClientRect();
  const parentRect = dot.parentElement.getBoundingClientRect();
  const x = rect.left - parentRect.left + rect.width / 2;
  const y = rect.top - parentRect.top + rect.height / 2;
  return [x, y];
}

// 選択可能かどうか判定（色が同じか）
function canSelectDot(dot) {
  const color = getDotColor(dot);
  return selectedDots.length === 0 || color === selectedColor;
}

// ドットを選択状態にする（色チェックあり）
function selectDot(dot) {
  const color = getDotColor(dot);
  if (selectedDots.includes(dot)) return;

  if (selectedDots.length === 0) {
    selectedColor = color;
  }

  selectedDots.push(dot);
  dot.classList.add("selected");
  drawLines();
}

// 線を描画
function drawLines() {
  const svg = document.getElementById("lines");
  svg.innerHTML = "";

  for (let i = 0; i < selectedDots.length - 1; i++) {
    const [x1, y1] = getDotCenter(selectedDots[i]);
    const [x2, y2] = getDotCenter(selectedDots[i + 1]);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "4");

    svg.appendChild(line);
  }
}

// 選択状態をリセット
function clearSelection() {
  selectedDots.forEach((dot) => dot.classList.remove("selected"));
  selectedDots = [];
  selectedColor = null;
}

// 初期化処理: ボード描画とイベント登録
fetch("/api/board")
  .then((res) => res.json())
  .then((board) => {
    const grid = document.getElementById("grid");

    board.forEach((row) => {
      row.forEach((cell) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.backgroundColor = cell;
        dot.dataset.color = cell;

        dot.addEventListener("click", () => {
          if (canSelectDot(dot)) {
            selectDot(dot);
          } else {
            console.log("Cannot select: different color");
          }
        });

        grid.appendChild(dot);
      });
    });
  });
