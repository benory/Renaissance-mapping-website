# Map correction reports

The map fills in the Event ID from the selected marker. The Cloudflare Worker verifies the Turnstile token and forwards the report to a separate Google Form. The Event ID is a text value so leading zeros are preserved.

1. Create a Google Form titled **Mapping the Musical Renaissance — Corrections** with three required questions.

   | Question | Type | Worker variable |
   | --- | --- | --- |
   | Event ID | Short answer | `GOOGLE_FORM_ENTRY_EVENT_ID` |
   | Correction | Paragraph | `GOOGLE_FORM_ENTRY_DESCRIPTION` |
   | Email address | Short answer | `GOOGLE_FORM_ENTRY_EMAIL` |

   Publish the responder form with anonymous access for the Worker. Keep the response summary and any linked spreadsheet private. Use a regular short-answer question for the email address. In Google Forms, choose **Pre-fill form**, enter distinct sample values, and use the resulting URL to match the `entry.*` parameter names to the questions. Use the responder URL with `/formResponse` in place of `/viewform` for `GOOGLE_FORM_POST_URL`.

2. In Cloudflare Turnstile, add a Managed widget for `renaissancemapping.org` and `www.renaissancemapping.org`. Copy `wrangler.toml.example` to `wrangler.toml` and set the Google Forms variables. The following commands create the Worker secret and deploy the Worker.

   ```sh
   npx wrangler secret put TURNSTILE_SECRET_KEY --config cloudflare/wrangler.toml
   npx wrangler deploy --config cloudflare/wrangler.toml
   ```

3. Set `correction_report.worker_url` and `correction_report.turnstile_sitekey` in the Jekyll `_config.yml`. The public site key belongs in that file. Keep the secret key in Cloudflare. Restart a running Jekyll development server after changing `_config.yml`.

4. After publishing the site configuration, open a map event, submit a test correction, and confirm that Google Forms recorded the matching Event ID, description, and reply address. If the project account should receive notifications, open the form as that account and enable email notifications for new responses.
