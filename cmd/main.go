package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
)

func main() {
	server := http.NewServeMux()
	server.HandleFunc("/assets/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			fmt.Println("here")
			// RespondWithError(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
		// if strings.HasSuffix(r.URL.Path, "/") {
		// 	RespondWithError(w, "Page Not Found", http.StatusNotFound)
		// 	return
		// }
		http.FileServer(http.Dir("./web")).ServeHTTP(w, r)
	})
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// if r.URL.Path != "/" {
		// 	// RespondWithError(w, "Page Not Found", http.StatusNotFound)
		// 	return
		// }
		html, err := os.ReadFile("./web/index.html")
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			// RespondWithError(w, "Internal Server Error3232", http.StatusNotFound)
			return
		}
		w.Write(html)
	})
	log.Fatalln(http.ListenAndServe(":8000", server))
}

func RespondWithError(w http.ResponseWriter, data string, status int) {
	tmpl, err := template.ParseFiles("./src/html/error.html")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Inernal Server Error"))
		return
	}
	w.WriteHeader(status)
	tmpl.Execute(w, data)
}
