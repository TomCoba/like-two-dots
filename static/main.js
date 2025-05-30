const selectedDots = [];

function getDotCenter(dot) {
  const rect = dot.getBoundingClientRect();
  const parentRect = dot.parentElement.getBoundingClientRect();
  const x = rect.left - parentRect.left + rect.width / 2;
  const y = rect.top - parentRect.top + rect.height / 2;
  return [x, y];
}

function drawLines() {
  const svg = document.getElementById('lines');
  svg.innerHTML = '';

  for (let i = 0; i < selectedDots.length - 1; i++) {
    const [x1, y1] = selectedDots[i];
    const [x2, y2] = selectedDots[i + 1];

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

fetch('/api/board')
  .then(res => res.json())
  .then(board => {
    const grid = document.getElementById('grid');

    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.backgroundColor = cell;

        dot.addEventListener('click', () => {
          const coord = getDotCenter(dot);

          if (dot.classList.contains('selected')) {
            dot.classList.remove('selected');
            selectedDots.splice(selectedDots.findIndex(c => c[0] === coord[0] && c[1] === coord[1]), 1);
          } else {
            dot.classList.add('selected');
            selectedDots.push(coord);
          }

          drawLines();
        });

        grid.appendChild(dot);
      });
    });
  });
