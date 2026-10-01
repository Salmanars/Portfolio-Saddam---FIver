package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/projects", projectsHandler)
	mux.Handle("/", http.FileServer(http.Dir(".")))

	address := ":8080"
	log.Printf("Portfolio server listening on http://localhost%s", address)
	log.Fatal(http.ListenAndServe(address, mux))
}

func projectsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := os.ReadFile("data/projects.json")
	if err != nil {
		log.Printf("Unable to read portfolio data: %v", err)
		http.Error(w, "Portfolio data is unavailable", http.StatusInternalServerError)
		return
	}

	var payload json.RawMessage
	if err := json.Unmarshal(data, &payload); err != nil {
		log.Printf("Unable to decode portfolio data: %v", err)
		http.Error(w, "Portfolio data is invalid", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	if _, err := w.Write(payload); err != nil {
		log.Printf("Unable to write portfolio response: %v", err)
	}
}