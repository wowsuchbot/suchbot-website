import type { APIRoute } from 'astro';
import satori from 'satori';

// Load Inter font - fetch TTF from Google Fonts (old User-Agent returns TTF URLs)
async function loadFont(): Promise<ArrayBuffer> {
	const cssRes = await fetch(
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
		{
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
			},
		}
	);
	const css = await cssRes.text();
	const urlMatch = css.match(/url\((https:\/\/[^)]+)\) format\('(opentype|truetype)'\)/);
	if (!urlMatch) {
		// Fallback: use fontsource CDN for Inter 700
		const fallback = await fetch(
			'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff2'
		);
		return fallback.arrayBuffer();
	}
	const fontRes = await fetch(urlMatch[1]);
	return fontRes.arrayBuffer();
}

export const GET: APIRoute = async () => {
	const fontData = await loadFont();

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(180deg, #24243e 0%, #302b63 50%, #0f0c29 100%)',
					padding: 40,
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: 20,
								left: 20,
								right: 20,
								bottom: 20,
								borderRadius: 20,
								border: '2px solid rgba(255,255,255,0.1)',
							},
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 20,
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: 120,
											fontWeight: 700,
											color: 'white',
											textAlign: 'center',
											fontFamily: 'Inter',
										},
										children: 'Suchbot',
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: 60,
											fontWeight: 400,
											color: '#e0e0e0',
											textAlign: 'center',
											fontFamily: 'Inter',
										},
										children: 'Art + Revenue 👹',
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: 30,
											fontWeight: 400,
											color: '#808080',
											textAlign: 'center',
											fontFamily: 'Inter',
										},
										children: 'bot.mxjxn.xyz',
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Inter',
					data: fontData,
					weight: 400,
					style: 'normal',
				},
				{
					name: 'Inter',
					data: fontData,
					weight: 700,
					style: 'normal',
				},
			],
		}
	);

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400',
		},
	});
};
