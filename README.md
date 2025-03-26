# DxE Petitions Sites monorepo

Monolithic (multi-project / multi-package) repository for petition websites.

Note: some petition websites may still have their own repos.

## monorepo setup

We use Turborepo to manage this monorepo of petition websites.

Note Turbo currently ignores the Go project in apps/service since there is no
package.json.

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

Run the dev server for one website:

```bash
pnpm dev --filter helptheducks.com`
```

Or: `cd apps/helptheducks.com` and `pnpm dev`.

Run the dev server for one website and some dependencies:

```bash
pnpm dev --filter helptheducks.com --filter @dxe/email-petition --filter @dxe/petitions-components
```

The above command will make changes to the email-petition component become live
immediately in the browser window for helptheducks website dev server.

Develop all apps and packages together:

```bash
pnpm dev
```

### Turborepo Links

Learn more about Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## Environment variables

Each petition website has `.env.development` and `.env.production` environment
variable files. The development file is used with `pnpm dev` and production with
`pnpm build && pnpm start`.

Below are variables used to configure the websites.

`NEXT_PUBLIC_` prefix allows these variables to be substituted during build time
into the static files served publicly to users' browsers.

### `NEXT_PUBLIC_PETITIONS_API_ROOT`

Base URL for the general petition service. This records tallys and then invokes
the signup service to subscribe the user to emails.

### `NEXT_PUBLIC_PETITION_ID`

The petition ID used by the petition service.

Prefix with `test:` to avoid contaminating the tally for the
real petition. The prefix is removed

### `NEXT_PUBLIC_CAMPAIGN_MAILER_API_ROOT`

Base URL for the petition mail service. It sends the emails to our targets.
It also records a tally of its own and records copies of messages sent.

### `NEXT_PUBLIC_CAMPAIGN_NAME`

The name of the campaign used by the petition mail service. Configured in
`apps/service/config/config.go`.

Points to configuration for emails such as sender and target emails, and subject
line. For testing, use the value `test`.

## Creating a new petition site

Start early on the AWS setup in case of any delays for domain verification for
SES (email) or ACM (cert for CloudFront).

Note in AWS the region we use is `us-west-2`.

### Buy new domain

Buy a domain for the petition in Namecheap.

### Copy existing site

Make a copy of an existing petition website, such as the most recently created
one. Update the petition component props, Google Analytics tag, `.env` files,
layout file and homepage files, images and any other references to the old
petition.

See [environment variables](#environment-variables) for details about the `.env`
files.

### Debug configuration

Choose an unused default port number to use in the the package.json "dev" script
and add it to the forwarded ports in `devcontainer.json`.

Please add a launch configuration in `launch.json` and include it in to the "all websites" compound configuration.

### Image optimization

Convert any new PNGs to JPGs. Make sure JPGs are a reasonable size.

### Mail petition service

Update the service with configuration to send mail from the petition domain.

### Captcha

Add the petition domain to the captcha in Google reCAPTCHA Admin.

### Create new identity in AWS SES

Set up MX records.

Set up and verify DKIM.

Create and verify a custom MAIL FROM with domain `mail.<petition-domain>`.
This is just for identifying the server that sends mail. No mail is actually
sent from or received at this domain.

### Create new bucket in AWS S3

Allow all public access unless you want to figure out permissions for deployment
and CloudFront.

Under properties, enable static website hosting.
Set the index document to `index.html`.

### Create new distribution in CloudFront

Target the S3 bucket's website endpoint. If turned on static website hosting
in S3, AWS will prompt you to set it correctly when you update the "origin
domain" field.

Example:

- Incorrect:
  - `helpthechickens.com.s3.us-west-2.amazonaws.com`
- Correct:
  - `helpthechickens.com.s3-website-us-west-2.amazonaws.com`

Set the alternate domain names to the petition domain, both with and without
`www.` prefix. (More instructions below will redirect one to the other.)

For "Custom SSL certificate" certificate, click "Request certificate", and
create a certificate for `www.` and @ domains, and verify ownership with DNS
records.

Set the price class to "Use only North America and Europe" (do not use all edge
locations).

Set behavior -> viewer protocol policy: "Redirect HTTP to HTTPS".

Check the box to enable IPv6 support.

Under "Function associations - optional", for Viewer request, choose
"Function type": "CloudFront functions" and
"Function ARN / Name": `redirect-to-www`. (Remember for this to work, `www.` has
to be added as alternate domain on the distribution, have the CNAME set up in
DNS, and for `www.` to be listed in the certificate.)

### Point domain to CloudFront

Point the domain in Namecheap to AWS Route 53 (so DNS can be managed by AWS
accounts and no need to share the domain registrar password all contributors.)

Create CNAME records `@` and `www` pointing to the domain name of the CloudFront
distribution found in AWS Console on the "General" tab for the distribution.

### Create and run GitHub workflow

Create a workflow file in .github/workflows and follow the other files as an
example.

Add variables and secrets in the GitHub repo settings:

- https://github.com/dxe/helptheducks.com/settings/variables/actions
- https://github.com/dxe/helptheducks.com/settings/secrets/actions

Run the workflow by pushing to the main branch or running it manually from here:

- https://github.com/dxe/helptheducks.com/actions
