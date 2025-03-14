package main

import (
	"fmt"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/dxe/service/config"
	"github.com/dxe/service/mailer"
	"github.com/dxe/service/model"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"

	"golang.org/x/text/runes"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

var (
	r          *chi.Mux
	db         *sqlx.DB
	mailClient *ses.SES
)

func main() {
	r = chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "https://helptheducks.com", "https://helpthechickens.com", "https://righttorescue.com"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers.
	}))

	db = getDb()
	defer db.Close()

	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	r.Route("/message", func(r chi.Router) {
		r.Post("/create", createMessageHandler)
	})

	r.Get("/tally", getTallyHandler)

	go worker()

	fmt.Printf("Listening on port %v\n", config.Port)
	http.ListenAndServe(":"+config.Port, r)
}

func worker() {
	var err error
	mailClient, err = mailer.CreateClient()
	if err != nil {
		fmt.Printf("Could not create mail client: %v\n", err)
		return
	}
	for {
		processNewMessages()
		time.Sleep(60 * time.Second)
	}
}

func processNewMessages() {
	messages, err := model.GetMessagesToProcess(db)
	if err != nil {
		fmt.Printf("Error getting messages to process: %v\n", err)
		return
	}

	var success, fail []int

	for _, message := range messages {
		fmt.Printf("Processing message id: %v\n", message.ID)

		settings, ok := config.EmailSettings[message.Campaign.String]
		if !ok {
			settings = config.EmailSettings["test"]
		}

		normalizedName, err := removeAccents(message.Name)
		if err != nil {
			fmt.Printf("Error normalizing name: %v\n", err)
			fail = append(fail, message.ID)
			continue
		}
		fromEmail := strings.Join(strings.Split(strings.ToLower(strings.Trim(normalizedName, " ")), " "), ".") + "@" + settings.FromDomain
		err = mailer.Send(mailClient, mailer.SendOptions{
			From:    fmt.Sprintf("%s <%s>", message.Name, fromEmail),
			ReplyTo: message.Email,
			To:      settings.To,
			Subject: settings.Subject,
			Body:    message.Message,
		})
		if err != nil {
			fmt.Printf("Error sending email: %v", err)
			fail = append(fail, message.ID)
		} else {
			success = append(success, message.ID)
		}
	}

	err = model.UpdateMessageStatus(db, success, "SENT")
	if err != nil {
		fmt.Printf("Error updating message status: %v\n", err)
	}

	err = model.UpdateMessageStatus(db, fail, "FAILED")
	if err != nil {
		fmt.Printf("Error updating message status: %v\n", err)
	}
}

func removeAccents(s string) (string, error) {
	t := transform.Chain(norm.NFD, runes.Remove(runes.In(unicode.Mn)), norm.NFC)
	output, _, err := transform.String(t, s)
	if err != nil {
		return "", err
	}
	return output, nil
}
