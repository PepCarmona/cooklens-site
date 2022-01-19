const isSetup = false;

export function setFeature(key: string): void {
	const features: Record<string, boolean> = {
		...JSON.parse(localStorage.getItem('features')!),
	};

	if (key.startsWith('!')) {
		features[key.substring(1)] = false;
	} else {
		features[key] = true;
	}

	localStorage.setItem('features', JSON.stringify(features));
}

export function isFeatureEnabled(key: string): boolean {
	setupFeatureToggle();

	const features: Record<string, boolean> = JSON.parse(
		localStorage.getItem('features')!
	);

	return !!features && features[key];
}

export function setupFeatureToggle() {
	if (isSetup) {
		return;
	}

	const url = new URL(location.href);

	const features = url.searchParams.getAll('feature');

	features.forEach((feature) => setFeature(feature));
}
