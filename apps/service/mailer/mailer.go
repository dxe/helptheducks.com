package mailer

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

func CreateClient() (*ses.SES, error) {
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	if accessKey == "" || secretKey == "" {
		return nil, fmt.Errorf("AWS credentials not set in environment variables")
	}

	s, err := session.NewSessionWithOptions(session.Options{
		Config: aws.Config{
			Region: aws.String("us-west-2"),
		},
	})
	if err != nil {
		return nil, fmt.Errorf("error creating AWS session: %v", err)
	}

	return ses.New(s), nil
}

type SendOptions struct {
	From    string
	ReplyTo string
	To      []string
	Subject string
	Body    string
}

func Send(client *ses.SES, options SendOptions) error {
	toAddresses := make([]*string, len(options.To))
	for i, address := range options.To {
		toAddresses[i] = aws.String(address)
	}

	emailInput := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: toAddresses,
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Text: &ses.Content{
					Data: aws.String(options.Body),
				},
			},
			Subject: &ses.Content{
				Data: aws.String(options.Subject),
			},
		},
		Source:           aws.String(options.From),
		ReplyToAddresses: []*string{aws.String(options.ReplyTo)},
	}
	result, err := client.SendEmail(emailInput)
	if err != nil {
		return fmt.Errorf("error sending email: %v", err)
	}

	fmt.Println("Email sent! Message ID:", *result.MessageId)
	return nil
}
