package handler

import (
	"net/http"
	"os"
	"path/filepath"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// Menangani routing untuk static files dan API
	path := r.URL.Path

	// Jika route diawali /data/, layankan dari folder data
	if len(path) >= 6 && path[:6] == "/data/" {
		http.ServeFile(w, r, filepath.Join(".", path))
		return
	}

	// Jika route diawali /image/ atau /static/, layankan dari folder static
	if (len(path) >= 7 && path[:7] == "/image/") || (len(path) >= 8 && path[:8] == "/static/") {
		http.ServeFile(w, r, filepath.Join("./static", path))
		return
	}

	// Default: Layankan static/index.html atau static file di dalamnya
	filePath := filepath.Join("./static", path)
	if info, err := os.Stat(filePath); err == nil && !info.IsDir() {
		http.ServeFile(w, r, filePath)
		return
	}

	// Fallback ke index.html
	http.ServeFile(w, r, "./static/index.html")
}