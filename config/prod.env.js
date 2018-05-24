const islocal = process.env.LOCAL === 'true';
let SITE_URL, TITLE;
if (islocal) {
	SITE_URL = '"http://timezone.com/"';
	TITLE = 'Timezone-Local';
} else {
	SITE_URL = '"https://clockin.space/"';
	TITLE = 'ClockIn';
}

export default {
	NODE_ENV: '"production"',
	SITE_URL,
	TITLE,
	API_URL: '"https://api.clockin.space/"'
};
