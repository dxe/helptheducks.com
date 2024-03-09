package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/dxe/helptheducks.com/service/config"
	"github.com/dxe/helptheducks.com/service/model"
	"net/http"
	"net/mail"
)

type CreateMessageInput struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone,omitempty"`
	OutsideUS bool   `json:"outside_us"`
	Zip       string `json:"zip,omitempty"`
	City      string `json:"city,omitempty"`
	Message   string `json:"message"`
	Token     string `json:"token"`
	Campaign  string `json:"campaign,omitempty"`
}

func createMessageHandler(w http.ResponseWriter, r *http.Request) {
	var body CreateMessageInput

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, fmt.Sprintf("error parsing request body: %v", err), http.StatusBadRequest)
		return
	}

	if config.RecaptchaSecret == "" {
		fmt.Println("Recaptcha secret not set, skipping verification")
	} else {
		ok, err := verifyRecaptcha(body.Token)
		if err != nil {
			fmt.Printf("error verifying recaptcha: %v\n", err)
			http.Error(w, "error verifying recaptcha", http.StatusInternalServerError)
			return
		}
		if !ok {
			http.Error(w, "invalid captcha", http.StatusForbidden)
			return
		}
	}

	_, err = mail.ParseAddress(body.Email)
	if err != nil {
		http.Error(w, fmt.Sprintf("invalid email address: %v", err), http.StatusBadRequest)
		return
	}

	if len(body.Name) == 0 {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}

	message := model.Message{
		Name:  body.Name,
		Email: body.Email,
		Phone: sql.NullString{
			String: body.Phone,
			Valid:  body.Phone != "",
		},
		OutsideUS: body.OutsideUS,
		Zip: sql.NullString{
			String: body.Zip,
			Valid:  body.Zip != "",
		},
		City: sql.NullString{
			String: body.City,
			Valid:  body.City != "",
		},
		Message: body.Message,
		IPAddress: sql.NullString{
			String: r.RemoteAddr,
			Valid:  r.RemoteAddr != "",
		},
		Campaign: sql.NullString{
			String: body.Campaign,
			Valid:  body.Campaign != "",
		},
	}

	err = model.InsertMessage(db, message)
	if err != nil {
		http.Error(w, fmt.Sprintf("error saving message: %v", err), http.StatusInternalServerError)
		return
	}

	w.Write([]byte("ok"))
}
