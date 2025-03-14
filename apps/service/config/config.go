package config

import (
	"os"
)

var (
	Port            = getEnvWithFallback("PORT", "3333")
	Dsn             = getEnvWithFallback("DB_CONNECTION_STRING", "adb_user:adbpassword@tcp(localhost:3306)/campaign_mailer")
	RecaptchaSecret = getEnvWithFallback("RECAPTCHA_SECRET", "")
)

func getEnvWithFallback(key string, fallback string) string {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	return v
}

var EmailSettings = map[string]struct {
	FromDomain string
	Subject    string
	To         string
}{
	"duck":   {FromDomain: "helptheducks.com", Subject: "Prosecute Reichardt Duck Farm for Animal Abuse", To: "carla.rodriguez@sonoma-county.org"},
	"sonoma": {FromDomain: "righttorescue.com", Subject: "Prosecute animal cruelty, not animal rescuers", To: "carla.rodriguez@sonoma-county.org"},
	"ridglan": {FromDomain: "righttorescue.com", Subject: "Prosecute animal abuse at Ridglan Farms", To: "ismael.ozanne@da.wi.gov"},
	"test":   {FromDomain: "righttorescue.com", Subject: "Test", To: "tech@directactioneverywhere.com"},
}
