package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/api/projects" {
		serveProjects(w, r)
		return
	}

	indexPath := filepath.Join("static", "index.html")
	if _, err := os.Stat(indexPath); err != nil {
		http.Error(w, "Portfolio page is unavailable", http.StatusInternalServerError)
		return
	}

	http.ServeFile(w, r, indexPath)
}

func serveProjects(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := os.ReadFile(filepath.Join("data", "projects.json"))
	if err != nil {
		http.Error(w, "Portfolio data is unavailable", http.StatusInternalServerError)
		return
	}
	if !json.Valid(data) {
		http.Error(w, "Portfolio data is invalid", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_, _ = w.Write(data)
}