package user

import (
	"database/sql"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"net/http"
)
type Test struct {
	Login string `json:"login"`
	Password string `json:"password"`
}

func (p *Test) Bind(r *http.Request) error {
	// At this point, Decode is already done by `chi`
	p.Login = p.Login + " after decode"
	return nil
}

func autentificateUser(w http.ResponseWriter, r *http.Request) {
	var p Test
	err := render.DecodeJSON(r.Body, &p)
	if err!=nil {
		panic(err)
	}
	fmt.Println(p.Login)
	//name := chi.URLParam(r, "loh")
	//name := r.Context().Value("user")
	//fmt.Println(name)
	fmt.Println("post have been sended!")
}
func addUser(w http.ResponseWriter, r *http.Request) {
	connStr := "user=postgres password=Alexei98 dbname=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	var p Test
	error := render.DecodeJSON(r.Body, &p)
	if error!=nil {
		panic(error)
	}
	fmt.Println(p.Login)
	result, err := db.Exec("INSERT INTO Users (FirstName, LastName, Email, Type) VALUES ($1, $2, $3, $4)",
		p.Login, p.Password, "default", 0)
	if err != nil{
		panic(err)
	}
	//fmt.Println(result.LastInsertId())  // не поддерживается
	fmt.Println(result.RowsAffected())  // количество добавленных строк
}
func NewRouter() http.Handler {
	r := chi.NewRouter()

	//r.Use(RequireAuthentication)

	// Register the API routes
	r.Post("/", autentificateUser)
	r.Post("/add", addUser)

	return r
}
