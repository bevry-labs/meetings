import Head from 'next/head'
import Page from '../client/components/page'

function getRedirectScript(url: string): string {
	return `setTimeout(function(){document.location.href = '${url}'}, 0)`
}

export default () => (
	<Page title="Study Group Calendar">
		<Head>
		<link
				rel="canonical"
				href="webcal://jordanbpeterson.community/calendar.ics"
			/>
		</Head>
		<script>
			{getRedirectScript('webcal://jordanbpeterson.community/calendar.ics')}
		</script>

		<p>
			You should be automatically prompted to add the calendar subscription to your calendar application.
		</p>

		<p>
			If you are not automatically prompted then try <a href="webcal://jordanbpeterson.community/calendar.ics">
				clicking here
			</a>.
		</p>

		<p>
			If that doesn't work, you can manually subscribe to the calendar with the
			appropriate instructions and URL for your platform:
			<ul>
				<li>
					<a href="/macos-calendar-support">MacOS</a>
				</li>
				<li>
					<a href="/ios-calendar-support">iOS</a>
				</li>
				<li>
					<a href="/google-calendar-support">
						Google/Android
					</a>
				</li>
				<li>
					<a href="/outlook-calendar-support">
						Outlook
					</a>
				</li>
			</ul>
			Calendar Subscription URL (Webcal):
			<br />
			<code>webcal://jordanbpeterson.community/calendar.ics</code>
			<br /> Calendar Subscription URL (HTTPS):
			<br />
			<code>https://jordanbpeterson.community/calendar.ics</code>
		</p>
	</Page>
)
