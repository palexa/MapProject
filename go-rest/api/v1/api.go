package v1

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"log"
	"github.com/go-chi/chi"
	_ "github.com/lib/pq"
)
const (
	host     = "nuolh.belstu.by"
	port     = 5432
	user     = "postgres"
	password = "Alexei98"
	dbname   = "postgres"
)
// ValidBearer is a hardcoded bearer token for demonstration purposes.
const ValidBearer = "123456"

// HelloResponse is the JSON representation for a customized message
type HelloResponse struct {
	Message string `json:"message"`
}
func addToDb() {
	//connStr := "user=postgres password=Alexei98 dbname=postgres sslmode=disable"
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	result, err := db.Exec("INSERT INTO Users (FirstName, LastName, Email, Type) VALUES ($1, $2, $3, $4)",
		"admin", "admin", "default", 0)
	if err != nil{
		panic(err)
	}
	//fmt.Println(result.LastInsertId())  // не поддерживается
	fmt.Println(result.RowsAffected())  // количество добавленных строк
}
func jsonResponse(w http.ResponseWriter, data interface{}, c int) {
	dj, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(c)
	fmt.Fprintf(w, "%s", dj)
}

// HelloWorld returns a basic "Hello World!" message
func HelloWorld(w http.ResponseWriter, r *http.Request) {
	response := HelloResponse{
		Message: "Hello world!",
	}
	jsonResponse(w, response, http.StatusOK)
}

// HelloName returns a personalized JSON message
func HelloName(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "name")
	//if name == "add" {
	//	addToDb()
	//}
	response := HelloResponse{
		Message: fmt.Sprintf("Hello %s!", name),
	}
	jsonResponse(w, response, http.StatusOK)
}

// RequireAuthentication is an example middleware handler that checks for a
// hardcoded bearer token. This can be used to verify session cookies, JWTs
// and more.
func RequireAuthentication(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Make sure an Authorization header was provided
		token := r.Header.Get("Authorization")
		if token == "" {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
		token = strings.TrimPrefix(token, "Bearer ")
		// This is where token validation would be done. For this boilerplate,
		// we just check and make sure the token matches a hardcoded string
		if token != ValidBearer {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
		// Assuming that passed, we can execute the authenticated handler
		next.ServeHTTP(w, r)
	})
}

// NewRouter returns an HTTP handler that implements the routes for the API
func NewRouter() http.Handler {
	r := chi.NewRouter()

	//r.Use(RequireAuthentication)

	// Register the API routes
	r.Get("/", HelloWorld)
	r.Get("/{name}", HelloName)

	return r
}