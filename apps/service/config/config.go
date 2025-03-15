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

var helpTheChickensRecipients = []string{
	"kmcdonnell@cityofpetaluma.org",
	"knau@cityofpetaluma.org",
	"jshribbs@cityofpetaluma.org",
	"fquint@cityofpetaluma.org",
	"Jcaderthompson@cityofpetaluma.org",
	"adecarli@cityofpetaluma.org",
	"bbarnacle@cityofpetaluma.org"}

var EmailSettings = map[string]struct {
	FromDomain string
	Subject    string
	To         []string
}{
	"duck":    {FromDomain: "helptheducks.com", Subject: "Prosecute Reichardt Duck Farm for Animal Abuse", To: []string{"carla.rodriguez@sonoma-county.org"}},
	"chicken": {FromDomain: "helpthechickens.com", Subject: "Shut Down Perdue's Petaluma Poultry Slaughterhouse to End Animal Abuse and Protect Public Health", To: helpTheChickensRecipients},
	"sonoma":  {FromDomain: "righttorescue.com", Subject: "Prosecute animal cruelty, not animal rescuers", To: []string{"carla.rodriguez@sonoma-county.org"}},
	"ridglan": {FromDomain: "righttorescue.com", Subject: "Prosecute animal abuse at Ridglan Farms", To: []string{"ismael.ozanne@da.wi.gov"}},
	"test":    {FromDomain: "righttorescue.com", Subject: "Test", To: []string{"tech@directactioneverywhere.com"}},
}
