package main

import (
    "encoding/json"
    "log"
    "math/rand"
    "net/http"
    "time"
)

// 盤面のサイズ定義
const gridSize = 6

// ドットのカラー定義
var colors = []string{"red", "blue", "green", "yellow"}

// 盤面生成処理
func generateBoard() [][]string {
    rand.Seed(time.Now().UnixNano())
    // 1次元スライスをgridSize個もつ２次元スライスを作成
    board := make([][]string, gridSize)
    for i := range board {
        board[i] = make([]string, gridSize)
        for j := range board[i] {
            board[i][j] = colors[rand.Intn(len(colors))]
        }
    }
    log.Println(board)
    return board
}

func boardHandler(w http.ResponseWriter, r *http.Request) {
    board := generateBoard()
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(board)
}

func main() {
    fs := http.FileServer(http.Dir("./static"))
    http.Handle("/", fs)

    http.HandleFunc("/api/board", boardHandler)

    http.ListenAndServe(":8080", nil)
}
