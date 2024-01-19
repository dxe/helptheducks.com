package model

import (
	"database/sql"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"
	"time"
)

type Message struct {
	ID          int            `db:"id"`
	SubmittedAt time.Time      `db:"submitted_at"`
	IPAddress   sql.NullString `db:"ip_address"`
	Name        string         `db:"name"`
	Email       string         `db:"email"`
	Phone       sql.NullString `db:"phone"`
	OutsideUS   bool           `db:"outside_us"`
	Zip         sql.NullString `db:"zip"`
	City        sql.NullString `db:"city"`
	Message     string         `db:"message"`
	Status      string         `db:"status"`
}

func InsertMessage(db *sqlx.DB, message Message) error {
	_, err := db.NamedExec(
		`INSERT INTO messages (
                      			ip_address,
                      			name,
                      			email,
                      			phone,
                      			outside_us,
                      			zip,
                      			city,
                      			message,
                      			status	
					  		) VALUES (
								:ip_address,
								:name,
								:email,
								:phone,
								:outside_us,
								:zip,
								:city,
								:message,
								'PENDING'
					  		)`,
		message,
	)
	return err
}

func GetMessagesToProcess(db *sqlx.DB) ([]Message, error) {
	var messages []Message
	err := db.Select(
		&messages,
		`SELECT id, name, email, message FROM messages WHERE status = 'PENDING' LIMIT 50`,
	)
	return messages, err
}

func UpdateMessageStatus(db *sqlx.DB, ids []int, status string) error {
	if len(ids) == 0 {
		return nil
	}

	placeholders := make([]string, len(ids))
	for i := range placeholders {
		placeholders[i] = "?"
	}

	query := fmt.Sprintf("UPDATE messages SET status = ? WHERE id IN (%s)", strings.Join(placeholders, ","))

	args := make([]interface{}, len(ids)+1)
	args[0] = status
	for i, id := range ids {
		args[i+1] = id
	}

	_, err := db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("error updating message status: %v", err)
	}

	return err
}