import Head from 'next/head'
function getRedirectScript(url: string): string {
	return `setTimeout(function(){document.location.href = '${url}'}, 0)`
}

export default () => (
	<div>
		<Head>
			<title>Study Group Calendar</title>
			<link
				rel="canonical"
				href="webcal://jordanbpeterson.community/calendar.ics"
			/>
		</Head>

		<script>
			{getRedirectScript('webcal://jordanbpeterson.community/calendar.ics')}
		</script>

		<p>
			You should be automatically prompted to add the calendar subscription to
			your calendar application.
		</p>

		<p>
			If you are not automatically prompted then try
			<a href="webcal://jordanbpeterson.community/calendar.ics">
				clicking here
			</a>
			.
		</p>

		<p>
			If that doesn't work, you can manually subscribe to the calendar with the
			appropriate instructions and URL for your platform:
			<ul>
				<li>
					<a href="https://support.apple.com/kb/PH11523">MacOS</a>
				</li>
				<li>
					<a href="https://support.apple.com/kb/HT202361">iOS</a>
				</li>
				<li>
					<a href="https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DDesktop&hl=en&oco=1">
						Google/Android
					</a>
				</li>
				<li>
					<a href="https://support.office.com/en-us/article/Import-or-subscribe-to-a-calendar-in-Outlook-com-or-Outlook-on-the-web-CFF1429C-5AF6-41EC-A5B4-74F2C278E98C">
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
	</div>
)
